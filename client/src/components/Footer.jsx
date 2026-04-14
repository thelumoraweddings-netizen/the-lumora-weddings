import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-modern section-padding">
            <div className="container">
                <div className="grid-container mb-12">
                    {/* Brand Col */}
                    <div className="col-span-4 footer-brand-col">
                        <Link to="/" className="footer-logo-modern">
                            <img src="/logo.png" alt="THE LUMORA WEDDINGS Logo" className="footer-logo-img" />
                        </Link>
                        <p className="footer-brand-desc">
                            A premier luxury photography studio specializing in cinematic wedding storytelling.
                            Crafting timeless memories with heart and artistry since 2020.
                        </p>
                        <div className="footer-social-modern mt-8">
                            <a href="https://www.instagram.com/TheLumoraWeddings" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Nav Col 1 */}
                    <div className="col-span-2 footer-nav-col">
                        <h4 className="footer-heading-modern">Studio</h4>
                        <ul className="footer-list-modern">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/gallery">Wedding Films</Link></li>
                            <li><Link to="/about">Our Story</Link></li>
                        </ul>
                    </div>

                    {/* Nav Col 2 */}
                    <div className="col-span-2 footer-nav-col">
                        <h4 className="footer-heading-modern">Explore</h4>
                        <ul className="footer-list-modern">
                            <li><Link to="/booking">Book Us</Link></li>
                            <li><Link to="/testimonials">Testimonials</Link></li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div className="col-span-4 footer-contact-col">
                        <h4 className="footer-heading-modern">Get In Touch</h4>
                        <ul className="footer-contact-list">
                            <li>
                                <a href="tel:+919345849846" className="footer-contact-link">
                                    <Phone size={18} color="var(--accent-color)" />
                                    <span className="footer-nowrap">+91 9345849846</span>
                                </a>
                            </li>
                            <li>
                                <a href="tel:+919629130158" className="footer-contact-link">
                                    <Phone size={18} color="var(--accent-color)" />
                                    <span className="footer-nowrap">+91 9629130158</span>
                                </a>
                            </li>
                            <li>
                                <MapPin size={18} color="var(--accent-color)" />
                                <span>Coimbatore & Chennai, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-modern">
                    <p>&copy; {new Date().getFullYear()} THE LUMORA WEDDINGS. All rights reserved.</p>
                    <div className="footer-legal-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
