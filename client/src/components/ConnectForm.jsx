import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import './ConnectForm.css';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'USA (+1)' },
  { code: '+44', country: 'GB', label: 'UK (+44)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+1', country: 'CA', label: 'Canada (+1)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
  { code: '+33', country: 'FR', label: 'France (+33)' },
  { code: '+81', country: 'JP', label: 'Japan (+81)' },
  { code: '+7', country: 'RU', label: 'Russia (+7)' },
  { code: '+86', country: 'CN', label: 'China (+86)' },
  { code: '+27', country: 'ZA', label: 'South Africa (+27)' },
  { code: '+55', country: 'BR', label: 'Brazil (+55)' },
  { code: '+39', country: 'IT', label: 'Italy (+39)' },
  { code: '+34', country: 'ES', label: 'Spain (+34)' },
  { code: '+31', country: 'NL', label: 'Netherlands (+31)' },
  { code: '+41', country: 'CH', label: 'Switzerland (+41)' },
  { code: '+46', country: 'SE', label: 'Sweden (+46)' },
  { code: '+47', country: 'NO', label: 'Norway (+47)' },
  { code: '+45', country: 'DK', label: 'Denmark (+45)' },
  { code: '+353', country: 'IE', label: 'Ireland (+353)' },
  { code: '+64', country: 'NZ', label: 'New Zealand (+64)' },
  { code: '+82', country: 'KR', label: 'South Korea (+82)' },
  { code: '+966', country: 'SA', label: 'Saudi Arabia (+966)' },
  { code: '+90', country: 'TR', label: 'Turkey (+90)' },
  { code: '+60', country: 'MY', label: 'Malaysia (+60)' },
  { code: '+66', country: 'TH', label: 'Thailand (+66)' },
  { code: '+62', country: 'ID', label: 'Indonesia (+62)' },
  { code: '+84', country: 'VN', label: 'Vietnam (+84)' },
  { code: '+63', country: 'PH', label: 'Philippines (+63)' },
  { code: '+30', country: 'GR', label: 'Greece (+30)' },
  { code: '+420', country: 'CZ', label: 'Czech Republic (+420)' },
  { code: '+48', country: 'PL', label: 'Poland (+48)' },
  { code: '+351', country: 'PT', label: 'Portugal (+351)' },
  { code: '+32', country: 'BE', label: 'Belgium (+32)' },
  { code: '+43', country: 'AT', label: 'Austria (+43)' },
  { code: '+358', country: 'FI', label: 'Finland (+358)' }
].sort((a, b) => (a.code === '+91' ? -1 : 1)); // Keep India at the top

const ConnectForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    venue: '',
    date: '',
    guestCount: '',
    source: '',
    message: '',
    isdCode: '+91'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 3;
  const displayProgress = step === 1 ? 10 : step === 2 ? 40 : 70;

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Restrict Phone and Guest Count to digits only
    if (name === 'phone' || name === 'guestCount') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
    }

    // Limit phone to 10 digits
    if (name === 'phone' && value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (s) => {
    let newErrors = {};
    if (s === 1) {
      if (!formData.name.trim()) newErrors.name = 'Please enter your name';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit number';
    } else if (s === 2) {
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.date) newErrors.date = 'Please select a date';
      if (formData.guestCount && isNaN(formData.guestCount)) {
        newErrors.guestCount = 'Please enter a valid number';
      }
    } else if (s === 3) {
      // Source and Message are now optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(step)) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    
    try {
      const apiData = {
        ...formData,
        phone: `${formData.isdCode} ${formData.phone}`,
        location: `${formData.venue}, ${formData.city}`,
        eventType: 'Wedding Photography'
      };

      const response = await api.post('/api/bookings', apiData);

      if (response.data.success) {
        toast.success('Your story has been received!');
        setStep(4);
      } else {
        toast.error(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('[Booking Error]', err);
      const errorMessage = err.response?.data?.message || err.message || 'Connection error';
      toast.error(`Error: ${errorMessage}. Please check your connection.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (step < totalSteps) nextStep();
        else if (step === totalSteps && formData.message) handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, formData]);

  return (
    <section className="connect-form-section">
      {/* ── Fixed Progress Header ── */}
      <div className="form-progress-header">
        <div 
          className="form-progress-bar" 
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      <div className="form-bg-glow"></div>
      
      <div className="pg-container">
        <div className="form-card-container">
          {step === 1 && (
            <div className="form-card">
              <div className="card-header">
                <span className="step-tag">Step 01</span>
                <h2>Personal Information</h2>
              </div>
              
              <div className="input-group">
                <label>Bride/Groom Name</label>
                <input 
                  type="text" name="name" placeholder="E.g. Akash & Priya"
                  value={formData.name} onChange={handleChange} autoFocus
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && (
                  <span className="error-text">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" name="email" placeholder="hello@example.com"
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="error-text">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="input-group">
                <label>Contact Number</label>
                <div className="phone-wrapper">
                  <select 
                    name="isdCode" 
                    value={formData.isdCode} 
                    onChange={handleChange}
                    className="isd-select"
                  >
                    {COUNTRY_CODES.map(country => (
                      <option key={country.code + country.country} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="tel" name="phone" placeholder="98765 43210"
                    value={formData.phone} onChange={handleChange}
                    inputMode="numeric" pattern="[0-9]*"
                    className={errors.phone ? 'input-error' : ''}
                  />
                </div>
                {errors.phone && (
                  <span className="error-text">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="card-footer">
                <button className="form-btn-next" onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
                <span className="hint-text">press <strong>Enter</strong> ↵</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-card">
              <div className="card-header">
                <span className="step-tag">Step 02</span>
                <h2>Event Details</h2>
              </div>
              
              <div className="form-grid-inner">
                <div className="input-group">
                  <label>Venue City</label>
                  <input 
                    type="text" name="city" placeholder="E.g. Mumbai"
                    value={formData.city} onChange={handleChange} autoFocus
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && (
                    <span className="error-text">
                      {errors.city}
                    </span>
                  )}
                </div>
                <div className="input-group">
                  <label>Event Date</label>
                  <input 
                    type="date" name="date"
                    value={formData.date} onChange={handleChange}
                    className={`date-input-clean ${errors.date ? 'input-error' : ''}`}
                  />
                  {errors.date && (
                    <span className="error-text">
                      {errors.date}
                    </span>
                  )}
                </div>
              </div>

              <div className="input-group">
                <label>Venue Name</label>
                <input 
                  type="text" name="venue" placeholder="E.g. Taj Lands End"
                  value={formData.venue} onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Expected Guest Count</label>
                <input 
                  type="text" name="guestCount" placeholder="Number of guests"
                  value={formData.guestCount} onChange={handleChange}
                  inputMode="numeric" pattern="[0-9]*"
                  className={errors.guestCount ? 'input-error' : ''}
                />
                {errors.guestCount && <span className="error-text">{errors.guestCount}</span>}
              </div>

              <div className="card-footer">
                <button className="form-btn-next" onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-card">
              <div className="card-header">
                <span className="step-tag">Step 03</span>
                <h2>Your Vision</h2>
              </div>
              
              <div className="input-group">
                <label>How did you hear about us?</label>
                <select 
                  name="source" value={formData.source} onChange={handleChange}
                >
                  <option value="">Select Source</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>Anything else for us?</label>
                <textarea 
                  name="message" placeholder="Tell us more about your dream wedding..."
                  value={formData.message} onChange={handleChange} rows={3}
                />
              </div>

              <div className="card-footer">
                <button className="form-btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Inquiry'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-success-v2">
              <div className="success-lottie"><Check size={64} /></div>
              <h2>Vision Captured!</h2>
              <p>We've received your inquiry and will be in touch shortly to discuss your cinematic journey.</p>
              <button className="pg-btn-primary" onClick={() => setStep(1)}>Back to Start</button>
            </div>
          )}
        </div>

        {/* ── Fixed Floating Navigation ── */}
        {step <= 3 && (
          <div className="form-nav-persistent">
            <div className="nav-info">
              <span className="nav-step-label">Step {step} of 3</span>
              <div className="nav-mini-track">
                <div className="nav-mini-fill" style={{ width: `${(step/3)*100}%` }} />
              </div>
            </div>
            <div className="nav-buttons-group">
              <button 
                className="nav-btn-round" onClick={prevStep} disabled={step === 1}
                aria-label="Previous step"
              >
                <ChevronUp size={24} />
              </button>
              <button 
                className="nav-btn-round" onClick={nextStep} disabled={step === 3}
                aria-label="Next step"
              >
                <ChevronDown size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConnectForm;
