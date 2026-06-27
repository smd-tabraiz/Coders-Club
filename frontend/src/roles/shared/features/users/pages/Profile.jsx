import React, { useState } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineTrophy, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import Card from '../../../../../components/ui/Card';
import Avatar from '../../../../../components/ui/Avatar';
import Badge from '../../../../../components/ui/Badge';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import Modal from '../../../../../components/ui/Modal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { addSuperAdmin } from '../../../../../features/users/user.service';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Create Super Admin form states
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [superAdminData, setSuperAdminData] = useState({ name: '', email: '', password: '' });
  const [superAdminLoading, setSuperAdminLoading] = useState(false);

  const handleCreateSuperAdmin = async (e) => {
    e.preventDefault();
    setSuperAdminLoading(true);
    try {
      await addSuperAdmin(superAdminData);
      alert('Super Admin account created successfully');
      setIsSuperAdminModalOpen(false);
      setSuperAdminData({ name: '', email: '', password: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Super Admin');
    } finally {
      setSuperAdminLoading(false);
    }
  };

  // Edit Profile form states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    socialLinks: user?.socialLinks || [],
    skills: user?.skills ? user.skills.join(', ') : '',
    department: user?.department || '',
    experience: user?.experience || 0,
    awards: user?.awards || 0,
    publications: user?.publications || 0,
    memberships: user?.memberships || '',
    eventsParticipated: user?.eventsParticipated || 0,
    eventsWon: user?.eventsWon || 0,
    certificates: user?.certificates || 0,
    attendance: user?.attendance || 100,
  });
  const [editLoading, setEditLoading] = useState(false);

  const isSuperAdmin = user?.role === 'superadmin';

  const handleAddSocialLink = () => {
    setEditFormData({
      ...editFormData,
      socialLinks: [...editFormData.socialLinks, { platform: '', url: '' }]
    });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updated = [...editFormData.socialLinks];
    updated[index][field] = value;
    setEditFormData({ ...editFormData, socialLinks: updated });
  };

  const handleRemoveSocialLink = (index) => {
    const updated = editFormData.socialLinks.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, socialLinks: updated });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    const skillsArray = editFormData.skills
      ? editFormData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      : [];

    try {
      await updateProfile({
        name: editFormData.name,
        phone: editFormData.phone,
        socialLinks: editFormData.socialLinks.filter(l => l.platform && l.url),
        skills: skillsArray,
        department: editFormData.department,
        experience: Number(editFormData.experience),
        awards: Number(editFormData.awards),
        publications: Number(editFormData.publications),
        memberships: editFormData.memberships,
        eventsParticipated: Number(editFormData.eventsParticipated),
        eventsWon: Number(editFormData.eventsWon),
        certificates: Number(editFormData.certificates),
        attendance: Number(editFormData.attendance),
      });

      setIsEditOpen(false);
    } catch (err) {
      console.error('Failed to save profile changes:', err);
      const msg = err.response?.data?.message || err.message || 'Please try again.';
      alert(`Failed to save profile changes: ${msg}`);
    } finally {
      setEditLoading(false);
    }
  };

  const displayName = user?.name && user.name !== 'superadmin' ? user.name : 'Super Admin';
  const displaySub = user?.role === 'superadmin' 
    ? (user?.department ? `${user.department} Department` : 'System Administrator')
    : `${user?.rollNo || 'N/A'} • ${user?.department || 'N/A'}`;
  
  const displayYear = user?.year ? `${user.year} Year` : 'N/A';
  const displaySkills = user?.skills || [];

  const performanceData = isSuperAdmin ? [
    { name: 'Research', score: 95 },
    { name: 'Mentoring', score: 90 },
    { name: 'Administration', score: 85 },
    { name: 'Teaching', score: 98 }
  ] : [];

  return (
    <div className="space-y-8 select-none">
      
      {/* Profile Header card */}
      <Card className="p-8 border border-slate-200/10 relative overflow-hidden">
        {/* top header banner fill */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-tr from-primary to-secondary opacity-20" />
        
        <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar name={displayName !== 'N/A' ? displayName : undefined} size="xl" className="ring-4 ring-white dark:ring-slate-900 shadow-xl" />
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">{displayName}</h2>
              <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider">{displaySub}</p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
                {displayYear !== 'N/A' && <Badge variant="primary">{displayYear}</Badge>}
                <Badge variant="secondary" className="capitalize">{isSuperAdmin ? 'Super Admin / Convener' : (user?.role || 'Member')}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 md:mt-0">
            {isSuperAdmin && (
              <Button variant="primary" size="sm" onClick={() => setIsSuperAdminModalOpen(true)} className="text-xs">
                Create Super Admin
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="text-xs">
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Ratios Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: isSuperAdmin ? 'Years Experience' : 'Events Participated', val: isSuperAdmin ? (user?.experience || 0) : (user?.eventsParticipated || 0), icon: HiOutlineClock },
          { label: isSuperAdmin ? 'Best Teacher Awards' : 'Events Won', val: isSuperAdmin ? (user?.awards || 0) : (user?.eventsWon || 0), icon: HiOutlineTrophy },
          { label: isSuperAdmin ? 'Total Publications' : 'Certificates Earned', val: isSuperAdmin ? (user?.publications || 0) : (user?.certificates || 0), icon: HiOutlineAcademicCap },
          { label: isSuperAdmin ? 'Professional Memberships' : 'Attendance Ratio', val: isSuperAdmin ? (user?.memberships || 'None') : `${user?.attendance || 100}%`, icon: HiOutlineCheckCircle }
        ].map((item, i) => (
          <Card key={i} className="flex items-center gap-4 py-4 border border-slate-200/10">
            <div className="p-3 rounded-lg bg-primary/10 text-primary text-xl">
              <item.icon />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
              <p className="text-lg font-extrabold text-slate-800 dark:text-white">{item.val}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Skills and Socials */}
        <div className="space-y-8">
          <Card className="space-y-4 border border-slate-200/10">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">{isSuperAdmin ? 'Research Interests / Skills' : 'Skills'}</h3>
            <div className="flex flex-wrap gap-2">
              {displaySkills.length > 0 ? (
                displaySkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-xl text-xs font-bold text-primary dark:text-primary-300 border border-primary/10">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500">No skills added yet.</p>
              )}
            </div>
          </Card>

          <Card className="space-y-4 border border-slate-200/10">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Social Profiles</h3>
            <div className="space-y-3 text-sm flex flex-col">
              {user?.socialLinks?.length > 0 ? (
                user.socialLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{link.platform}:</span> 
                    <span className="text-xs truncate">{link.url}</span>
                  </a>
                ))
              ) : (
                <p className="text-xs text-slate-500">No social profiles added.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column Graph */}
        <div className="lg:col-span-2">
          <Card className="space-y-6 border border-slate-200/10">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">{isSuperAdmin ? 'Professional Impact' : 'Performance Analytics'}</h3>
            <div className="h-64 w-full text-xs flex items-center justify-center">
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 italic">No analytics data available yet.</p>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <select
              value={editFormData.department}
              onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
              className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-sm"
              required
            >
              <option value="" disabled>Select Department</option>
              <option value="ECS">ECS</option>
              <option value="CSE">CSE</option>
              <option value="CSM">CSM</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <Input
            label="Phone"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            required
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Social Profiles</label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSocialLink} className="text-[10px] py-1 h-7 px-2">
                + Add Link
              </Button>
            </div>
            {editFormData.socialLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Platform (e.g. GitHub)"
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(idx, 'platform', e.target.value)}
                  className="w-1/3 py-2 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-lg outline-none text-xs"
                />
                <input
                  type="url"
                  placeholder="Profile URL"
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                  className="flex-1 py-2 px-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-lg outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocialLink(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Skills (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. React, Node.js, C++"
              value={editFormData.skills}
              onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
              className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isSuperAdmin ? (
              <>
                <Input type="number" label="Years Experience" value={editFormData.experience} onChange={e => setEditFormData({...editFormData, experience: e.target.value})} />
                <Input type="number" label="Teacher Awards" value={editFormData.awards} onChange={e => setEditFormData({...editFormData, awards: e.target.value})} />
                <Input type="number" label="Publications" value={editFormData.publications} onChange={e => setEditFormData({...editFormData, publications: e.target.value})} />
                <Input label="Memberships" value={editFormData.memberships} onChange={e => setEditFormData({...editFormData, memberships: e.target.value})} />
              </>
            ) : (
              <>
                <Input type="number" label="Events Participated" value={editFormData.eventsParticipated} onChange={e => setEditFormData({...editFormData, eventsParticipated: e.target.value})} />
                <Input type="number" label="Events Won" value={editFormData.eventsWon} onChange={e => setEditFormData({...editFormData, eventsWon: e.target.value})} />
                <Input type="number" label="Certificates Earned" value={editFormData.certificates} onChange={e => setEditFormData({...editFormData, certificates: e.target.value})} />
                <Input type="number" label="Attendance (%)" value={editFormData.attendance} onChange={e => setEditFormData({...editFormData, attendance: e.target.value})} />
              </>
            )}
          </div>

          <Button type="submit" variant="primary" loading={editLoading} className="w-full py-3">
            Save Changes
          </Button>
        </form>
      </Modal>

      {/* Create Super Admin Modal */}
      <Modal isOpen={isSuperAdminModalOpen} onClose={() => setIsSuperAdminModalOpen(false)} title="Create Super Admin">
        <form onSubmit={handleCreateSuperAdmin} className="space-y-4">
          <Input
            label="Full Name"
            value={superAdminData.name}
            onChange={(e) => setSuperAdminData({ ...superAdminData, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={superAdminData.email}
            onChange={(e) => setSuperAdminData({ ...superAdminData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={superAdminData.password}
            onChange={(e) => setSuperAdminData({ ...superAdminData, password: e.target.value })}
            required
          />
          <Button type="submit" variant="primary" loading={superAdminLoading} className="w-full py-3">
            Create Super Admin
          </Button>
        </form>
      </Modal>

    </div>
  );
};

export default Profile;
