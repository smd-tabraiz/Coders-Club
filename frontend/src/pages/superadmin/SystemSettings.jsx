import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiCog6Tooth, HiCheckCircle, HiBuildingOffice2, HiLink, HiEnvelope, HiPhone } from 'react-icons/hi2';
import Card from '../../components/ui/Card';

const SystemSettings = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    clubName: 'Coders Club GPREC',
    tagline: 'Code. Build. Innovate.',
    email: 'codersclub@gprec.ac.in',
    phone: '+91 98765 43210',
    college: 'Gudlavalleru Engineering College (GPREC)',
    website: 'https://gprec.ac.in',
    linkedIn: 'https://linkedin.com/company/coders-club-gprec',
    github: 'https://github.com/coders-club-gprec',
    instagram: 'https://instagram.com/codersclub_gprec',
    registrationOpen: true,
    allowGuestView: true,
    maxTeamSize: 5,
    certificatePrefix: 'CC-GPREC',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Section = ({ title, icon: Icon, children }) => (
    <Card className="space-y-5">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200/10">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-white text-base">{title}</h3>
      </div>
      {children}
    </Card>
  );

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
      />
    </div>
  );

  const Toggle = ({ label, name, description }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiCog6Tooth className="text-primary animate-spin-slow" /> System Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure club details, platform behavior and social links.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Club Info */}
        <Section title="Club Information" icon={HiBuildingOffice2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Club Name" name="clubName" placeholder="Coders Club GPREC" />
            <Field label="Tagline" name="tagline" placeholder="Code. Build. Innovate." />
            <Field label="College / Institution" name="college" placeholder="GPREC" />
            <Field label="Certificate Prefix" name="certificatePrefix" placeholder="CC-GPREC" />
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Details" icon={HiEnvelope}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Contact Email" name="email" type="email" placeholder="codersclub@gprec.ac.in" />
            <Field label="Phone Number" name="phone" placeholder="+91 98765 43210" />
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social & Web Links" icon={HiLink}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Website URL" name="website" placeholder="https://gprec.ac.in" />
            <Field label="LinkedIn URL" name="linkedIn" placeholder="https://linkedin.com/..." />
            <Field label="GitHub URL" name="github" placeholder="https://github.com/..." />
            <Field label="Instagram URL" name="instagram" placeholder="https://instagram.com/..." />
          </div>
        </Section>

        {/* Platform Settings */}
        <Section title="Platform Settings" icon={HiCog6Tooth}>
          <div className="space-y-2 divide-y divide-slate-200/10">
            <Toggle
              label="Open Registration"
              name="registrationOpen"
              description="Allow new students to register for the club"
            />
            <Toggle
              label="Allow Guest View"
              name="allowGuestView"
              description="Let visitors browse events without logging in"
            />
          </div>
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Max Team Size</label>
            <input
              type="number"
              name="maxTeamSize"
              value={form.maxTeamSize}
              onChange={handleChange}
              min={1}
              max={10}
              className="w-32 py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </Section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            Save Changes
          </motion.button>
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-emerald-500 font-semibold text-sm"
            >
              <HiCheckCircle className="w-5 h-5" /> Settings saved successfully!
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
