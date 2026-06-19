import React, { useState, useEffect } from 'react';
import { Calendar, Users, Camera, IndianRupee, Search, Edit2, Plus, X, UserCheck, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './EventManager.css';

const EventManager = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  // Modals
  const [activeAssignModal, setActiveAssignModal] = useState(null);

  // Form states
  const [assignmentsForm, setAssignmentsForm] = useState([]);

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
      await api.patch(`/api/quotations/${activeAssignModal.id}/assignments`, { assignments: assignmentsForm });
      toast.success('Assignments updated successfully');
      setActiveAssignModal(null);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to save assignments');
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
              <h3>Events for {new Date(selectedDateKey).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              
              {(!eventsByDate[selectedDateKey] || eventsByDate[selectedDateKey].length === 0) ? (
                <div className="em-no-events">No events scheduled for this date.</div>
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
                    <div style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderLeft: '4px solid #6366f1', borderRadius: '4px', marginBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '15px', color: '#334155' }}>
                        {eventName} {eventDate ? `— ${formatDate(eventDate)}` : ''}
                      </h3>
                    </div>
                    <div className="em-a-table-wrap" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <table className="em-a-table" style={{ margin: 0, border: 'none' }}>
                        <thead>
                          <tr>
                            <th width="40%">Requirement (Camera's)</th>
                            <th width="60%">Assigned To (Our's)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eventAssignments.map((req) => (
                            <tr key={req.originalIndex}>
                              <td><strong>{req.requirementName}</strong></td>
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

    </div>
  );
};

export default EventManager;
