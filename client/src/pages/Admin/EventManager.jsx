import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Camera, IndianRupee, Search, Edit2, Plus, X, UserCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './EventManager.css';

const EventManager = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  // Modals
  const [activeAssignModal, setActiveAssignModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [assignmentsForm, setAssignmentsForm] = useState([]);
  const [addForm, setAddForm] = useState({
    clientName: '',
    eventType: 'Wedding',
    location: '',
    requirements: [ { item: 'Traditional Photography', assignedTo: '' } ]
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/quotations');
      const confirmedEvents = data.filter(q => q.status === 'Confirmed' || q.status === 'Completed');
      setQuotations(confirmedEvents);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Calendar Logic ─────────────────────────────────── */
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    
    const days = [];
    
    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month padding
    const remainingDays = 42 - days.length; 
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Group events by YYYY-MM-DD
  const eventsByDate = {};
  quotations.forEach(q => {
    const addEventToDate = (dateStr, evData) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({ quotation: q, ...evData });
    };

    if (q.events && q.events.length > 0) {
      q.events.forEach(e => addEventToDate(e.date, { subEventName: e.name || 'Event' }));
    } else {
      addEventToDate(q.eventDate, { subEventName: q.eventType || 'Event' });
    }
  });

  const calendarDays = generateCalendar();

  /* ─── Helpers ────────────────────────────────────────── */
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const ADD_SERVICES = [
    { id: 'helicam',   name: 'Helicam',                    price: 10000, unit: '/Session' },
    { id: 'ledtv',     name: 'LED TV 55 inch',              price: 5000,  unit: '/Session' },
    { id: 'ledwall',   name: 'LED Wall 6×8',                price: 18000, unit: '/Session' },
    { id: 'switcher',  name: 'Switcher Unit',               price: 8000,  unit: '/Session' },
    { id: 'youtube',   name: 'YouTube Live Streaming',      price: 3000,  unit: '/Hour' },
  ];

  const calculatePaymentStats = (q) => {
    let baseTotal = parseFloat(q.baseAmount) || 0;
    (q.additionalServices || []).forEach(sid => {
      const s = ADD_SERVICES.find(x => x.id === sid);
      if (s) baseTotal += (s.price || 0);
    });
    const discountAmt = q.discount && parseFloat(q.discount) > 0 ? Math.round(baseTotal * parseFloat(q.discount) / 100) : 0;
    const total = q.totalAmount ? parseFloat(q.totalAmount) : (baseTotal - discountAmt);
    const received = (q.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const balance = total - received;
    return { total, received, balance };
  };

  /* ─── Assignment Modal Handlers ─────────────────────── */
  const openAssignModal = (q) => {
    setActiveAssignModal(q);
    const reqs = [];
    (q.events || []).forEach((ev, eIdx) => {
      (ev.requirements || []).forEach((req, rIdx) => {
        const existing = (q.assignments || []).find(a => a.eventId === eIdx && a.reqId === rIdx);
        reqs.push({
          eventId: eIdx,
          reqId: rIdx,
          eventName: ev.name || 'Event',
          eventDate: ev.date || q.eventDate || '',
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
      const updatedQuotation = { ...activeAssignModal };
      
      if (updatedQuotation.events) {
        updatedQuotation.events.forEach((ev, eIdx) => {
          const eventAssignments = assignmentsForm.filter(a => a.eventId === eIdx);
          ev.requirements = eventAssignments.map(a => ({
             item: a.requirementName,
             qty: '1'
          }));
          eventAssignments.forEach((a, newReqIdx) => {
             a.reqId = newReqIdx;
          });
        });
      }

      updatedQuotation.assignments = assignmentsForm.map(a => ({
        eventId: a.eventId,
        reqId: a.reqId,
        assignedTo: a.assignedTo,
        status: a.assignedTo ? 'Assigned' : 'Pending'
      }));

      await api.put(`/api/quotations/${activeAssignModal.id}`, updatedQuotation);
      
      toast.success('Assignments updated successfully');
      setActiveAssignModal(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save assignments');
    }
  };

  const addNewRequirement = (eventId) => {
    const ev = activeAssignModal.events[eventId];
    const newAssignment = {
      eventId: eventId,
      reqId: 999, // Will be re-indexed on save
      eventName: ev?.name || 'Event',
      eventDate: ev?.date || activeAssignModal.eventDate || '',
      requirementName: '',
      assignedTo: '',
      status: 'Pending'
    };
    setAssignmentsForm([...assignmentsForm, newAssignment]);
  };

  const removeRequirement = (originalIndex) => {
    setAssignmentsForm(prev => prev.filter((_, i) => i !== originalIndex));
  };

  /* ─── Quick Add Event Handlers ──────────────────────── */
  const openAddModal = () => {
    setAddForm({
      clientName: '',
      eventType: 'Wedding',
      location: '',
      requirements: [ { item: 'Traditional Photography', assignedTo: '' } ]
    });
    setShowAddModal(true);
  };

  const handleAddReqChange = (idx, field, val) => {
    const reqs = [...addForm.requirements];
    reqs[idx][field] = val;
    setAddForm({ ...addForm, requirements: reqs });
  };

  const addReqRow = () => {
    setAddForm({ ...addForm, requirements: [...addForm.requirements, { item: '', assignedTo: '' }] });
  };

  const removeReqRow = (idx) => {
    const reqs = addForm.requirements.filter((_, i) => i !== idx);
    setAddForm({ ...addForm, requirements: reqs });
  };

  const saveNewEvent = async () => {
    if (!addForm.clientName || !addForm.eventType) {
      toast.error('Client name and Event type are required');
      return;
    }
    
    const newQuotation = {
      id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: addForm.clientName,
      eventType: addForm.eventType,
      location: addForm.location,
      status: 'Confirmed',
      eventDate: selectedDateKey, 
      events: [{
        name: addForm.eventType,
        date: selectedDateKey,
        time: 'Morning',
        requirements: addForm.requirements.map(r => ({ item: r.item, qty: '1' }))
      }],
      assignments: addForm.requirements.map((r, i) => ({
        eventId: 0,
        reqId: i,
        assignedTo: r.assignedTo,
        status: r.assignedTo ? 'Assigned' : 'Pending'
      }))
    };

    try {
      await api.post('/api/quotations', newQuotation);
      toast.success('Event added successfully');
      setShowAddModal(false);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to add event');
    }
  };

  /* ─── Render ────────────────────────────────────────── */
  return (
    <div className="em-container">
      
      <div className="em-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', margin: 0, color: '#002D24', fontWeight: '700' }}>Events & Work Allocation</h1>
      </div>

      <div className="em-layout-grid">
        
        {/* Left Side: Calendar & Tasks */}
        <div className="em-main-col">
          
          <div className="em-calendar-card">
            <div className="em-cal-header">
              <button onClick={prevMonth}><ChevronLeft size={20}/></button>
              <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
              <button onClick={nextMonth}><ChevronRight size={20}/></button>
            </div>
            
            <div className="em-cal-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="em-cal-day-header">{day}</div>
              ))}
              
              {calendarDays.map((dayObj, i) => {
                const key = `${dayObj.date.getFullYear()}-${String(dayObj.date.getMonth() + 1).padStart(2, '0')}-${String(dayObj.date.getDate()).padStart(2, '0')}`;
                const dayEvents = eventsByDate[key] || [];
                
                let colorClass = '';
                if (dayEvents.length > 0) {
                  // Simulate the colors from the design based on logic or random for visual
                  const statuses = dayEvents.map(e => e.quotation.status);
                  if (statuses.includes('Completed')) colorClass = 'em-bg-blue';
                  else if (dayEvents.some(e => e.quotation.clientName.toLowerCase().includes('deliverable'))) colorClass = 'em-bg-pink';
                  else colorClass = 'em-bg-orange';
                }
                
                const isSelected = selectedDateKey === key;

                return (
                  <div 
                    key={i} 
                    className={`em-cal-cell ${dayObj.isCurrentMonth ? '' : 'em-cal-dimmed'} ${colorClass} ${isSelected ? 'em-cal-selected' : ''}`}
                    onClick={() => setSelectedDateKey(key)}
                  >
                    <span className="em-cal-date-num">{dayObj.date.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="em-cal-badge">{dayEvents.length}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Event Details for Selected Date */}
        <div className="em-side-col">
          {selectedDateKey ? (
            <div className="em-selected-events-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Events for {new Date(selectedDateKey).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                <button onClick={openAddModal} className="em-btn-save" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '13px' }}>
                  <Plus size={14} /> Add Event
                </button>
              </div>
              
              {(!eventsByDate[selectedDateKey] || eventsByDate[selectedDateKey].length === 0) ? (
                <div className="em-no-events" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  No events scheduled for this date.
                </div>
              ) : (
                <div className="em-event-cards">
                  {eventsByDate[selectedDateKey].map((ev, i) => (
                    <div key={i} className="em-event-card">
                      <div className="em-ec-top">
                        <div className="em-ec-client">{ev.quotation.clientName}</div>
                        <div className="em-ec-type">{ev.subEventName}</div>
                      </div>
                      <div className="em-ec-meta">
                        <span>{ev.quotation.location || 'Location TBD'}</span>
                      </div>
                      <div className="em-ec-actions">
                        <button onClick={() => openAssignModal(ev.quotation)} className="em-btn-action-sm">
                          <Camera size={14}/> Allocations
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="em-select-prompt">
              <Calendar size={48} strokeWidth={1} />
              <p>Select a date on the calendar to view its events and manage allocations.</p>
            </div>
          )}
        </div>

      </div>

      {/* Assignment Modal (unchanged structure, hidden unless active) */}
      {activeAssignModal && (
        <div className="em-modal-overlay">
          <div className="em-modal">
            <div className="em-modal-header">
              <h2><Users size={20}/> Work Allocation - {activeAssignModal.clientName}</h2>
              <button className="em-close-btn" onClick={() => setActiveAssignModal(null)}><X size={20}/></button>
            </div>
            <div className="em-modal-body">
              {Array.from(new Set(assignmentsForm.map(a => a.eventId))).map(eventId => {
                const eventAssignments = assignmentsForm.map((req, idx) => ({ ...req, originalIndex: idx })).filter(req => req.eventId === eventId);
                if (eventAssignments.length === 0) return null;
                const eventName = eventAssignments[0].eventName;
                const eventDate = eventAssignments[0].eventDate;
                
                return (
                  <div key={eventId} className="em-event-group" style={{ marginBottom: '24px' }}>
                    <div style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderLeft: '4px solid #6366f1', borderRadius: '4px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#334155' }}>
                        {eventName} {eventDate ? `— ${formatDate(eventDate)}` : ''}
                      </h3>
                      <button className="em-btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => addNewRequirement(eventId)}>
                        + Add Requirement
                      </button>
                    </div>
                    <div className="em-a-table-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <table className="em-a-table" style={{ margin: 0, border: 'none' }}>
                        <thead>
                          <tr>
                            <th width="45%">Requirement (Camera's)</th>
                            <th width="45%">Assigned To (Our's)</th>
                            <th width="10%"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {eventAssignments.map((req) => (
                            <tr key={req.originalIndex}>
                              <td>
                                <input 
                                  type="text"
                                  list="services-list"
                                  className="em-input"
                                  placeholder="E.g. Candid Photography"
                                  value={req.requirementName}
                                  onChange={(e) => handleAssignmentChange(req.originalIndex, 'requirementName', e.target.value)}
                                />
                              </td>
                              <td>
                                <input 
                                  type="text"
                                  list="team-members"
                                  className="em-input"
                                  placeholder="Type or select name"
                                  value={req.assignedTo}
                                  onChange={(e) => handleAssignmentChange(req.originalIndex, 'assignedTo', e.target.value)}
                                />
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button onClick={() => removeRequirement(req.originalIndex)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                  <X size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              {assignmentsForm.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No requirements found for this event.</div>
              )}
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

      {/* Quick Add Event Modal */}
      {showAddModal && (
        <div className="em-modal-overlay">
          <div className="em-modal" style={{ maxWidth: '600px' }}>
            <div className="em-modal-header">
              <h2><Plus size={20}/> Quick Add Event & Allocation</h2>
              <button className="em-close-btn" onClick={() => setShowAddModal(false)}><X size={20}/></button>
            </div>
            <div className="em-modal-body" style={{ padding: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Client Name *</label>
                  <input type="text" className="em-input" value={addForm.clientName} onChange={e => setAddForm({...addForm, clientName: e.target.value})} placeholder="E.g. Rahul & Priya" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Event Type *</label>
                  <input type="text" className="em-input" value={addForm.eventType} onChange={e => setAddForm({...addForm, eventType: e.target.value})} placeholder="E.g. Wedding" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px', color: '#475569', display: 'block', marginBottom: '6px' }}>Location</label>
                  <input type="text" className="em-input" value={addForm.location} onChange={e => setAddForm({...addForm, location: e.target.value})} placeholder="E.g. Coimbatore" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#334155' }}>Photography Requirements & Allocation</h3>
                <button className="em-btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={addReqRow}>+ Add Row</button>
              </div>

              <div className="em-a-table-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="em-a-table" style={{ margin: 0, border: 'none' }}>
                  <thead>
                    <tr>
                      <th width="45%">Requirement (Camera)</th>
                      <th width="45%">Assigned To (Staff)</th>
                      <th width="10%"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {addForm.requirements.map((req, idx) => (
                      <tr key={idx}>
                        <td>
                          <input 
                            type="text"
                            list="services-list"
                            className="em-input"
                            placeholder="E.g. Candid Photography"
                            value={req.item}
                            onChange={(e) => handleAddReqChange(idx, 'item', e.target.value)}
                          />
                        </td>
                        <td>
                          <input 
                            type="text"
                            list="team-members"
                            className="em-input"
                            placeholder="Type or select name"
                            value={req.assignedTo}
                            onChange={(e) => handleAddReqChange(idx, 'assignedTo', e.target.value)}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button onClick={() => removeReqRow(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <datalist id="services-list">
                <option value="Traditional Photography" />
                <option value="Traditional Videography" />
                <option value="Candid Photography" />
                <option value="Candid Videography" />
                <option value="Drone" />
              </datalist>

            </div>
            <div className="em-modal-footer">
              <button className="em-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="em-btn-save" onClick={saveNewEvent}>Save Event</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventManager;
