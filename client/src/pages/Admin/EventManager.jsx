import React, { useState, useEffect } from 'react';
import { Calendar, Users, Camera, IndianRupee, Search, Edit2, Plus, X, UserCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './EventManager.css';

const EventManager = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [activeAssignModal, setActiveAssignModal] = useState(null); // The quotation object
  const [activePaymentModal, setActivePaymentModal] = useState(null); // The quotation object
  const [paymentToDelete, setPaymentToDelete] = useState(null); // Index of payment to delete

  // Form states for Modals
  const [assignmentsForm, setAssignmentsForm] = useState([]);
  const [paymentsForm, setPaymentsForm] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: '', date: new Date().toISOString().split('T')[0], method: 'Bank Transfer', remarks: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/quotations');
      // Only show Confirmed and Completed quotations as "Events"
      const confirmedEvents = data.filter(q => q.status === 'Confirmed' || q.status === 'Completed');
      // Sort by event date (ascending)
      confirmedEvents.sort((a, b) => new Date(a.eventDate || a.createdAt) - new Date(b.eventDate || b.createdAt));
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
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const ADD_SERVICES = [
    { id: 'helicam',   name: 'Helicam',                    price: 10000, unit: '/Session' },
    { id: 'ledtv',     name: 'LED TV 55 inch',              price: 5000,  unit: '/Session' },
    { id: 'ledwall',   name: 'LED Wall 6×8',                price: 18000, unit: '/Session' },
    { id: 'switcher',  name: 'Switcher Unit',               price: 8000,  unit: '/Session' },
    { id: 'youtube',   name: 'YouTube Live Streaming',      price: 3000,  unit: '/Hour' },
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

  /* ─── Assignment Modal Handlers ─────────────────────── */
  const openAssignModal = (q) => {
    setActiveAssignModal(q);
    
    // Auto-generate requirements list from the quotation's events
    const reqs = [];
    (q.events || []).forEach((ev, eIdx) => {
      (ev.requirements || []).forEach((req, rIdx) => {
        // Find if it already has an assignment
        const existing = (q.assignments || []).find(a => a.eventId === eIdx && a.reqId === rIdx);
        reqs.push({
          eventId: eIdx,
          reqId: rIdx,
          eventName: ev.name || ev.date || 'Event',
          requirementName: req.item,
          assignedTo: existing ? existing.assignedTo : '',
          status: existing ? existing.status : 'Pending'
        });
      });
    });
    setAssignmentsForm(reqs);
  };

  const handleAssignmentChange = (idx, field, value) => {
    const newForm = [...assignmentsForm];
    newForm[idx][field] = value;
    setAssignmentsForm(newForm);
  };

  const saveAssignments = async () => {
    try {
      await api.patch(`/api/quotations/${activeAssignModal.id}/assignments`, { assignments: assignmentsForm });
      toast.success('Assignments updated successfully');
      setActiveAssignModal(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save assignments');
    }
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
      await api.patch(`/api/quotations/${activePaymentModal.id}/payments`, { payments: paymentsForm });
      toast.success('Payments updated successfully');
      setActivePaymentModal(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save payments');
    }
  };

  /* ─── Render ────────────────────────────────────────── */
  return (
    <div className="em-container">
      {/* Header */}
      <div className="em-header">
        <div className="em-title">
          <h1>Events & Work Allocation</h1>
          <p>Manage assignments and track payments for confirmed events.</p>
        </div>
        <div className="em-actions">
          <div className="em-search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by client, event..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="em-card">
        {loading ? (
          <div className="em-loading">Loading Events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="em-empty">No confirmed events found. Check the Quotations tab.</div>
        ) : (
          <div className="em-table-wrapper">
            <table className="em-table">
              <thead>
                <tr>
                  <th width="12%">EVENT DATE</th>
                  <th width="12%">LOCATION</th>
                  <th width="15%">NAME</th>
                  <th width="15%">EVENT TYPE</th>
                  <th width="20%">CAMERA'S & OUR'S</th>
                  <th width="16%">PAYMENT</th>
                  <th width="10%">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(q => {
                  const { total, received, balance } = calculatePaymentStats(q);
                  
                  return (
                    <tr key={q.id}>
                      <td>
                        <div className="em-date">
                          {(q.events && q.events.length > 0) ? (
                            q.events.map((e, i) => (
                              <div key={i} className="em-date-item">{formatDate(e.date)}</div>
                            ))
                          ) : (
                            <div className="em-date-item">{formatDate(q.eventDate)}</div>
                          )}
                        </div>
                      </td>
                      <td><span className="em-location">{q.location || '—'}</span></td>
                      <td>
                        <div className="em-client-name">{q.clientName}</div>
                      </td>
                      <td><span className="em-badge">{q.eventType || '—'}</span></td>
                      
                      {/* Assignments Cell */}
                      <td className="em-cell-clickable" onClick={() => openAssignModal(q)}>
                        <div className="em-assignments-list">
                          {q.assignments && q.assignments.length > 0 ? (
                            q.assignments.map((a, i) => (
                              a.assignedTo ? (
                                <div key={i} className="em-assignment-item">
                                  <span className="em-a-role">{a.requirementName}:</span>
                                  <span className="em-a-name">{a.assignedTo}</span>
                                </div>
                              ) : null
                            ))
                          ) : (
                            <span className="em-unassigned"><Users size={12}/> Click to assign team</span>
                          )}
                        </div>
                      </td>

                      {/* Payment Cell */}
                      <td className="em-cell-clickable" onClick={() => openPaymentModal(q)}>
                        <div className="em-payment-stats">
                          <div className="em-p-row">
                            <span className="em-p-label">Total:</span>
                            <span className="em-p-val em-text-dark">{formatINR(total)}</span>
                          </div>
                          <div className="em-p-row">
                            <span className="em-p-label">Received:</span>
                            <span className="em-p-val em-text-green">{formatINR(received)}</span>
                          </div>
                          <div className="em-p-row">
                            <span className="em-p-label">Balance:</span>
                            <span className={`em-p-val ${balance > 0 ? 'em-text-red' : ''}`}>{formatINR(balance)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Action Cell */}
                      <td>
                        <div className="em-action-btns">
                          <button className="em-btn-icon em-btn-assign" onClick={() => openAssignModal(q)} title="Assign Team"><Camera size={16}/></button>
                          <button className="em-btn-icon em-btn-pay" onClick={() => openPaymentModal(q)} title="Manage Payments"><IndianRupee size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {activeAssignModal && (
        <div className="em-modal-overlay">
          <div className="em-modal">
            <div className="em-modal-header">
              <h2><Users size={20}/> Work Allocation - {activeAssignModal.clientName}</h2>
              <button className="em-close-btn" onClick={() => setActiveAssignModal(null)}><X size={20}/></button>
            </div>
            <div className="em-modal-body">
              <div className="em-a-table-wrap">
                <table className="em-a-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Requirement (Camera's)</th>
                      <th>Assigned To (Our's)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentsForm.map((req, idx) => (
                      <tr key={idx}>
                        <td>{req.eventName}</td>
                        <td><strong>{req.requirementName}</strong></td>
                        <td>
                          <input 
                            type="text"
                            list="team-members"
                            className="em-input"
                            placeholder="Type or select name"
                            value={req.assignedTo}
                            onChange={(e) => handleAssignmentChange(idx, 'assignedTo', e.target.value)}
                          />
                        </td>
                        <td>
                          <select className="em-select" value={req.status} onChange={(e) => handleAssignmentChange(idx, 'status', e.target.value)}>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <datalist id="team-members">
                <option value="Siva" />
                <option value="Mari" />
                <option value="Koushik" />
                <option value="Arun" />
                <option value="Karthik" />
              </datalist>
            </div>
            <div className="em-modal-footer">
              <button className="em-btn-outline" onClick={() => setActiveAssignModal(null)}>Cancel</button>
              <button className="em-btn-save" onClick={saveAssignments}>Save Assignments</button>
            </div>
          </div>
        </div>
      )}

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
                    <option value="Cheque">Cheque</option>
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

export default EventManager;
