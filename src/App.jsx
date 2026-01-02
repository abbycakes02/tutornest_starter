import { useState } from 'react'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: '',
    subjects: [],
    biggestChallenge: '',
    helpfulFeatures: [],
    otherFeatures: ''
  })

  const [subjectInput, setSubjectInput] = useState('')

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      helpfulFeatures: prev.helpfulFeatures.includes(feature)
        ? prev.helpfulFeatures.filter(f => f !== feature)
        : [...prev.helpfulFeatures, feature]
    }))
  }

  const handleSubjectKeyDown = (e) => {
    if (e.key === 'Enter' && subjectInput.trim()) {
      e.preventDefault()
      if (!formData.subjects.includes(subjectInput.trim())) {
        setFormData(prev => ({
          ...prev,
          subjects: [...prev.subjects, subjectInput.trim()]
        }))
      }
      setSubjectInput('')
    }
  }

  const removeSubject = (subjectToRemove) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subjectToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create FormData for Google Forms
    const googleFormData = new FormData()

    // Map your form data to Google Forms entry IDs
    googleFormData.append('entry.838113747', formData.name) // Name
    googleFormData.append('entry.1795820772', formData.email) // Email
    googleFormData.append('entry.1494134963', formData.userType) // User type
    googleFormData.append('entry.154105894', formData.subjects.join(', ')) // Subjects (joined)
    googleFormData.append('entry.1124373127', formData.biggestChallenge) // Biggest challenge

    // Features (checkboxes) - append each selected feature
    formData.helpfulFeatures.forEach(feature => {
      googleFormData.append('entry.1385240457', feature)
    })

    googleFormData.append('entry.525312068', formData.otherFeatures) // Other features

    try {
      // Submit to Google Forms
      await fetch('https://docs.google.com/forms/d/e/1FAIpQLSeu5SBITvGoYNrNo2yIyQzFU1ZDxaxYYfD44k1xv6auuOBUmg/formResponse', {
        method: 'POST',
        body: googleFormData,
        mode: 'no-cors' // Important: Google Forms requires no-cors
      })

      // Show thank you page
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      // Still show thank you page even if there's an error (no-cors means we can't check response)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F1F5F9' }}>
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-xl shadow-sm border p-12" style={{ borderColor: '#E2E8F0' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#DBEAFE' }}>
              <svg className="w-8 h-8" style={{ color: '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-3" style={{ color: '#1E293B' }}>Thank you!</h2>
            <p className="text-lg mb-6" style={{ color: '#475569' }}>
              Your input will directly shape what we build.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3" style={{ color: '#1E293B' }}>What happens next:</h3>
              <ul className="space-y-2" style={{ color: '#64748B' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#3B82F6' }} className="mt-1">•</span>
                  <span>We'll analyze your feedback alongside 200+ other students</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#3B82F6' }} className="mt-1">•</span>
                  <span>You'll receive updates as we build (expect our first email in 2-3 weeks)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#3B82F6' }} className="mt-1">•</span>
                  <span>You'll get free early access when we launch</span>
                </li>
              </ul>
            </div>

            <p className="text-sm mb-8" style={{ color: '#64748B' }}>
              We sent a confirmation to <span className="font-semibold" style={{ color: '#1E293B' }}>{formData.email}</span>
            </p>

            {/* Share Section */}
            <div className="border-t pt-6" style={{ borderColor: '#E2E8F0' }}>
              <p className="font-semibold mb-4" style={{ color: '#1E293B' }}>Help us reach more students</p>

              {/* Copy Link Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://tutornest.net')
                  alert('Link copied!')
                }}
                className="w-full mb-3 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                style={{ backgroundColor: '#F1F5F9', color: '#1E293B' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#E2E8F0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F1F5F9'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link to Share
              </button>

              {/* Social Share Buttons */}
              <div className="flex gap-2">
                {/* Twitter */}
                <a
                  href="https://twitter.com/intent/tweet?text=Help%20build%20an%20AI%20tutor%20that%20actually%20teaches!&url=https://tutornest.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1DA1F2', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1A8CD8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1DA1F2'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://tutornest.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0A66C2', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#004182'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#0A66C2'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://tutornest.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#1877F2', color: '#FFFFFF' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#166FE5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1877F2'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F5F9' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            {/* Nest Icon */}
            <img
              src="/nest-icon.png"
              alt="TutorNest Logo"
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold" style={{ color: '#1E293B' }}>TutorNest</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight" style={{ color: '#1E293B' }}>
            We're building an AI tutor that helps you actually learn.
          </h1>

          <p className="text-xl mb-12" style={{ color: '#64748B' }}>
            Research-backed. Student-driven. Coming soon.
          </p>

          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Card 1: The Problem */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-left" style={{ borderColor: '#E2E8F0' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#FEE2E2' }}>
                <svg className="w-5 h-5" style={{ color: '#EF4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1E293B' }}>The Problem</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Most AI tutors just give answers. Students score 17% lower on tests—they're outsourcing thinking, not learning.
              </p>
            </div>

            {/* Card 2: Our Solution */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-left" style={{ borderColor: '#E2E8F0' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                <svg className="w-5 h-5" style={{ color: '#3B82F6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1E293B' }}>Our Solution</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                An AI tutor grounded in learning science that coaches you through problems instead of solving them for you.
              </p>
            </div>

            {/* Card 3: Who We Are */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-left" style={{ borderColor: '#E2E8F0' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F0FDF4' }}>
                <svg className="w-5 h-5" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#1E293B' }}>Who We Are</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Built by developmental psychologists who understand what techniques work.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg font-medium mb-2" style={{ color: '#1E293B' }}>
              Help us build exactly what you need.
            </p>
            <p className="text-base" style={{ color: '#64748B' }}>
              200+ students have already shared their input. Your answers determine what we prioritize.
            </p>
          </div>

        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Stage 1: About You */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: '#3B82F6' }}>
                1
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>About You</h2>
            </div>

          {/* Question 1: Name */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 1 of 7</div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-900 mb-3">
              What's your name?
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              placeholder="Your name"
            />
          </div>

          {/* Question 2: Email */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 2 of 7</div>
            <label htmlFor="email" className="block text-lg font-semibold text-gray-900 mb-3">
              What's your email?
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              placeholder="you@example.com"
            />
            <p className="text-sm text-gray-500 mt-2">We'll email you when we launch</p>
          </div>

          {/* Question 3: User Type */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 3 of 7</div>
            <div className="text-lg font-semibold text-gray-900 mb-4">I am a...</div>
            <div className="space-y-3">
              {['High school student', 'College student', 'Graduate student', 'Parent', 'Teacher'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>
          </div>
          </div>

          {/* Stage 2: Your Learning */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: '#3B82F6' }}>
                2
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>Your Learning</h2>
            </div>

          {/* Question 4: Subject Tags */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 4 of 7</div>
            <label htmlFor="subject" className="block text-lg font-semibold text-gray-900 mb-3">
              What subjects do you struggle with?
            </label>

            {/* Display tags */}
            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}
                  >
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input field */}
            <input
              type="text"
              id="subject"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              onKeyDown={handleSubjectKeyDown}
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              placeholder="Type a subject and press Enter (e.g., Math, Chemistry)"
            />
            <p className="text-xs mt-2" style={{ color: '#64748B' }}>Press Enter to add multiple subjects</p>
          </div>

          {/* Question 5: Biggest Challenge */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 5 of 7</div>
            <label htmlFor="biggestChallenge" className="block text-lg font-semibold text-gray-900 mb-3">
              What's your biggest challenge when studying?
            </label>
            <textarea
              id="biggestChallenge"
              name="biggestChallenge"
              value={formData.biggestChallenge}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base transition-colors resize-none"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              placeholder="Tell us what you struggle with..."
            />
          </div>
          </div>

          {/* Stage 3: What You Need */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: '#3B82F6' }}>
                3
              </div>
              <h2 className="text-xl font-semibold" style={{ color: '#1E293B' }}>What You Need</h2>
            </div>

          {/* Question 6: Features */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 6 of 7</div>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Which features would help you most?
            </div>
            <p className="text-sm text-gray-600 mb-4">(Select all that apply)</p>
            <div className="space-y-3">
              {[
                'Interactive step-by-step problem solving',
                'Fill-in-the-blank practice',
                'Instant feedback on wrong answers',
                'Diagrams/Visual aids',
                'Quiz yourself with MCQs',
                'Video explanations',
                'Get hints without seeing the answer'
              ].map((feature) => (
                <label key={feature} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.helpfulFeatures.includes(feature)}
                    onChange={() => handleCheckboxChange(feature)}
                    className="w-5 h-5 mt-0.5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-base text-gray-700 group-hover:text-gray-900">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 7: Other Features */}
          <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8" style={{ borderColor: '#E2E8F0' }}>
            <div className="text-sm text-gray-500 mb-2">Question 7 of 7</div>
            <label htmlFor="otherFeatures" className="block text-lg font-semibold text-gray-900 mb-3">
              What other features would you want to see in an AI tutor?
            </label>
            <textarea
              id="otherFeatures"
              name="otherFeatures"
              value={formData.otherFeatures}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base transition-colors resize-none"
              style={{ borderColor: '#E2E8F0', color: '#1E293B' }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              placeholder="Share any ideas you have..."
            />
          </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="text-white font-semibold px-12 py-4 rounded-lg text-lg transition-all shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#3B82F6' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
            >
              Share My Input →
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          200+ students have already shared their input
        </div>
      </div>
    </div>
  )
}

export default App
