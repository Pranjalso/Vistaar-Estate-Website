const { google } = require('googleapis');
require('dotenv').config();

async function testGoogleSheets() {
  try {
    console.log('=== Testing Google Sheets API ===');

    // Get environment variables
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

    // Fix private key (replace escaped newlines)
    if (GOOGLE_PRIVATE_KEY) {
      GOOGLE_PRIVATE_KEY = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    }

    // Check credentials
    console.log('\n1. Checking credentials:');
    if (!GOOGLE_SHEET_ID) {
      console.error('❌ GOOGLE_SHEET_ID is missing from .env');
      process.exit(1);
    }
    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_EMAIL is missing from .env');
      process.exit(1);
    }
    if (!GOOGLE_PRIVATE_KEY) {
      console.error('❌ GOOGLE_PRIVATE_KEY is missing from .env');
      process.exit(1);
    }
    console.log('✅ All credentials found');

    // Authenticate
    console.log('\n2. Authenticating with Google Sheets API...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test 1: Get spreadsheet info
    console.log('3. Fetching spreadsheet info...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_SHEET_ID
    });
    console.log('✅ Spreadsheet found:', spreadsheet.data.properties.title);

    // Test 2: Get sheet names
    console.log('4. Available sheets:');
    spreadsheet.data.sheets.forEach(sheet => {
      console.log('   -', sheet.properties.title);
    });

    // Test 3: Write test data
    console.log('\n5. Writing test data...');
    const testData = [
      new Date().toISOString(),
      'test',
      'Test User',
      'test@example.com',
      '+91 98765 43210',
      'This is a test message',
      'Test Property'
    ];

    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [testData]
      }
    });

    console.log('✅ Test data written successfully!');
    console.log('   - Updated range:', appendResult.data.updates.updatedRange);
    console.log('   - Updated cells:', appendResult.data.updates.updatedCells);

    console.log('\n🎉 All tests passed! Check your Google Sheet!');
    console.log('Spreadsheet URL:', `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testGoogleSheets();
