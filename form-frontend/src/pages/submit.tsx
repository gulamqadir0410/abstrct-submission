'use client'

import { useState } from 'react'
import { User, Mail, Phone, FileText, Upload, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, MapPin } from 'lucide-react'

export default function SubmitAbstractForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    category: '',
    track: '',
    address: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    const body = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      body.append(key, value)
    })
    if (file) body.append('abstractFile', file)

    try {
      const res = await fetch('/api/submit-abstract', {
        method: 'POST',
        body,
      })

      if (!res.ok) throw new Error('Submission failed')

      // ✅ Reset all fields after success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: '',
        track: '',
        address: '',
      })
      setFile(null)
      setStep(1)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const isStep1Valid = formData.firstName && formData.lastName && formData.email && formData.phone
  const isStep2Valid = formData.category && formData.track && formData.address && file

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{
        background: 'linear-gradient(135deg, hsl(220 14% 96%) 0%, hsl(262 83% 58% / 0.1) 50%, hsl(346 77% 49% / 0.1) 100%)'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-in { animation: slideIn 0.5s ease-out; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out; }
        .gradient-primary {
          background: linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(346 77% 49%) 100%);
        }
        .gradient-success {
          background: linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(158 64% 52%) 100%);
        }
        .gradient-card {
          background: linear-gradient(145deg, hsl(0 0% 100% / 0.9) 0%, hsl(0 0% 100% / 0.7) 100%);
        }
        .shadow-glow {
          box-shadow: 0 0 20px hsl(262 83% 58% / 0.3);
        }
        .shadow-soft {
          box-shadow: 0 4px 16px hsl(220 13% 69% / 0.1);
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 gradient-primary text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-glow">
            <FileText className="w-4 h-4" />
            Abstract Submission Portal
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Your Abstract</h1>
          <p className="text-gray-600 text-lg">Share your research with the academic community</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 animate-slide-in">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              step >= 1 ? 'gradient-primary text-white shadow-soft' : 'bg-gray-100 text-gray-500'
            }`}>
              <User className="w-4 h-4" />
              <span className="font-medium">Personal Info</span>
            </div>
            <div className={`w-8 h-0.5 transition-all duration-300 ${
              step >= 2 ? 'bg-purple-500' : 'bg-gray-300'
            }`} />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              step >= 2 ? 'gradient-primary text-white shadow-soft' : 'bg-gray-100 text-gray-500'
            }`}>
              <FileText className="w-4 h-4" />
              <span className="font-medium">Abstract Details</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mb-6 animate-scale-in">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800">Submission Successful!</h3>
                <p className="text-green-700 text-sm">Your abstract has been received and will be reviewed shortly.</p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 animate-scale-in">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Submission Failed</h3>
                <p className="text-red-700 text-sm">Please check your information and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="gradient-card backdrop-blur-sm border border-gray-200 rounded-2xl shadow-soft p-8 animate-scale-in">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Personal Information</h2>
                  <p className="text-gray-600">Tell us about yourself</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      First Name
                    </label>
                    <input
                      className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      Last Name
                    </label>
                    <input
                      className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    Email Address
                  </label>
                  <input
                    className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                    name="email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    Phone Number
                  </label>
                  <input
                    className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid || loading}
                  className="w-full gradient-primary text-white p-4 rounded-lg font-medium transition-all duration-200 hover:shadow-glow hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  Continue to Abstract Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Abstract Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Abstract Details</h2>
                  <p className="text-gray-600">Provide details about your research</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Category
                    </label>
                    <input
                      className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                      name="category"
                      placeholder="Research category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Track */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      Track Name
                    </label>
                    <input
                      className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500"
                      name="track"
                      placeholder="Conference track"
                      value={formData.track}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    Address
                  </label>
                  <textarea
                    className="w-full border border-gray-300 bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 hover:border-purple-400 text-gray-900 placeholder:text-gray-500 resize-none"
                    name="address"
                    placeholder="Your complete address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    required
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-600" />
                    Abstract File (PDF)
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 text-center ${
                      dragActive
                        ? 'border-purple-500 bg-purple-50 shadow-glow'
                        : file
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-purple-400 bg-white/50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                    
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                          <p className="font-medium text-green-800">{file.name}</p>
                          <p className="text-sm text-gray-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                        <p className="text-lg font-medium text-gray-900">
                          Drop your PDF here or click to browse
                        </p>
                        <p className="text-sm text-gray-600">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!isStep2Valid || loading}
                    className="flex items-center gap-2 gradient-success text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-glow hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Submit Abstract
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600 animate-fade-in">
          <p>Having trouble? Contact our support team for assistance.</p>
        </div>
      </div>
    </div>
  )
}