import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formType, name, email, phone, message, property } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s()-]{7,}$/
    const acceptedForms = ['contact', 'enquiry']

    if (!formType || !acceptedForms.includes(formType)) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      )
    }

    if (!name?.toString().trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!phone?.toString().trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (!phoneRegex.test(phone.toString().trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number' },
        { status: 400 }
      )
    }

    if (formType === 'contact' && !email?.toString().trim()) {
      return NextResponse.json(
        { error: 'Email is required for contact form submissions' },
        { status: 400 }
      )
    }

    if (email?.toString().trim() && !emailRegex.test(email.toString().trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!message?.toString().trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Prepare data for Google Sheets
    const timestamp = new Date().toISOString()
    const data = [
      timestamp,
      formType,
      name,
      email || '',
      phone,
      message || '',
      property || ''
    ]

    // Get Google Sheets config from environment variables
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.warn('Google Sheets API not configured - logging data instead')
      console.log('Form Data:', data)
      return NextResponse.json({ success: true, message: 'Form submitted successfully!' })
    }

    // Import google-auth-library dynamically (avoids issues with Edge runtime)
    const { google } = await import('googleapis')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // Append data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A:G', // Assuming Sheet1, columns A-G
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [data]
      }
    })

    console.log('Data saved to Google Sheets:', response.data)

    return NextResponse.json({ success: true, message: 'Form submitted successfully!' })

  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
