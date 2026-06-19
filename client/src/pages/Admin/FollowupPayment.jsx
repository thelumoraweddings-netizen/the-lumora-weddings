import React, { useState, useEffect } from 'react';
import { Search, IndianRupee, X, Plus } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './FollowupPayment.css';

const FollowupPayment = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [activePaymentModal, setActivePaymentModal] = useState(null); // The quotation object
  const [paymentToDelete, setPaymentToDelete] = useState(null); // Index of payment to delete

  // Form states for Modals
  const [paymentsForm, setPaymentsForm] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', remarks: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/quotations');
      
      const parseDate = (dStr) => {
        if (!dStr) return Infinity;
        const d = new Date(dStr);
        return isNaN(d.getTime()) ? Infinity : d.getTime();
      };

      const getEarliestDate = (q) => {
        let earliest = Infinity;
        if (q.events && q.events.length > 0) {
          q.events.forEach(e => {
            const t = parseDate(e.date);
            if (t < earliest) earliest = t;
          });
        }
        const mainEventTime = parseDate(q.eventDate);
        if (mainEventTime < earliest) earliest = mainEventTime;
        
        if (earliest === Infinity) {
          earliest = parseDate(q.createdAt) === Infinity ? 0 : parseDate(q.createdAt);
        }
        return earliest;
      };

      // Only show Confirmed and Completed quotations for Followup
      const confirmedEvents = data.filter(q => q.status === 'Confirmed' || q.status === 'Completed');
      
      // Sort all events by earliest event date (ascending)
      confirmedEvents.sort((a, b) => getEarliestDate(a) - getEarliestDate(b));
      
      setQuotations(confirmedEvents);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = quotations.filter(q => 
    q.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ─── Helpers ────────────────────────────────────────── */
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const ADD_SERVICES = [
    { id: 'helicam',   price: 10000 },
    { id: 'ledtv',     price: 5000 },
    { id: 'ledwall',   price: 18000 },
    { id: 'switcher',  price: 8000 },
    { id: 'youtube',   price: 3000 },
  ];

  const calculatePaymentStats = (q) => {
    // 1. Calculate Base Total
    let baseTotal = parseFloat(q.baseAmount) || 0;
    (q.additionalServices || []).forEach(sid => {
      const s = ADD_SERVICES.find(x => x.id === sid);
      if (s) baseTotal += (s.price || 0);
    });

    // 2. Apply Discount
    const discountAmt = q.discount && parseFloat(q.discount) > 0 ? Math.round(baseTotal * parseFloat(q.discount) / 100) : 0;
    
    // 3. Final Total (override with q.totalAmount if explicitly set)
    const total = q.totalAmount ? parseFloat(q.totalAmount) : (baseTotal - discountAmt);

    const received = (q.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const balance = total - received;
    
    return { total, received, balance };
  };

  /* ─── Payment Modal Handlers ────────────────────────── */
  const openPaymentModal = (q) => {
    setActivePaymentModal(q);
    setPaymentsForm(q.payments || []);
    setNewPayment({ amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', remarks: '' });
  };

  const handleAddPayment = () => {
    if (!newPayment.amount) return toast.error('Enter an amount');
    setPaymentsForm([...paymentsForm, { ...newPayment }]);
    setNewPayment({ amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', remarks: '' });
  };

  const handleRemovePayment = (idx) => {
    setPaymentToDelete(idx);
  };

  const confirmRemovePayment = () => {
    if (paymentToDelete !== null) {
      setPaymentsForm(paymentsForm.filter((_, i) => i !== paymentToDelete));
      setPaymentToDelete(null);
    }
  };

  const savePayments = async () => {
    try {
      let finalPayments = [...paymentsForm];
      
      // If the user typed a payment but forgot to click "+ Add Payment" before clicking "Save"
      if (newPayment.amount) {
        finalPayments.push({ ...newPayment });
      }

      await api.patch(`/api/quotations/${activePaymentModal.id}/payments`, { payments: finalPayments });
      toast.success('Payments updated successfully');
      setActivePaymentModal(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save payments');
    }
  };

  /* ─── Render ────────────────────────────────────────── */
  return (
    <div className="fp-container">
      {/* Header */}
      <div className="fp-header">
        <h1>Payment</h1>
        <div className="fp-search-box">
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search by client, event..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="fp-card">
        {loading ? (
          <div className="fp-loading">Loading Events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="fp-empty">No confirmed events found.</div>
        ) : (
          <table className="fp-table">
            <thead>
              <tr>
                <th width="25%">NAME</th>
                <th width="15%">LOCATION</th>
                <th width="15%">EVENT DATE</th>
                <th width="30%">PAYMENT STATUS</th>
                <th width="15%">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(q => {
                const { total, received, balance } = calculatePaymentStats(q);
                
                return (
                  <tr key={q.id}>
                    <td data-label="NAME">
                      <div className="fp-client-name">{q.clientName}</div>
                    </td>
                    <td data-label="LOCATION"><span className="fp-location">{q.location || '—'}</span></td>
                    <td data-label="EVENT DATE">
                      <div>
                        {(q.events && q.events.length > 0) ? (
                          q.events.map((e, i) => (
                            <div key={i} className="fp-date-item">{formatDate(e.date)}</div>
                          ))
                        ) : (
                          <div className="fp-date-item">{formatDate(q.eventDate)}</div>
                        )}
                      </div>
                    </td>
                    
                    {/* Payment Status Cell */}
                    <td data-label="PAYMENT STATUS">
                      <div className="fp-payment-stats">
                        <div className="fp-p-row">
                          <span className="fp-p-label">Total:</span>
                          <span className="fp-p-val fp-text-dark">{formatINR(total)}</span>
                        </div>
                        <div className="fp-p-row">
                          <span className="fp-p-label">Received:</span>
                          <span className="fp-p-val fp-text-green">{formatINR(received)}</span>
                        </div>
                        <div className="fp-p-row">
                          <span className="fp-p-label">Balance:</span>
                          <span className={`fp-p-val ${balance > 0 ? 'fp-text-red' : ''}`}>{formatINR(balance)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action Cell */}
                    <td data-label="ACTION">
                      <button className="fp-btn-pay" onClick={() => openPaymentModal(q)}>
                        <IndianRupee size={16}/> Payments
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Modal */}
      {activePaymentModal && (
        <div className="em-modal-overlay">
          <div className="em-modal">
            <div className="em-modal-header">
              <h2><IndianRupee size={20}/> Payment Tracking - {activePaymentModal.clientName}</h2>
              <button className="em-close-btn" onClick={() => setActivePaymentModal(null)}><X size={20}/></button>
            </div>
            <div className="em-modal-body">
              
              <div className="em-p-summary-cards">
                <div className="em-p-card">
                  <div className="em-p-card-title">Total Amount</div>
                  <div className="em-p-card-val">{formatINR(calculatePaymentStats(activePaymentModal).total)}</div>
                </div>
                <div className="em-p-card">
                  <div className="em-p-card-title">Total Received</div>
                  <div className="em-p-card-val em-text-green">
                    {formatINR(paymentsForm.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0))}
                  </div>
                </div>
                <div className="em-p-card">
                  <div className="em-p-card-title">Pending Balance</div>
                  <div className="em-p-card-val em-text-red">
                    {formatINR(calculatePaymentStats(activePaymentModal).total - paymentsForm.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0))}
                  </div>
                </div>
              </div>

              <div className="em-p-history">
                <h3>Payment History</h3>
                {paymentsForm.length === 0 ? (
                  <p className="em-no-payments">No payments recorded yet.</p>
                ) : (
                  <div className="em-p-list">
                    {paymentsForm.map((p, idx) => (
                      <div className="em-p-item" key={idx}>
                        <div className="em-p-item-left">
                          <div className="em-p-item-amt">{formatINR(p.amount)}</div>
                          <div className="em-p-item-meta">{formatDate(p.date)} • {p.method}</div>
                          {p.remarks && <div className="em-p-item-remarks">{p.remarks}</div>}
                        </div>
                        <button className="em-btn-delete" onClick={() => handleRemovePayment(idx)}><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="em-p-add-box">
                <h3>Record New Payment</h3>
                <div className="em-p-form-grid">
                  <input type="number" className="em-input" placeholder="Amount (e.g. 50000)" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} />
                  <input type="date" className="em-input" value={newPayment.date} onChange={e => setNewPayment({...newPayment, date: e.target.value})} />
                  <select className="em-select" value={newPayment.method} onChange={e => setNewPayment({...newPayment, method: e.target.value})}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                  <input type="text" className="em-input" placeholder="Remarks / Contact No" value={newPayment.remarks} onChange={e => setNewPayment({...newPayment, remarks: e.target.value})} />
                </div>
                <button className="em-btn-add" onClick={handleAddPayment}><Plus size={16}/> Add Payment</button>
              </div>

            </div>
            <div className="em-modal-footer">
              <button className="em-btn-outline" onClick={() => setActivePaymentModal(null)}>Cancel</button>
              <button className="em-btn-save" onClick={savePayments}>Save All Changes</button>
            </div>
            
            {/* Custom Confirm Delete Modal */}
            {paymentToDelete !== null && (
              <div className="em-confirm-overlay">
                <div className="em-confirm-box">
                  <div className="em-confirm-icon">
                    <X size={24} />
                  </div>
                  <h3>Delete Payment?</h3>
                  <p>Are you sure you want to delete this payment record? This action cannot be undone.</p>
                  <div className="em-confirm-actions">
                    <button className="em-btn-outline" onClick={() => setPaymentToDelete(null)}>Cancel</button>
                    <button className="em-btn-danger" onClick={confirmRemovePayment}>Yes, Delete</button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupPayment;
