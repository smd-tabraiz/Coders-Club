import React from 'react';
import { Link } from 'react-router-dom';
import { SiGithub, SiLinkedin, SiInstagram, SiMailbox } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold">
              CC
            </div>
            <span className="font-bold text-white text-lg tracking-wide">Coders Club GPREC</span>
          </div>
          <p className="text-sm">
            Mastering data structures, algorithms, and real-world software engineering at G. Pulla Reddy Engineering College.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#events" className="hover:text-primary transition-colors">Events</a></li>
            <li><a href="#team" className="hover:text-primary transition-colors">Team</a></li>
            <li><a href="#gallery" className="hover:text-primary transition-colors">Gallery</a></li>
          </ul>
        </div>

        {/* Contacts Column */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact Info</h4>
          <ul className="space-y-2.5 text-sm">
            <li>G. Pulla Reddy Engineering College</li>
            <li>Kurnool, AP - 518007</li>
            <li>Email: <a href="mailto:support@codersclubgprec.in" className="hover:text-white transition-colors">support@codersclubgprec.in</a></li>
          </ul>
        </div>

        {/* Social Links Column */}
        <div>
          <h4 className="font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex items-center gap-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><SiGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><SiLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><SiInstagram /></a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs gap-4">
        <p>© 2026 Coders Club GPREC. All rights reserved.</p>
        <p>Made with ❤️ by Coders Club GPREC Team</p>
      </div>
    </footer>
  );
};

export default Footer;
