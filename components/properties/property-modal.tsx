'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarClock, Check, MapPin, Maximize, Phone, Send, X } from 'lucide-react'
import { getAmenityIcon } from '@/lib/amenity-icons'
import { SITE } from '@/constants/site'
import type { Property } from '@/types'

export function PropertyModal({
  property,
  onClose,
}: {
  property: Property | null
  onClose: () => void
}) {
  const [activeImage, setActiveImage] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({})
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string; message?: string } = {}
    const phoneValue = form.phone.trim()

    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!phoneValue) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s()-]{7,}$/.test(phoneValue)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required'
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
          formType: 'enquiry',
          name: form.name.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          property: property?.name,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit the form. Please try again.')
      }

      setSubmitted(true)
      setForm({ name: '', phone: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setActiveImage(0)
    setSubmitted(false)
    setSubmitError('')
    setErrors({})
    setForm({ name: '', phone: '', message: '' })
  }, [property])

  useEffect(() => {
    if (!property) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [property, onClose])

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/60 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-[94svh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-border/70 bg-card shadow-luxury no-scrollbar max-lg:overflow-y-auto lg:max-h-[88vh] lg:grid-cols-[1fr_1fr] lg:h-[88vh]"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-transform hover:scale-105 border border-gold/20"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Gallery - Left Side */}
            <div className="flex flex-col gap-3 bg-cream/50 p-4 sm:p-5 lg:h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl flex-1">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={property.images[activeImage] || '/placeholder.svg'}
                    alt={`${property.name} view ${activeImage + 1}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <span className="absolute left-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold text-navy shadow-gold-glow">
                  {property.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {property.images.map((img, i) => (
                  <button
                    key={img + i}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === i ? 'border-gold ring-2 ring-gold/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img || '/placeholder.svg'} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details - Right Side */}
            <div className="flex flex-col p-5 sm:p-6 lg:p-7 overflow-y-auto">
              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-gold-dark">
                <MapPin className="h-3.5 w-3.5" />
                {property.location}
              </div>
              
              {/* Property Name */}
              <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-navy sm:text-3xl">
                {property.name}
              </h3>
              
              {/* Price */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Starting from</span>
                <span className="text-gradient-gold font-serif text-2xl font-semibold">{property.priceLabel}</span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {property.longDescription}
              </p>

              {/* Specs Grid */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {property.specs.map((spec) => (
                  <div key={spec.label} className="rounded-xl bg-cream px-2 py-2.5 text-center">
                    <p className="text-sm font-semibold text-navy">{spec.value}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{spec.label}</p>
                  </div>
                ))}
              </div>

              {/* Area & Possession */}
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-navy/80">
                  <Maximize className="h-3.5 w-3.5 text-gold-dark" /> {property.area}
                </span>
                <span className="flex items-center gap-1.5 text-navy/80">
                  <CalendarClock className="h-3.5 w-3.5 text-gold-dark" /> {property.possession}
                </span>
              </div>

              {/* Amenities */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Amenities
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {property.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity)
                    return (
                      <span
                        key={amenity}
                        className="flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-navy/80"
                      >
                        <Icon className="h-3.5 w-3.5 text-gold-dark" />
                        {amenity}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Location Highlights
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {property.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-navy/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enquiry Form Section */}
              <div className="mt-4 rounded-2xl border border-gold/20 bg-cream/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-dark">
                  Enquire Now
                </p>
                <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                  {submitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {submitError}
                    </div>
                  )}
                  {submitted && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Your enquiry was sent successfully. We will contact you shortly.
                    </div>
                  )}
                  
                  {/* Name Field */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-navy/70">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full rounded-lg border border-gold/20 bg-white/80 px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                    {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name}</p>}
                  </div>
                  
                  {/* Phone Field */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-navy/70">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-gold/20 bg-white/80 px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                    {errors.phone && <p className="mt-1 text-[10px] text-red-500">{errors.phone}</p>}
                  </div>
                  
                  {/* Message Field */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-navy/70">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={2}
                      placeholder="Tell us about your requirements..."
                      className="w-full resize-none rounded-lg border border-gold/20 bg-white/80 px-3 py-2 text-sm text-navy placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
                    />
                    {errors.message && <p className="mt-1 text-[10px] text-red-500">{errors.message}</p>}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || submitted}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2.5 text-xs font-semibold text-navy shadow-gold-glow disabled:cursor-not-allowed disabled:opacity-80 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : submitted ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Enquiry Sent
                        </>
                      ) : (
                        <>
                          Send Enquiry
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </motion.button>
                    <motion.a
                      href={SITE.phoneHref}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-white/80 px-4 py-2.5 text-xs font-semibold text-navy transition-all hover:border-gold/60 hover:bg-gold/5 hover:text-gold-dark"
                      aria-label="Call us"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">Call</span>
                    </motion.a>
                  </div>
                </form>
              </div>

              {/* Close Button */}
              <div className="mt-3">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-gold/60 hover:text-gold-dark"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}