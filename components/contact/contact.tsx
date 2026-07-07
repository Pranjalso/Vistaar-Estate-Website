'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { SectionHeading } from '@/components/common/section-heading'
import { SITE } from '@/constants/site'

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({})
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; phone?: string; message?: string } = {}
    const emailValue = form.email.trim()
    const phoneValue = form.phone.trim()

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.'
    }

    if (!emailValue) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      newErrors.email = 'Please enter a valid email address.'
    }

    if (!phoneValue) {
      newErrors.phone = 'Phone number is required.'
    } else if (!/^\+?[\d\s()-]{7,}$/.test(phoneValue)) {
      newErrors.phone = 'Please enter a valid phone number.'
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitted(false)
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'contact',
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit the form. Please try again.')
      }

      setSubmitted(true)
      setForm({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactItems = [
    { icon: Phone, label: 'Call Us', value: SITE.phone, href: SITE.phoneHref },
    { icon: Mail, label: 'Email Us', value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: 'Visit Us', value: SITE.address },
  ]

  return (
    <section id="contact" className="scroll-mt-32 bg-background px-5 pt-32 pb-24 sm:px-6 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title="Begin your private consultation"
          highlight="private"
          description="Share a few details and our concierge team will be in touch to arrange your bespoke viewing experience."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div className="grid gap-4">
              {contactItems.map((item) => {
                const Icon = item.icon
                const content = (
                  <div className="flex items-start gap-4 rounded-2xl border border-gold/10 bg-white p-5 shadow-sm transition-colors hover:border-gold/40 hover:shadow-md">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-navy">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">{item.label}</p>
                      <p className="mt-1 text-navy">{item.value}</p>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a key={item.label} href={item.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-gold/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-gold">
                <Clock className="h-5 w-5" />
                <p className="text-xs uppercase tracking-widest">Office Hours</p>
              </div>
              <ul className="mt-4 space-y-2">
                {SITE.hours.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm">
                    <span className="text-navy/70">{h.day}</span>
                    <span className="text-navy font-medium">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white p-7 shadow-xl sm:p-9"
          >
            {submitError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {submitted && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Your message was sent successfully. We will contact you shortly.
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Jonathan Ashford"
                required
                error={errors.name}
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+91 98765 43210"
                required
                error={errors.phone}
              />
            </div>
            <div className="mt-5">
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="you@example.com"
                required
                error={errors.email}
              />
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-navy">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                placeholder="Tell us about the residence you're seeking..."
                className="w-full resize-none rounded-xl border border-gold/20 bg-cream/50 px-4 py-3 text-navy placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
              />
              {errors.message && <p className="mt-2 text-xs text-red-500">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy shadow-gold-glow transition-all hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:opacity-80 sm:py-4 sm:text-base"
            >
              {submitted ? (
                <>
                  <Check className="h-5 w-5 text-navy" />
                  Message Sent
                </>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-navy">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gold/20 bg-cream/50 px-4 py-3 text-navy placeholder:text-muted-foreground focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none"
      />
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  )
}