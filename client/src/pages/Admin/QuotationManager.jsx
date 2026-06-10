import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, Printer, Download, Eye,
  X, ChevronDown, CheckCircle, Clock, FileText, AlertCircle,
  User, Phone, Mail, Calendar, MapPin, Package, Sparkles, StickyNote, IndianRupee, ArrowLeft
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import './QuotationManager.css';

/* ─── Constants ─────────────────────────────────────── */
const EVENT_TYPES = [
  'Tamil Wedding', 'Telugu Wedding', 'Brahmin Wedding', 'Christian Wedding',
  'Muslim Wedding', 'Engagement', 'Pre-Wedding Shoot', 'Post-Wedding Shoot',
  'Maternity / Baby Shower', 'Baby Photography', 'Outdoor Couple Photography', 'Other'
];

const ALL_SERVICES = [
  'Traditional Photography',
  'Traditional Videography',
  'Candid Photography',
  'Candid Videography',
  'Drone',
  'Helicam',
  'Live Relay',
  'Pre-Wedding Shoot',
  'Post-Wedding Shoot',
];

const ADD_SERVICES = [
  { id: 'helicam',   name: 'Helicam',                    price: 10000, unit: '/Session' },
  { id: 'ledtv',     name: 'LED TV 55 inch',              price: 5000,  unit: '/Session' },
  { id: 'ledwall',   name: 'LED Wall 6×8',                price: 18000, unit: '/Session' },
  { id: 'switcher',  name: 'Switcher Unit',               price: 8000,  unit: '/Session' },
  { id: 'youtube',   name: 'YouTube Live Streaming',      price: 3000,  unit: '/Hour' },
];

const STATUS_OPTIONS = ['Draft', 'Sent', 'Confirmed', 'Completed'];

const STATUS_ICONS = {
  Draft: <Clock size={13} />,
  Sent: <AlertCircle size={13} />,
  Confirmed: <CheckCircle size={13} />,
  Completed: <CheckCircle size={13} />,
};

const emptyQuotation = () => ({
  id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
  clientName: '',
  contactPhone: '',
  events: [{ date: '', name: '', time: 'Morning', requirements: [{ item: 'Traditional Photography', qty: '1' }] }],
  albums: [],
  finalOuts: [],
  complementary: [],
  eventType: '',
  eventDate: '',
  location: '',
  additionalServices: [],
  notes: '',
  baseAmount: '',
  discount: '',
  totalAmount: '',
  status: 'Draft',
  createdAt: new Date().toISOString(),
});

/* ─── Helpers ────────────────────────────────────────── */
function calcTotal(q) {
  let sum = parseFloat(q.baseAmount) || 0;
  (q.additionalServices || []).forEach(sid => {
    const s = ADD_SERVICES.find(x => x.id === sid);
    if (s) sum += (s.price || 0);
  });
  return sum;
}

function formatINR(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function today() {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

import api from '../../utils/api';

/* ─── HTML Generation for Print/PDF ──────────────────── */
function getQuotationHTML(q) {
  const services = (q.additionalServices || []).map(sid => ADD_SERVICES.find(x => x.id === sid)).filter(Boolean);
  const total = calcTotal(q);
  const discountAmt = q.discount && parseFloat(q.discount) > 0 ? Math.round(total * parseFloat(q.discount) / 100) : 0;
  const finalTotal = q.totalAmount ? parseFloat(q.totalAmount) : (total - discountAmt);
  const combinedFinalOuts = [...(q.albums || []), ...(q.finalOuts || [])];

  return `
<div class="page">
  <div class="top-accent"></div>
  <div class="header">
    <div class="logo-container">
      <img src="/logo.png" alt="The Lumora Weddings Logo" class="brand-logo" />
    </div>
    <div class="document-info">
      <div class="doc-title">QUOTATION</div>
      <div class="doc-meta"><strong>ID:</strong> ${q.id}</div>
      <div class="doc-meta"><strong>Date:</strong> ${today()}</div>
    </div>
  </div>

  <div class="info-section">
    <div class="info-block client-info">
      <div class="info-label">PREPARED FOR:</div>
      <div class="client-name">${q.clientName || 'Client'}</div>
      ${q.contactPhone ? `<div class="client-detail">📞 ${q.contactPhone}</div>` : ''}
    </div>
    <div class="info-block event-info">
      <div class="info-label">EVENT DETAILS:</div>
      <div class="event-type">${q.eventType || 'Event'}</div>
      ${(q.events && q.events.length > 0) ? q.events.filter(e => e.date).map(ev => `
        <div class="event-detail">📅 ${formatDate(ev.date)} ${ev.name ? `[${ev.name}]` : ''}</div>
      `).join('') : (q.eventDate ? `<div class="event-detail">📅 ${formatDate(q.eventDate)}</div>` : '')}
      ${q.location ? `<div class="event-detail">📍 ${q.location}</div>` : ''}
    </div>
  </div>

  <table class="main-table">
    <thead>
      <tr>
        <th width="10%" style="text-align:center;">No</th>
        <th width="35%" style="text-align:center;">DATE & EVENTS</th>
        <th width="45%" style="text-align:left;">Requirements</th>
        <th width="10%" style="text-align:center;">No's</th>
      </tr>
    </thead>
    <tbody>
      ${(q.events || []).map((ev, i) => {
        const reqs = ev.requirements || [];
        return `
        <tr>
          <td style="text-align:center; font-weight: bold; vertical-align: middle;">${i + 1}</td>
          <td style="text-align:center; vertical-align: middle;">
            <div class="item-name">${ev.date ? formatDate(ev.date) : ''} ${ev.name ? `[${ev.name.toUpperCase()}]` : ''}</div>
            ${ev.time ? `<div class="item-desc" style="font-size: 11px;">Time - ${ev.time}</div>` : ''}
          </td>
          <td style="text-align:left; vertical-align: middle; padding-left: 20px;">
            ${reqs.map(r => `<div class="item-desc" style="margin-bottom: 4px;">${r.item}</div>`).join('')}
          </td>
          <td style="text-align:center; vertical-align: middle;">
            ${reqs.map(r => `<div class="item-desc" style="margin-bottom: 4px; font-weight: bold;">${r.qty}</div>`).join('')}
          </td>
        </tr>
      `}).join('')}
      
      ${(q.complementary && q.complementary.length > 0) ? `
      <tr>
        <td style="text-align:center; font-weight: bold; vertical-align: middle;">${(q.events || []).length + 1}</td>
        <td style="text-align:center; vertical-align: middle; font-weight: 600; font-size: 14px;">COMPLEMENTARY</td>
        <td style="text-align:left; vertical-align: top; padding-left: 20px;">
          ${q.complementary.map(a => `<div class="item-desc" style="margin-bottom: 6px;">${a.item}</div>`).join('')}
        </td>
        <td style="text-align:center; vertical-align: top;">
          ${q.complementary.map(a => `<div class="item-desc" style="margin-bottom: 6px; font-weight: bold;">${a.qty}</div>`).join('')}
        </td>
      </tr>
      ` : ''}

      ${(services && services.length > 0) ? `
      <tr>
        <td style="text-align:center; font-weight: bold; vertical-align: middle;">${(q.events || []).length + ((q.complementary && q.complementary.length > 0) ? 1 : 0) + 1}</td>
        <td style="text-align:center; vertical-align: middle; font-weight: 600; font-size: 14px;">ADDITIONAL SERVICES</td>
        <td style="text-align:left; vertical-align: top; padding-left: 20px;">
          ${services.map(s => `<div class="item-desc" style="margin-bottom: 6px;">${s.name}</div>`).join('')}
        </td>
        <td style="text-align:center; vertical-align: top;">
          ${services.map(s => `<div class="item-desc" style="margin-bottom: 6px; font-weight: bold;">-</div>`).join('')}
        </td>
      </tr>
      ` : ''}

      ${(combinedFinalOuts.length > 0) ? `
      <tr style="background-color: #F8F7F3;">
        <td style="text-align:center; font-weight: bold; vertical-align: middle; padding-top: 10px; padding-bottom: 10px;">
          ${(q.events || []).length + ((q.complementary && q.complementary.length > 0) ? 1 : 0) + ((services && services.length > 0) ? 1 : 0) + 1}
        </td>
        <td style="text-align:center; vertical-align: middle; font-weight: 600; font-size: 14px; color: #002D24; padding-top: 10px; padding-bottom: 10px;">
          FINAL OUT
        </td>
        <td style="text-align:left; vertical-align: top; padding-left: 20px; padding-top: 10px; padding-bottom: 10px;">
          ${combinedFinalOuts.map(a => `<div class="item-desc" style="margin-bottom: 6px; font-weight: 600; color: #002D24;">${a.item}</div>`).join('')}
        </td>
        <td style="text-align:center; vertical-align: top; padding-top: 10px; padding-bottom: 10px;">
          ${combinedFinalOuts.map(a => `<div class="item-desc" style="margin-bottom: 6px; font-weight: bold; color: #002D24;">${a.qty}</div>`).join('')}
        </td>
      </tr>
      ` : ''}
    </tbody>
  </table>

  <div class="summary-wrapper">
    <div style="width: 100%; text-align: right; padding-right: 20px;">
      ${discountAmt > 0 && !q.totalAmount ? `
      <div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 20px; padding-top: 10px;">
        <span style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: #5C6256;">Subtotal</span>
        <span style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 600; color: #5C6256;">${formatINR(total)}</span>
      </div>
      <div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 20px; padding-top: 5px;">
        <span style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: #c0392b;">Discount (${q.discount}%)</span>
        <span style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 600; color: #c0392b;">− ${formatINR(discountAmt)}</span>
      </div>
      ` : ''}
      <div style="display: flex; justify-content: flex-end; align-items: baseline; gap: 20px; border-top: 2px solid #002D24; padding-top: 10px; margin-top: 10px;">
        <span style="font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: #002D24;">${discountAmt > 0 && !q.totalAmount ? 'Grand Total' : 'Total'}</span>
        <span style="font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 800; color: #002D24;">${formatINR(finalTotal)}</span>
      </div>
    </div>
  </div>

  <div class="footer-area">
    <div class="terms-section">
      <div class="terms-title">Terms & Conditions</div>
      <div class="terms-list">
        • Travel & accommodation charges will be additional for Out of Coimbatore events.<br/>
        • 40% of amount should be paid in advance after confirmation.<br/>
        • 50% of the total amount should be paid after the completion of the shoot.<br/>
        • Pending 10% should be paid after album design confirmed and before print.
      </div>
    </div>
    
    <div class="footer-contact">
      <div class="brand-name">THE LUMORA<br/>WEDDINGS</div>
      <div class="footer-right">
        <div class="social-links">
          <a href="https://thelumoraweddings.com" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> thelumoraweddings.com</a>
          <a href="https://instagram.com/thelumoraweddings" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> @thelumoraweddings</a>
          <a href="https://youtube.com/@thelumoraweddings" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> The Lumora Weddings</a>
        </div>
        <div class="contact-details">
          Contact: +91 93458 49846 | +91 96291 30158
        </div>
      </div>
    </div>
  </div>
</div>
`;
}

/* ─── Print / PDF ──────────────────────────────────── */
function getQuotationStyle() {
  return `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Poppins', sans-serif;
    background-color: #FDFCF8; 
    color: #4A5D4E; 
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .page {
    width: 794px; 
    min-height: 1122px; 
    background-color: #FDFCF8;
    margin: 0 auto;
    position: relative;
    padding-bottom: 40px;
  }
  
  .top-accent {
    height: 12px;
    background: #002D24;
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px 50px 30px 50px;
  }
  
  .brand-logo { 
    max-height: 90px; 
    width: auto; 
    object-fit: contain; 
  }
  
  .document-info {
    text-align: right;
  }

  .doc-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 600;
    color: #002D24;
    letter-spacing: 2px;
    margin-bottom: 10px;
  }

  .doc-meta {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: #4A5D4E;
    margin-bottom: 4px;
  }

  .doc-meta strong {
    color: #002D24;
    font-weight: 600;
  }

  .info-section {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    margin-bottom: 40px;
  }

  .info-block {
    background: #F6F4ED;
    padding: 24px;
    border-radius: 8px;
    width: 48%;
    border: 1px solid rgba(0, 45, 36, 0.08);
  }

  .info-label {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: #5C6256;
    letter-spacing: 1.5px;
    margin-bottom: 12px;
  }

  .client-name, .event-type {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #002D24;
    margin-bottom: 8px;
  }

  .client-detail, .event-detail {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: #4A5D4E;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  table.main-table { 
    width: calc(100% - 100px); 
    margin: 0 50px 40px 50px; 
    border-collapse: collapse; 
  }
  
  table.main-table thead th { 
    background-color: #002D24; 
    color: #FDFCF8; 
    font-family: 'Poppins', sans-serif;
    font-size: 13px; 
    font-weight: 600; 
    padding: 14px 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  table.main-table thead th:first-child { border-top-left-radius: 6px; border-bottom-left-radius: 6px; }
  table.main-table thead th:last-child { border-top-right-radius: 6px; border-bottom-right-radius: 6px; }
  
  table.main-table tbody tr {
    border-bottom: 1px solid rgba(0, 45, 36, 0.15);
  }
  
  table.main-table tbody td { 
    padding: 24px 20px; 
    vertical-align: top; 
  }

  .item-name {
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #002D24;
    margin-bottom: 4px;
  }

  .item-desc {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: #4A5D4E;
    line-height: 1.4;
  }

  .amount-cell {
    font-family: 'Poppins', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #002D24;
  }

  .summary-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    margin-bottom: 50px;
  }

  .deliverables-section {
    width: 55%;
  }

  .deliv-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 600;
    color: #002D24;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }

  .deliv-list {
    list-style: none;
  }

  .deliv-list li {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: #4A5D4E;
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .check {
    color: #D4AF37;
    font-weight: bold;
  }

  .totals-section {
    width: 38%;
    background: #F6F4ED;
    padding: 24px;
    border-radius: 8px;
    border: 1px solid rgba(0, 45, 36, 0.08);
  }

  .totals-row {
    font-family: 'Poppins', sans-serif;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #4A5D4E;
    margin-bottom: 16px;
    font-weight: 500;
  }

  .discount-row {
    color: #D4AF37;
    font-weight: 600;
  }

  .final-total {
    border-top: 2px dashed rgba(0, 45, 36, 0.15);
    padding-top: 16px;
    margin-bottom: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 700;
    color: #002D24;
  }

  .footer-area {
    padding: 0 50px;
    margin-top: auto;
  }

  .terms-section {
    margin-bottom: 40px;
  }

  .terms-title {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #5C6256;
    letter-spacing: 1px;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .terms-list {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 12px;
    color: #4A5D4E;
    line-height: 1.8;
  }

  .footer-contact {
    border-top: 1px solid rgba(0, 45, 36, 0.08);
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 700;
    color: #002D24;
    letter-spacing: 2px;
    line-height: 1.3;
    flex-shrink: 0;
  }

  .footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .social-links {
    display: flex;
    gap: 16px;
    align-items: center;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 11px;
  }
  
  .social-links a {
    color: #4A5D4E;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .contact-details {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    color: #4A5D4E;
    font-weight: 500;
  }`;
}

function printQuotation(q) {
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Quotation ${q.id} — The Lumora Weddings</title>
<style>
${getQuotationStyle()}
</style>
</head>
<body>
${getQuotationHTML(q)}
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 500);
}

/* ─── Download PDF ──────────────────────────────── */
async function downloadQuotationPDF(q, getHTML) {
  // Wait explicitly for fonts to load so we don't get Arial fallback
  await document.fonts.ready;

  const htmlContent = `
    <div style="background: #FDFCF8; width: 794px; margin: 0 auto;">
      <style>
        ${getQuotationStyle()}
        tr, .summary-wrapper, .terms-section, .footer { page-break-inside: avoid; }
        .page { min-height: auto; overflow: visible; padding-bottom: 20px; }
      </style>
      ${getHTML(q)}
    </div>
  `;

  // Measure content height to enforce a single continuous page
  const measureContainer = document.createElement('div');
  measureContainer.style.cssText = 'position: absolute; top: -9999px; left: -9999px; width: 794px; visibility: hidden; z-index: -9999;';
  measureContainer.innerHTML = htmlContent;
  document.body.appendChild(measureContainer);
  
  // Allow a tiny delay for styles to render and height to be calculated
  await new Promise(r => setTimeout(r, 50));
  // Add a small buffer to the height to prevent any tiny cutoffs
  const contentHeight = Math.max(1122, measureContainer.scrollHeight + 20);
  document.body.removeChild(measureContainer);

  const opt = {
    margin:       0,
    filename:     `Quotation-${q.id}-${q.clientName || 'Client'}.pdf`,
    image:        { type: 'jpeg', quality: 1.0 },
    html2canvas:  { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true, 
      backgroundColor: '#FDFCF8',
      scrollY: 0,
      scrollX: 0,
      windowWidth: 794
    },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }
  };
  
  await html2pdf().set(opt).from(htmlContent).save();
}

/* ─── Field wrapper (MUST be outside QuotationManager to
   avoid remount-on-every-render / lost focus bug) ──────── */
const Field = ({ label, icon, children, required }) => (
  <div className="qm-field">
    <label className="qm-label">
      <span className="qm-label-icon">{icon}</span>
      {label}
      {required && <span className="qm-required">*</span>}
    </label>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
const QuotationManager = () => {
  const [quotations, setQuotations] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form' | 'preview'
  const [form, setForm] = useState(emptyQuotation());
  const [editingId, setEditingId] = useState(null);
  const [previewQ, setPreviewQ] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saved, setSaved] = useState(false);
  const formRef = useRef(null);

  // Fetch from DB
  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const { data } = await api.get('/api/quotations');
        setQuotations(data);
      } catch (err) {
        console.error('Failed to load quotations', err);
      }
    };
    fetchQuotations();
  }, []);

  // Computed auto-total
  const autoTotal = calcTotal(form);
  const discountPct = parseFloat(form.discount) || 0;
  const discountAmt = Math.round(autoTotal * discountPct / 100);
  const finalTotal  = autoTotal - discountAmt;

  /* ── Handlers ───────────────────────────────────────── */
  const openNew = () => {
    setForm(emptyQuotation());
    setEditingId(null);
    setView('form');
    setSaved(false);
  };

  const openEdit = (q) => {
    setForm({ ...q });
    setEditingId(q.id);
    setView('form');
    setSaved(false);
    setTimeout(() => formRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const openPreview = (q) => {
    setPreviewQ(q);
    setView('preview');
  };

  const saveForm = async () => {
    const updated = { ...form, totalAmount: '' };
    try {
      if (editingId) {
        const { data } = await api.put(`/api/quotations/${editingId}`, updated);
        setQuotations(prev => prev.map(q => q.id === editingId ? data : q));
      } else {
        const { data } = await api.post('/api/quotations', updated);
        setQuotations(prev => [data, ...prev]);
      }
      setSaved(true);
    } catch (err) {
      console.error('Failed to save quotation', err);
      alert('Failed to save quotation. Please try again.');
    }
    setTimeout(() => {
      setView('list');
      setSaved(false);
    }, 1200);
  };

  const deleteQ = async (id) => {
    try {
      await api.delete(`/api/quotations/${id}`);
      setQuotations(prev => prev.filter(q => q.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete quotation', err);
      alert('Failed to delete quotation.');
    }
    if (view !== 'list') setView('list');
  };

  const toggleService = (sid) => {
    setForm(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(sid)
        ? prev.additionalServices.filter(s => s !== sid)
        : [...prev.additionalServices, sid]
    }));
  };

  const updateStatus = async (id, status) => {
    // Optimistic UI update
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    try {
      await api.patch(`/api/quotations/${id}/status`, { status });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to save status on the server.');
    }
  };

  /* ── Filtered List ──────────────────────────────────── */
  const filtered = quotations.filter(q => {
    const sText = search.toLowerCase();
    const matchSearch = !search || 
      (q.clientName || '').toLowerCase().includes(sText) || 
      (q.id || '').toLowerCase().includes(sText) || 
      (q.eventType || '').toLowerCase().includes(sText);
    const matchStatus = filterStatus === 'All' || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  /* ═══════════════════════════════════════════════
     RENDER: LIST
     ═══════════════════════════════════════════════ */
  if (view === 'list') return (
    <div className="qm-container">
      {/* Header bar */}
      <div className="qm-topbar">
        <div className="qm-topbar-left">
          <h2 className="qm-page-title">Quotations</h2>
          <span className="qm-count">{quotations.length} total</span>
        </div>
        <button className="qm-btn-new" onClick={openNew} id="create-quotation-btn">
          <Plus size={16} />
          Create Quotation
        </button>
      </div>

      {/* Filters */}
      <div className="qm-filters">
        <div className="qm-search-wrap">
          <Search size={15} className="qm-search-icon" />
          <input
            className="qm-search"
            placeholder="Search by client, ID, event…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="quotation-search"
          />
          {search && <button className="qm-clear-search" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <div className="qm-status-filters">
          <button 
            className={`qm-filter-chip ${filterStatus === 'All' ? 'qm-filter-chip--active' : ''}`}
            onClick={() => setFilterStatus('All')}
          >
            All
          </button>
          {STATUS_OPTIONS.map(status => (
            <button 
              key={status}
              className={`qm-filter-chip ${filterStatus === status ? 'qm-filter-chip--active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="qm-empty">
          <FileText size={48} strokeWidth={1} />
          <h3>No quotations found</h3>
          <p>{quotations.length === 0 ? 'Create your first quotation to get started.' : 'Try adjusting your search or filters.'}</p>
          {quotations.length === 0 && (
            <button className="qm-btn-new" onClick={openNew}>
              <Plus size={16} /> Create First Quotation
            </button>
          )}
        </div>
      ) : (
        <div className="qm-list">
          {filtered.map(q => {
            const t = calcTotal(q);
            const dAmt = q.discount && parseFloat(q.discount) > 0 ? Math.round(t * parseFloat(q.discount) / 100) : 0;
            const total = q.totalAmount ? parseFloat(q.totalAmount) : (t - dAmt);
            return (
              <div key={q.id} className="qm-card">
                <div className="qm-card-header">
                  <div className="qm-card-id">{q.id}</div>
                  <select 
                    className={`qm-status qm-status--${(q.status || 'Draft').toLowerCase()}`}
                    value={q.status || 'Draft'}
                    onChange={(e) => updateStatus(q.id, e.target.value)}
                    title="Change Status"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="qm-card-body">
                  <div className="qm-card-client">
                    <User size={15} />
                    <strong>{q.clientName || 'Unnamed Client'}</strong>
                  </div>
                  <div className="qm-card-meta">
                    {q.eventType && <span><Sparkles size={12} /> {q.eventType}</span>}
                    {(q.events && q.events.length > 0 && q.events[0].date) ? (
                      <span title={q.events.map(e => formatDate(e.date)).join(', ')}>
                        <Calendar size={12} /> {q.events.length > 1 ? `${formatDate(q.events[0].date)} +${q.events.length - 1}` : formatDate(q.events[0].date)}
                      </span>
                    ) : q.eventDate && <span><Calendar size={12} /> {formatDate(q.eventDate)}</span>}
                    {q.location && <span><MapPin size={12} /> {q.location}</span>}
                  </div>
                </div>
                <div className="qm-card-footer">
                  <div className="qm-card-total">{formatINR(total)}</div>
                  <div className="qm-card-actions">
                    <button className="qm-action-btn qm-action-preview" onClick={() => openPreview(q)} title="Preview">
                      <Eye size={15} />
                    </button>
                    <button className="qm-action-btn qm-action-edit" onClick={() => openEdit(q)} title="Edit">
                      <Edit2 size={15} />
                    </button>
                    <button className="qm-action-btn qm-action-print" onClick={() => printQuotation(q)} title="Print">
                      <Printer size={15} />
                    </button>
                    <button className="qm-action-btn qm-action-print" onClick={() => downloadQuotationPDF(q, getQuotationHTML)} title="Download PDF">
                      <Download size={15} />
                    </button>
                    <button className="qm-action-btn qm-action-delete" onClick={() => setDeleteConfirm(q.id)} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="qm-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="qm-modal" onClick={e => e.stopPropagation()}>
            <div className="qm-modal-icon"><Trash2 size={28} /></div>
            <h3>Delete Quotation?</h3>
            <p>This action cannot be undone. The quotation <strong>{deleteConfirm}</strong> will be permanently deleted.</p>
            <div className="qm-modal-actions">
              <button className="qm-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="qm-modal-confirm" onClick={() => deleteQ(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════
     RENDER: FORM
     ═══════════════════════════════════════════════ */
  if (view === 'form') return (
    <div className="qm-container" ref={formRef}>
      {/* Form topbar */}
      <div className="qm-topbar">
        <div className="qm-topbar-left">
          <button className="qm-back-btn" onClick={() => setView('list')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="qm-page-title">{editingId ? 'Edit Quotation' : 'New Quotation'}</h2>
          {editingId && <span className="qm-count">{form.id}</span>}
        </div>
        <div className="qm-topbar-right">
        </div>
      </div>

      <div className="qm-form-grid">
        {/* ── Left Column ── */}
        <div className="qm-form-left">
          {/* Client Info */}
          <div className="qm-form-section">
            <div className="qm-section-header">
              <User size={16} />
              <h3>Client Information</h3>
            </div>
            <div className="qm-fields-grid">
              <Field label="Client Name" icon={<User size={13} />} required>
                <input className="qm-input" placeholder="e.g. Priya & Arjun" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} id="client-name" />
              </Field>
              <Field label="Phone" icon={<Phone size={13} />}>
                <input
                  className="qm-input"
                  placeholder="10-digit mobile number"
                  value={form.contactPhone}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setForm(f => ({ ...f, contactPhone: digits }));
                  }}
                  id="client-phone"
                  type="tel"
                  maxLength={10}
                  inputMode="numeric"
                />
              </Field>
            </div>
          </div>

          {/* Event Details */}
          <div className="qm-form-section">
            <div className="qm-section-header">
              <Calendar size={16} />
              <h3>Event Details</h3>
            </div>
            <div className="qm-fields-grid">
              <Field label="Event Type" icon={<Sparkles size={13} />} required>
                <div className="qm-select-wrap">
                  <select className="qm-select" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))} id="event-type">
                    <option value="">Select event type…</option>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="qm-select-arrow" />
                </div>
              </Field>
              <Field label="Event Dates & Details" icon={<Calendar size={13} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(form.events || []).map((ev, i) => (
                    <div key={i} style={{ background: '#F6F4ED', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,45,36,0.1)' }}>
                      <div className="qm-dynamic-row" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <div className="qm-event-date-wrap">
                          {!ev.date && (
                            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,45,36,0.4)', pointerEvents: 'none', fontSize: '0.86rem' }}>
                              Date
                            </div>
                          )}
                          <input 
                            className="qm-input" 
                            type="date" 
                            value={ev.date || ''} 
                            onChange={e => {
                              const newEvents = [...(form.events || [])];
                              newEvents[i].date = e.target.value;
                              setForm(f => ({ ...f, events: newEvents }));
                            }} 
                            style={{ width: '100%', color: ev.date ? 'inherit' : 'rgba(0,0,0,0)' }}
                          />
                        </div>
                        <input 
                          className="qm-input qm-event-name" 
                          placeholder="e.g. Reception, Haldi..." 
                          value={ev.name} 
                          onChange={e => {
                            const newEvents = [...(form.events || [])];
                            newEvents[i].name = e.target.value;
                            setForm(f => ({ ...f, events: newEvents }));
                          }} 
                        />
                        <select 
                          className="qm-select" 
                          value={ev.time || ''} 
                          onChange={e => {
                            const newEvents = [...(form.events || [])];
                            newEvents[i].time = e.target.value;
                            setForm(f => ({ ...f, events: newEvents }));
                          }}
                          style={{ width: '120px' }}
                        >
                          <option value="">Time...</option>
                          <option value="Morning">Morning</option>
                          <option value="Evening">Evening</option>
                          <option value="Full Day">Full Day</option>
                        </select>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newEvents = (form.events || []).filter((_, idx) => idx !== i);
                            setForm(f => ({ ...f, events: newEvents }));
                          }} 
                          className="qm-custom-remove-btn" 
                          style={{ width: '32px', height: '32px' }}
                        >
                          <X size={14}/>
                        </button>
                      </div>
                      
                      <div style={{ paddingLeft: '12px', borderLeft: '2px solid #D4AF37', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#5C6256', textTransform: 'uppercase', letterSpacing: '1px' }}>Requirements</div>
                        {(ev.requirements || []).map((req, reqIdx) => (
                          <div key={reqIdx} className="qm-dynamic-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              className="qm-input" 
                              placeholder="e.g. Traditional Photography" 
                              list="services-list"
                              value={req.item} 
                              onChange={e => {
                                const newEvents = [...(form.events || [])];
                                newEvents[i].requirements[reqIdx].item = e.target.value;
                                setForm(f => ({ ...f, events: newEvents }));
                              }} 
                            />
                            <datalist id="services-list">
                              {ALL_SERVICES.map((s, idx) => <option key={idx} value={s} />)}
                            </datalist>
                            <input 
                              className="qm-input" 
                              placeholder="Qty" 
                              value={req.qty} 
                              onChange={e => {
                                const newEvents = [...(form.events || [])];
                                newEvents[i].requirements[reqIdx].qty = e.target.value;
                                setForm(f => ({ ...f, events: newEvents }));
                              }} 
                              style={{ width: '60px', textAlign: 'center' }}
                            />

                            <button 
                              type="button" 
                              onClick={() => {
                                const newEvents = [...(form.events || [])];
                                newEvents[i].requirements = newEvents[i].requirements.filter((_, idx) => idx !== reqIdx);
                                setForm(f => ({ ...f, events: newEvents }));
                              }} 
                              style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer' }}
                            >
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          onClick={() => {
                            const newEvents = [...(form.events || [])];
                            if (!newEvents[i].requirements) newEvents[i].requirements = [];
                            newEvents[i].requirements.push({ item: '', qty: '1' });
                            setForm(f => ({ ...f, events: newEvents }));
                          }} 
                          style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', padding: '4px 0' }}
                        >
                          + Add Requirement
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => setForm(f => ({ ...f, events: [...(f.events || []), { date: '', name: '', time: '', requirements: [{ item: '', qty: '1' }] }] }))} 
                    className="qm-custom-add-btn" 
                    style={{ alignSelf: 'flex-start' }}
                  >
                    + Add Event Date
                  </button>
                </div>
              </Field>
              <Field label="Location / Venue" icon={<MapPin size={13} />}>
                <input className="qm-input" placeholder="e.g. Grand Ballroom, Coimbatore" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} id="event-location" />
              </Field>
            </div>
          </div>



          {/* Notes */}
          <div className="qm-form-section">
            <div className="qm-section-header">
              <StickyNote size={16} />
              <h3>Notes</h3>
            </div>
            <textarea
              className="qm-textarea"
              placeholder="Any special requirements, instructions, or terms for this client…"
              rows={5}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              id="quotation-notes"
            />
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="qm-form-right">
          {/* Final Outs & Complementary */}
          <div className="qm-form-section">
            <div className="qm-section-header">
              <Package size={16} />
              <h3>Deliverables</h3>
            </div>
            
            {/* Final Out Builder */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#5C6256', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Final Out (Albums, Videos)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(form.finalOuts || []).map((fOut, idx) => (
                  <div key={idx} className="qm-dynamic-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      className="qm-input" 
                      placeholder="e.g. Premium Album (40 Sheets)" 
                      value={fOut.item} 
                      onChange={e => {
                        const newOuts = [...(form.finalOuts || [])];
                        newOuts[idx].item = e.target.value;
                        setForm(f => ({ ...f, finalOuts: newOuts }));
                      }} 
                    />
                    <input 
                      className="qm-input" 
                      placeholder="Qty" 
                      value={fOut.qty} 
                      onChange={e => {
                        const newOuts = [...(form.finalOuts || [])];
                        newOuts[idx].qty = e.target.value;
                        setForm(f => ({ ...f, finalOuts: newOuts }));
                      }} 
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setForm(f => ({ ...f, finalOuts: form.finalOuts.filter((_, i) => i !== idx) }))} 
                      className="qm-custom-remove-btn" 
                      style={{ width: '32px', height: '32px' }}
                    >
                      <X size={14}/>
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => setForm(f => ({ ...f, finalOuts: [...(f.finalOuts || []), { item: '', qty: '1' }] }))} 
                  className="qm-custom-add-btn" 
                  style={{ alignSelf: 'flex-start' }}
                >
                  + Add Final Out
                </button>
              </div>
            </div>

            {/* Complementary Builder */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#5C6256', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Complementary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(form.complementary || []).map((comp, idx) => (
                  <div key={idx} className="qm-dynamic-row" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      className="qm-input" 
                      placeholder="e.g. Two Frames (15x12)" 
                      value={comp.item} 
                      onChange={e => {
                        const newComps = [...(form.complementary || [])];
                        newComps[idx].item = e.target.value;
                        setForm(f => ({ ...f, complementary: newComps }));
                      }} 
                    />
                    <input 
                      className="qm-input" 
                      placeholder="Qty" 
                      value={comp.qty} 
                      onChange={e => {
                        const newComps = [...(form.complementary || [])];
                        newComps[idx].qty = e.target.value;
                        setForm(f => ({ ...f, complementary: newComps }));
                      }} 
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setForm(f => ({ ...f, complementary: form.complementary.filter((_, i) => i !== idx) }))} 
                      className="qm-custom-remove-btn" 
                      style={{ width: '32px', height: '32px' }}
                    >
                      <X size={14}/>
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => setForm(f => ({ ...f, complementary: [...(f.complementary || []), { item: '', qty: '1' }] }))} 
                  className="qm-custom-add-btn" 
                  style={{ alignSelf: 'flex-start' }}
                >
                  + Add Complementary
                </button>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="qm-form-section">
            <div className="qm-section-header">
              <Sparkles size={16} />
              <h3>Additional Services</h3>
            </div>
            <div className="qm-services">
              {ADD_SERVICES.map(svc => (
                <button
                  key={svc.id}
                  className={`qm-svc-chip ${form.additionalServices.includes(svc.id) ? 'qm-svc-chip--selected' : ''}`}
                  onClick={() => toggleService(svc.id)}
                  type="button"
                  id={`svc-${svc.id}`}
                >
                  <span className="qm-svc-check">{form.additionalServices.includes(svc.id) ? <CheckCircle size={12} /> : <span className="qm-svc-circle" />}</span>
                  <span className="qm-svc-name">{svc.name}</span>
                  <span className="qm-svc-price">+{formatINR(svc.price)}{svc.unit}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total, Discount & Final */}
          <div className="qm-form-section qm-total-section">
            <div className="qm-section-header">
              <IndianRupee size={16} />
              <h3>Pricing Summary</h3>
            </div>

            {/* Package Price row */}
            <Field label="Package Price" icon={<IndianRupee size={13} />}>
              <input
                className="qm-input"
                type="number"
                placeholder="e.g. 150000"
                value={form.baseAmount || ''}
                onChange={e => setForm(f => ({ ...f, baseAmount: e.target.value }))}
                id="base-amount"
              />
            </Field>

            {/* Discount */}
            <Field label="Discount (%)" icon={<IndianRupee size={13} />}>
              <input
                className="qm-input"
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 10"
                value={form.discount}
                onChange={e => {
                  const val = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                  setForm(f => ({ ...f, discount: e.target.value === '' ? '' : String(val) }));
                }}
                id="discount-pct"
              />
            </Field>

            {discountPct > 0 && (
              <div className="qm-total-row qm-discount-row">
                <span className="qm-total-label">Discount ({discountPct}%)</span>
                <span className="qm-discount-val">− {formatINR(discountAmt)}</span>
              </div>
            )}

            {/* Final total */}
            <div className="qm-total-row qm-final-row">
              <span className="qm-final-label">Final Total</span>
              <span className="qm-final-val">{formatINR(finalTotal)}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', flexWrap: 'wrap' }}>
              <button className="qm-btn-outline" onClick={() => printQuotation(form)}>
                <Printer size={15} /> Print
              </button>
              <button className="qm-btn-outline" onClick={() => downloadQuotationPDF(form, getQuotationHTML)}>
                <Download size={15} /> Download PDF
              </button>
              <button
                className={`qm-btn-save ${saved ? 'qm-btn-save--done' : ''}`}
                onClick={saveForm}
                disabled={!form.clientName || saved}
                id="save-quotation-btn"
              >
                {saved ? <><CheckCircle size={15} /> Saved!</> : <><FileText size={15} /> Save Quotation</>}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     RENDER: PREVIEW
     ═══════════════════════════════════════════════ */
  if (view === 'preview' && previewQ) {
    const q = previewQ;
    const iframeSrc = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <style>
      ${getQuotationStyle()}
      body { background-color: #f3f4f6; display: flex; justify-content: center; padding: 40px 0; margin: 0; min-height: 100vh; }
      .page { box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden; margin: 0 auto; }
      /* Custom Scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #f3f4f6; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      </style>
      </head>
      <body>
      ${getQuotationHTML(q)}
      </body>
      </html>
    `;

    return (
      <div className="qm-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="qm-topbar">
          <div className="qm-topbar-left">
            <button className="qm-back-btn" onClick={() => setView('list')}><ArrowLeft size={16} /> Back</button>
            <h2 className="qm-page-title">Quotation Preview</h2>
          </div>
          <div className="qm-topbar-right">
            <button className="qm-btn-outline" onClick={() => openEdit(q)}><Edit2 size={15} /> Edit</button>
            <button className="qm-btn-outline" onClick={() => printQuotation(q)}><Printer size={15} /> Print</button>
            <button className="qm-btn-save" onClick={() => downloadQuotationPDF(q, getQuotationHTML)}><Download size={15} /> Download PDF</button>
          </div>
        </div>

        <div style={{ flex: 1, width: '100%', background: '#f3f4f6', minHeight: 'calc(100vh - 100px)' }}>
          <iframe 
            srcDoc={iframeSrc}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            title="PDF Preview"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default QuotationManager;
