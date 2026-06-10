import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineTrophy, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  // Edit Profile form states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    linkedIn: user?.linkedIn || '',
    github: user?.github || '',
    skills: user?.skills ? user.skills.join(', ') : '',
  });
  const [editLoading, setEditLoading] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    
    const skillsArray = editFormData.skills
      ? editFormData.skills.split(',').map(s => s.trim()).filter(s => s !== '')
      : [];

    await updateProfile({
      name: editFormData.name,
      phone: editFormData.phone,
      linkedIn: editFormData.linkedIn,
      github: editFormData.github,
      skills: skillsArray,
    });

    setEditLoading(false);
    setIsEditOpen(false);
  };

  const performanceData = [
    { name: 'Contest 1', score: 85 },
    { name: 'Web Dev', score: 90 },
    { name: 'Hackathon 4.0', score: 78 },
    { name: 'CP Quiz', score: 92 }
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Profile Header card */}
      <Card className="p-8 border border-slate-200/10 relative overflow-hidden">
        {/* top header banner fill */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-tr from-primary to-secondary opacity-20" />
        
        <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar name={user?.name} size="xl" className="ring-4 ring-white dark:ring-slate-900 shadow-xl" />
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">{user?.name || 'GPREC Student'}</h2>
              <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider">{user?.rollNo || '22911A0501'} • {user?.department || 'CSE'}</p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
                <Badge variant="primary">{user?.year ? `${user.year} Year` : '3rd Year'}</Badge>
                <Badge variant="secondary" className="capitalize">{user?.role || 'Member'}</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="mt-4 md:mt-0 text-xs">
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Ratios Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Events Participated', val: user?.eventsParticipated || 12, icon: HiOutlineCheckCircle },
          { label: 'Events Won', val: user?.eventsWon || 3, icon: HiOutlineTrophy },
          { label: 'Certificates Earned', val: 5, icon: HiOutlineAcademicCap },
          { label: 'Attendance Ratio', val: `${user?.attendance || 85}%`, icon: HiOutlineClock }
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
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user?.skills && user.skills.length > 0 ? (
                user.skills.map((skill) => (
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
            <div className="space-y-3 text-sm">
              <a href={user?.github || 'https://github.com'} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <SiGithub className="text-lg" /> GitHub Profile
              </a>
              <a href={user?.linkedIn || 'https://linkedin.com'} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                <SiLinkedin className="text-lg" /> LinkedIn Profile
              </a>
            </div>
          </Card>
        </div>

        {/* Right Column Graph */}
        <div className="lg:col-span-2">
          <Card className="space-y-6 border border-slate-200/10">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Performance Analytics</h3>
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="score" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
          <Input
            label="Phone"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            required
          />
          <Input
            label="LinkedIn URL"
            value={editFormData.linkedIn}
            onChange={(e) => setEditFormData({ ...editFormData, linkedIn: e.target.value })}
          />
          <Input
            label="GitHub URL"
            value={editFormData.github}
            onChange={(e) => setEditFormData({ ...editFormData, github: e.target.value })}
          />
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

          <Button type="submit" variant="primary" loading={editLoading} className="w-full py-3">
            Save Changes
          </Button>
        </form>
      </Modal>

    </div>
  );
};

export default Profile;
