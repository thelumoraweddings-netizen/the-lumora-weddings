import React from 'react';
import { motion } from 'framer-motion';
import ConnectForm from '../components/ConnectForm';
import './Booking.css';

const Booking = () => {
  return (
    <div className="page-wrapper immersive-booking-page">
      <ConnectForm />
    </div>
  );
};

export default Booking;