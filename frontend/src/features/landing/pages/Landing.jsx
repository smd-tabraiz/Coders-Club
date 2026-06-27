import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUsers, HiCalendar, HiCodeBracket, HiTrophy, HiChevronDown, HiBars3, HiXMark } from 'react-icons/hi2';
import { SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';
import api from '../../../api/axios';

// Stat counter helper component
const Counter = ({ to, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to.replace(/\D/g, ''));
    if (start === end) return;

    let totalDuration = 2000;
    let incrementTime = Math.abs(Math.floor(totalDuration / end));
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, Math.max(incrementTime, 15));

    return () => clearInterval(timer);
  }, [to]);

  return (
    <div ref={elementRef} className="flex flex-col items-center p-6 glass rounded-2xl text-center space-y-2">
      <div className="p-4 rounded-full bg-primary/10 text-primary dark:text-primary-300 text-3xl">
        <Icon />
      </div>
      <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white">
        {count}
        {to.includes('+') ? '+' : ''}
      </h3>
      <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic data states
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, galleryRes, teamsRes] = await Promise.all([
          api.get('/events?status=upcoming'),
          api.get('/gallery'),
          api.get('/teams')
        ]);
        
        // Take up to 3 upcoming events
        if (eventsRes.data?.data) {
          setEvents(eventsRes.data.data.slice(0, 3));
        }
        
        // Take up to 6 gallery photos
        if (galleryRes.data?.data) {
          setGallery(galleryRes.data.data.slice(0, 6));
        }

        // Get the latest team batch members
        if (teamsRes.data?.data && teamsRes.data.data.length > 0) {
          const latestTeam = teamsRes.data.data[0];
          setTeamMembers(latestTeam.members || []);
        }
      } catch (err) {
        console.error('Failed to fetch landing page data', err);
      }
    };
    fetchData();
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Team', href: '#team' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const el = document.getElementById(href.replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div id="home" className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* Landing Sticky Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/30">
              CC
            </div>
            <span className="font-extrabold text-slate-800 dark:text-white text-xl tracking-wide">
              Coders Club
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-400 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-200/20 md:hidden dark:text-white cursor-pointer"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 glass flex flex-col justify-center items-center gap-8"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-slate-200/20 dark:text-white cursor-pointer"
            >
              <HiXMark className="w-7 h-7" />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-2xl font-bold text-slate-800 dark:text-white hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-lg shadow-lg shadow-primary/25"
            >
              Join Community
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-tr from-slate-900 via-primary-950 to-slate-900 text-white select-none">
        
        {/* Animated code brackets in background */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute text-slate-800/40 text-[18vw] font-bold top-[10%] left-[5%] animate-float select-none">{'{'}</span>
          <span className="absolute text-slate-800/40 text-[18vw] font-bold bottom-[10%] right-[5%] animate-float-delayed select-none">{'}'}</span>
          <span className="absolute text-slate-800/30 text-[12vw] font-bold top-[40%] right-[12%] animate-float select-none">{'</>'}</span>
          <span className="absolute text-slate-800/35 text-[15vw] font-bold bottom-[30%] left-[8%] animate-float-delayed select-none">{';'}</span>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-accent-300"
          >
            🚀 Welcome to the Future of Coding
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            Coders Club <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary-400 to-secondary font-black">
              GPREC
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium"
          >
            Empowering coders, building future innovators at G. Pulla Reddy Engineering College, Kurnool.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
              Join Our Community
            </Link>
            <a
              href="#events"
              className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
            >
              Explore Events
            </a>
          </motion.div>
        </div>

        {/* Bouncing Chevron scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <HiChevronDown className="w-8 h-8 text-slate-400" />
        </div>
      </header>

      {/* 2. About / Features Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white inline-block relative pb-2.5">
            What We Do
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-full" />
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto font-medium">
            Fostering programming culture and engineering excellence through a variety of student activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Coding Competitions', desc: 'Sharpen DSA and logical problem solving with regular competitive quizzes and challenges.', icon: '🏆' },
            { title: 'Technical Workshops', desc: 'Hands-on practical classes covering web stack, machine learning, and cloud infrastructure.', icon: '🔧' },
            { title: 'Innovative Hackathons', desc: 'Convert brainstorming ideas into production prototypes in focused 24 to 48 hour hack marathons.', icon: '💻' },
            { title: 'Competitive Programming', desc: 'Prepare for national level ICPC, Codeforces, Leetcode, and industry assessment tests.', icon: '📊' },
            { title: 'Technical Sessions', desc: 'Listen to expert panel reviews, alumni career guides, and host open doubt clears.', icon: '🎤' }
          ].map((feat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-8 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all border border-slate-200/20"
            >
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section id="stats" className="py-20 bg-gradient-to-br from-slate-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Counter to="500+" label="Active Members" icon={HiUsers} />
          <Counter to="50+" label="Events Held" icon={HiCalendar} />
          <Counter to="20+" label="Active Projects" icon={HiCodeBracket} />
          <Counter to="100+" label="Achievements" icon={HiTrophy} />
        </div>
      </section>

      {/* 4. Upcoming Events Section */}
      <section id="events" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white inline-block relative pb-2.5">
            Featured Events
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-full" />
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto font-medium">
            Join one of our premium upcoming events and kickstart your coding roadmap today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(events.length > 0 ? events : [
            { name: 'Code Sprint 2026', description: 'Annual algorithm optimization challenge with certificates and prizes worth ₹50,000.', date: 'Oct 15, 2026', venue: 'CSE Seminar Hall' },
            { name: 'React Web Bootcamp', description: 'A 3-day deep dive into modern frontend frameworks, Tailwind, and fullstack integrations.', date: 'Nov 05, 2026', venue: 'Computer Lab 3' },
            { name: 'Hackathon 5.0', description: 'GPREC’s premier coding hackathon - build solutions for local college administration.', date: 'Dec 12, 2026', venue: 'Auditorium' }
          ]).map((evt, idx) => (
            <div key={evt._id || idx} className="glass rounded-2xl overflow-hidden border border-slate-200/20 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between h-full">
              {evt.banner ? (
                <div className="h-40 relative flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                  <img src={evt.banner} alt={evt.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-tr from-primary to-accent relative flex items-center justify-center">
                  <span className="text-white text-5xl font-black">{idx + 1}</span>
                </div>
              )}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">{evt.name || evt.title}</h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-3">{evt.description || evt.desc}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-semibold text-primary-500 dark:text-primary-400">
                    <span>📅 {evt.date ? new Date(evt.date).toDateString() : 'TBA'}</span>
                    <span className="truncate max-w-[120px] text-right">📍 {evt.venue || 'TBA'}</span>
                  </div>
                  <Link
                    to="/login"
                    className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-900 text-center font-bold text-sm transition-all"
                  >
                    Learn More & Register
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Gallery Preview Section */}
      <section id="gallery" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-200/10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white inline-block relative pb-2.5">
            Club Gallery
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-full" />
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {(gallery.length > 0 ? gallery : [
            { id: 1, gradient: 'from-primary to-secondary' },
            { id: 2, gradient: 'from-secondary to-accent' },
            { id: 3, gradient: 'from-accent to-primary' },
            { id: 4, gradient: 'from-primary-600 to-slate-900' },
            { id: 5, gradient: 'from-emerald-500 to-cyan-500' },
            { id: 6, gradient: 'from-rose-500 to-orange-500' }
          ]).map((item, idx) => (
            <div
              key={item._id || item.id || idx}
              className={`rounded-2xl ${item.url ? 'bg-slate-100 dark:bg-slate-900' : `bg-gradient-to-tr ${item.gradient}`} relative overflow-hidden group shadow-md hover:scale-[1.02] transition-all duration-300 ${
                idx === 1 ? 'row-span-2' : ''
              }`}
            >
              {item.url && (
                <img src={item.url} alt={item.title || "Gallery Item"} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                {item.title && <p className="text-white font-bold mb-2">{item.title}</p>}
                <Link to="/login" className="px-5 py-2 rounded-xl bg-white text-slate-900 font-bold text-sm">
                  View full gallery
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Core Team Section */}
      {teamMembers.length > 0 && (
        <section id="team" className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white inline-block relative pb-2.5">
              Meet the Team
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent rounded-full" />
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto font-medium">
              The passionate individuals driving the club's vision forward.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <div key={member._id} className="flex flex-col items-center p-4 glass rounded-2xl border border-slate-200/10 shadow-sm hover:shadow-md transition-shadow">
                <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-primary/20" />
                <h4 className="font-bold text-slate-800 dark:text-white text-center text-sm">{member.name}</h4>
                <p className="text-xs text-primary font-semibold text-center mt-1">{member.position}</p>
                <div className="flex gap-3 mt-4 text-slate-400">
                  {member.linkedIn && <a href={member.linkedIn} target="_blank" rel="noreferrer" className="hover:text-primary"><SiLinkedin /></a>}
                  {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-primary"><SiGithub /></a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-extrabold text-slate-800 dark:text-white mb-16">
            Voices of GPREC Coders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { q: 'Coders Club completely reshaped my software engineering roadmap. Peer learning reviews helped me land my internship.', author: 'Rahul K. (CSE 2024)' },
              { q: 'Organizing the hackathons and hosting contests pushed me to master practical React and REST server building skills.', author: 'Priya S. (IT 2025)' },
              { q: 'Excellent peer support team. If you want to crack DSA reviews or build clean web assets, join this club.', author: 'Aditya M. (CSE 2024)' }
            ].map((t, i) => (
              <div key={i} className="glass p-8 rounded-2xl border border-slate-200/10 shadow-lg flex flex-col justify-between">
                <span className="text-5xl text-primary/30 font-serif leading-none">“</span>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">{t.q}</p>
                <h5 className="font-bold text-slate-800 dark:text-white text-xs">{t.author}</h5>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA / Footer Join */}
      <section className="py-20 text-center bg-gradient-to-tr from-primary via-secondary to-accent text-white">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Boost Your Technical Skills?</h2>
          <p className="text-slate-100 max-w-lg mx-auto">
            Become a part of GPREC’s official coding network and start building industry projects.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl shadow-xl hover:scale-105 transition-all"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-500 py-12 px-6 text-center border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">© 2026 Coders Club GPREC. All rights reserved.</p>
          <div className="flex gap-4 text-xl">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white"><SiGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white"><SiLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white"><SiInstagram /></a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
