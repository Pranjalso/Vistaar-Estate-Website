'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SITE } from '@/constants/site'

export function FloatingActions() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean; message?: boolean }>({})
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({})
  const [showTooltip, setShowTooltip] = useState<'whatsapp' | 'enquiry' | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeEnquiry()
      }
    }
    if (isEnquiryOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEnquiryOpen])

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnquiry()
    }
    if (isEnquiryOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isEnquiryOpen])

  // Auto-hide tooltip after 3 seconds
  useEffect(() => {
    if (showTooltip) {
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(null)
      }, 3000)
    }
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [showTooltip])

  const openEnquiry = () => {
    setIsEnquiryOpen(true)
    setErrors({})
    setTouched({})
    setSubmitError('')
    setShowTooltip(null)
  }

  const closeEnquiry = () => {
    setIsEnquiryOpen(false)
    setIsSuccess(false)
    setSubmitError('')
    setFormData({ name: '', email: '', phone: '', message: '' })
    setErrors({})
    setTouched({})
  }

  // Validation functions
  const validateName = (name: string): string => {
    if (!name.trim()) return 'Full name is required'
    if (name.trim().length < 2) return 'Name must be at least 2 characters'
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) return 'Name contains invalid characters'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return '' // Optional field
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'Phone number is required'
    // Remove spaces, dashes, parentheses for validation
    const clean = phone.trim().replace(/[\s()-]/g, '')
    if (!/^\+?[\d]{7,15}$/.test(clean)) {
      return 'Please enter a valid phone number (7-15 digits)'
    }
    return ''
  }

  const validateMessage = (message: string): string => {
    if (!message.trim()) return 'Message is required'
    if (message.trim().length < 10) return 'Message must be at least 10 characters'
    if (message.trim().length > 1000) return 'Message must be less than 1000 characters'
    return ''
  }

  const validateField = (field: keyof typeof formData, value: string): string => {
    switch (field) {
      case 'name': return validateName(value)
      case 'email': return validateEmail(value)
      case 'phone': return validatePhone(value)
      case 'message': return validateMessage(value)
      default: return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      message: validateMessage(formData.message),
    }

    // Remove empty errors
    const filteredErrors: typeof errors = {}
    Object.entries(newErrors).forEach(([key, value]) => {
      if (value) filteredErrors[key as keyof typeof errors] = value
    })

    setErrors(filteredErrors)
    // Mark all fields as touched for validation display
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    })

    return Object.keys(filteredErrors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate field on change
    const error = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }

  const handleBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    
    // Validate all fields
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
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to submit the enquiry. Please try again.')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => {
        closeEnquiry()
      }, 3000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the enquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in learning more about your luxury properties at ${SITE.name}.`
    )
    window.open(`https://wa.me/${SITE.whatsapp}?text=${message}`, '_blank')
    setShowTooltip(null)
  }

  // Button variants for staggered animation
  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        delay: 0.3,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 17,
      },
    },
    tap: {
      scale: 0.92,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 17,
      },
    },
  }

  const formContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.12,
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  }

  // Get field status for styling
  const getFieldStatus = (field: keyof typeof formData) => {
    const isTouched = touched[field]
    const error = errors[field]
    const value = formData[field]
    
    if (!isTouched && !value) return 'idle'
    if (error) return 'error'
    if (value && !error) return 'success'
    return 'idle'
  }

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3 sm:right-6">
        {/* WhatsApp Button with Label */}
        <div className="relative flex items-center gap-3">
          <AnimatePresence>
            {showTooltip === 'whatsapp' && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative whitespace-nowrap rounded-lg bg-navy/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                <span className="text-gold-light">Chat with us</span> on WhatsApp
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 h-2 w-2 bg-navy/90" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            custom={0}
            variants={buttonVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setShowTooltip('whatsapp')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
            className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.5)] transition-all hover:shadow-[0_12px_40px_-8px_rgba(37,211,102,0.7)] sm:h-16 sm:w-16"
          >
            <FaWhatsapp className="h-7 w-7 sm:h-8 sm:w-8" />
            
            {/* Pulse animation ring */}
            <motion.span
              className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/30"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
            
            {/* Hover glow effect */}
            <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
          </motion.button>
        </div>

        {/* Enquiry Button with Label */}
        <div className="relative flex items-center gap-3">
          <AnimatePresence>
            {showTooltip === 'enquiry' && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative whitespace-nowrap rounded-lg bg-navy/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
              >
                <span className="text-gold-light">Send enquiry</span> about properties
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 h-2 w-2 bg-navy/90" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            custom={1}
            variants={buttonVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={() => setShowTooltip('enquiry')}
            onMouseLeave={() => setShowTooltip(null)}
            onClick={openEnquiry}
            aria-label="Send enquiry"
            className="group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-gold-light via-gold to-gold-dark text-navy shadow-[0_8px_30px_-6px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_12px_40px_-8px_rgba(212,175,55,0.6)] sm:h-16 sm:w-16"
          >
            <Send className="h-5 w-5 sm:h-6 sm:w-6" />
            
            {/* Hover glow effect */}
            <span className="absolute inset-0 -z-10 rounded-full bg-gold opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
          </motion.button>
        </div>
      </div>

      {/* Enquiry Panel */}
      <AnimatePresence>
        {isEnquiryOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 bg-navy/30 backdrop-blur-sm"
              onClick={closeEnquiry}
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ 
                type: 'spring',
                stiffness: 350,
                damping: 28
              }}
              className="fixed bottom-24 right-5 z-70 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl bg-white shadow-2xl backdrop-blur-xl sm:bottom-28 sm:right-6 sm:w-80"
            >
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-2xl border-b border-gold/10 bg-linear-to-r from-gold-light/10 via-gold/5 to-transparent px-4 py-3">
                <div>
                  <h3 className="font-serif text-base font-semibold text-navy">Send Enquiry</h3>
                  <p className="text-[11px] text-muted-foreground">We'll respond within 24 hours</p>
                </div>
                <button
                  onClick={closeEnquiry}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-cream"
                >
                  <X className="h-3.5 w-3.5 text-navy/60" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-6 text-center"
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-navy">Enquiry Sent!</h4>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Our concierge team will reach out shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-3"
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {submitError && (
                      <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-navy/70">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-2.5 top-1/2 -translate-y-1/2" variants={iconVariants}>
                          <User className={`h-3.5 w-3.5 transition-colors ${
                          getFieldStatus('name') === 'error' ? 'text-red-400' : 
                          getFieldStatus('name') === 'success' ? 'text-emerald-500' : 'text-gold-dark/50'
                        }`} />
                        </motion.div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="Jonathan Ashford"
                          className={`
                            w-full rounded-lg border bg-cream/30 px-8 py-2 text-xs text-navy placeholder:text-muted-foreground/60 
                            transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20
                            ${errors.name && touched.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}
                            ${!errors.name && formData.name && touched.name ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-200' : 'border-gold/20'}
                          `}
                        />
                        {touched.name && !errors.name && formData.name && (
                          <CheckCircle className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-500" />
                        )}
                      </div>
                      {errors.name && touched.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-navy/70">
                        Email <span className="text-muted-foreground/60">(optional)</span>
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-2.5 top-1/2 -translate-y-1/2" variants={iconVariants}>
                          <Mail className={`h-3.5 w-3.5 transition-colors ${
                          getFieldStatus('email') === 'error' ? 'text-red-400' : 
                          getFieldStatus('email') === 'success' ? 'text-emerald-500' : 'text-gold-dark/50'
                        }`} />
                        </motion.div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="you@example.com"
                          className={`
                            w-full rounded-lg border bg-cream/30 px-8 py-2 text-xs text-navy placeholder:text-muted-foreground/60 
                            transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20
                            ${errors.email && touched.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}
                            ${!errors.email && formData.email && touched.email ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-200' : 'border-gold/20'}
                          `}
                        />
                        {touched.email && !errors.email && formData.email && (
                          <CheckCircle className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-500" />
                        )}
                      </div>
                      {errors.email && touched.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-navy/70">
                        Phone <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-2.5 top-1/2 -translate-y-1/2" variants={iconVariants}>
                          <Phone className={`h-3.5 w-3.5 transition-colors ${
                          getFieldStatus('phone') === 'error' ? 'text-red-400' : 
                          getFieldStatus('phone') === 'success' ? 'text-emerald-500' : 'text-gold-dark/50'
                        }`} />
                        </motion.div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          placeholder="+91 98765 43210"
                          className={`
                            w-full rounded-lg border bg-cream/30 px-8 py-2 text-xs text-navy placeholder:text-muted-foreground/60 
                            transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20
                            ${errors.phone && touched.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}
                            ${!errors.phone && formData.phone && touched.phone ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-200' : 'border-gold/20'}
                          `}
                        />
                        {touched.phone && !errors.phone && formData.phone && (
                          <CheckCircle className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-500" />
                        )}
                      </div>
                      {errors.phone && touched.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-navy/70">
                        Message <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <motion.div className="absolute left-2.5 top-2.5" variants={iconVariants}>
                          <MessageSquare className={`h-3.5 w-3.5 transition-colors ${
                          getFieldStatus('message') === 'error' ? 'text-red-400' : 
                          getFieldStatus('message') === 'success' ? 'text-emerald-500' : 'text-gold-dark/50'
                        }`} />
                        </motion.div>
                        <textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          onBlur={() => handleBlur('message')}
                          placeholder="Tell us about the residence you're seeking..."
                          rows={2}
                          className={`
                            w-full resize-none rounded-lg border bg-cream/30 px-8 py-2 text-xs text-navy placeholder:text-muted-foreground/60 
                            transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20
                            ${errors.message && touched.message ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}
                            ${!errors.message && formData.message && touched.message ? 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-200' : 'border-gold/20'}
                          `}
                        />
                      </div>
                      {errors.message && touched.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-[10px] text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          {errors.message}
                        </motion.p>
                      )}
                      {touched.message && !errors.message && formData.message && (
                        <p className="mt-1 text-[10px] text-emerald-500 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Message looks good
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-gold-light via-gold to-gold-dark py-2.5 text-xs font-semibold text-navy shadow-gold-glow transition-all hover:shadow-[0_8px_25px_-6px_rgba(212,175,55,0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="h-3.5 w-3.5 border-2 border-navy/30 border-t-navy rounded-full"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Send Enquiry
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}