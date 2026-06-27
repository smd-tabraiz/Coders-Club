import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft, HiPlus, HiTrash, HiXMark, HiPencil } from 'react-icons/hi2';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { useAuth } from '../../../../../context/AuthContext';
import api from '../../../../../api/axios';
import Card from '../../../../../components/ui/Card';
import Avatar from '../../../../../components/ui/Avatar';
import Badge from '../../../../../components/ui/Badge';
import Spinner from '../../../../../components/ui/Spinner';

import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';

const TeamBatch = () => {
  const { teamId: batch } = useParams();
  const { user } = useAuth();
  const rolePath = user?.role === 'superadmin' ? '/superadmin' : user?.role === 'admin' ? '/admin' : user?.role === 'member' ? '/member' : '/dashboard';

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  
  // Add/Edit Member State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    photo: '',
    position: '',
    role: 'Core Member',
    domain: '',
    skills: '',
    github: '',
    linkedIn: ''
  });

  useEffect(() => {
    fetchTeam();
  }, [batch]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/teams/${batch}`);
      setTeam(res.data.data);
    } catch (err) {
      setTeam({ batch, groupPhoto: '', members: [] });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditMemberId(null);
    setNewMember({ name: '', photo: '', position: '', role: 'Core Member', domain: '', skills: '', github: '', linkedIn: '' });
    setIsModalOpen(true);
  };

  const handleEditClick = (member) => {
    setEditMemberId(member._id);
    setNewMember({
      name: member.name || '',
      photo: member.photo || '',
      position: member.position || '',
      role: member.role || 'Core Member',
      domain: member.domain || '',
      skills: member.skills ? member.skills.join(', ') : '',
      github: member.github || '',
      linkedIn: member.linkedIn || ''
    });
    setIsModalOpen(true);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.position) return;
    
    setSubmitting(true);
    try {
      const memberPayload = {
        ...newMember,
        skills: newMember.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      try {
        if (editMemberId) {
          await api.put(`/teams/${batch}/member/${editMemberId}`, memberPayload);
        } else {
          await api.post(`/teams/${batch}/member`, memberPayload);
        }
      } catch (err) {
        if (!editMemberId && err.response?.status === 404) {
          // Team doesn't exist, create it first
          await api.post('/teams', { batch, members: [memberPayload] });
        } else {
          throw err;
        }
      }

      setIsModalOpen(false);
      setEditMemberId(null);
      setNewMember({ name: '', photo: '', position: '', role: 'Core Member', domain: '', skills: '', github: '', linkedIn: '' });
      fetchTeam();
    } catch (err) {
      alert(`Failed to ${editMemberId ? 'update' : 'add'} member: ` + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/teams/${batch}/member/${memberId}`);
      fetchTeam();
    } catch (err) {
      alert('Failed to remove member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {/* Back Link */}
      <Link to={`${rolePath}/teams`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-bold">
        <HiArrowLeft /> Back to Teams
      </Link>

      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Team Batch {batch}</h1>
          <p className="text-sm text-slate-500">Batch coordinators and primary developer representatives</p>
        </div>
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm cursor-pointer"
          >
            <HiPlus className="w-5 h-5" /> Add Member
          </button>
        )}
      </div>

      {/* Team Cards Grid */}
      {team.members.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
          <p className="text-slate-500 font-medium">No members added to this batch roster yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.members.map((member) => (
            <div key={member._id} className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 text-center border border-slate-200/50 dark:border-slate-800/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-1.5 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => handleEditClick(member)}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-primary hover:bg-primary hover:text-white rounded-full shadow-md transition-all duration-200 cursor-pointer"
                    title="Edit Member"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleRemoveMember(member._id)}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-md transition-all duration-200 cursor-pointer"
                    title="Remove Member"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Subtle background gradient blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-secondary/20 transition-colors" />

              {/* Photo */}
              <div className="relative flex justify-center mb-5 z-10">
                <Avatar 
                  name={member.name} 
                  src={member.photo} 
                  size="xl" 
                  className="ring-4 ring-white dark:ring-slate-900 shadow-xl" 
                />
              </div>

              {/* Identity info */}
              <div className="space-y-1.5 z-10 relative">
                <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">{member.name}</h4>
                <p className="text-[11px] font-bold text-primary dark:text-primary-400 uppercase tracking-wider">{member.role}</p>
                <div className="pt-1.5">
                  <Badge variant={member.position.toLowerCase().includes('president') || member.position.toLowerCase().includes('lead') ? 'primary' : 'secondary'} className="shadow-sm">
                    {member.position}
                  </Badge>
                </div>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-5 pb-4 z-10 relative">
                {member.skills.map((skill) => (
                  <span key={skill} className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex justify-center gap-3 text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800/50 z-10 relative">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <SiGithub className="w-4 h-4" />
                  </a>
                )}
                {member.linkedIn && (
                  <a href={member.linkedIn} target="_blank" rel="noreferrer" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0A66C2] transition-colors">
                    <SiLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
              {editMemberId ? 'Edit Member' : 'Add New Member'}
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Profile Photo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewMember({...newMember, photo: reader.result});
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setNewMember({...newMember, photo: ''});
                      }
                    }}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 dark:file:bg-primary/20 dark:file:text-primary-light cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Position (e.g. President)"
                  value={newMember.position}
                  onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                  required
                />
                <Input
                  label="Role (e.g. Core Member)"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                />
              </div>
              <Input
                label="Domain (e.g. Web Dev)"
                value={newMember.domain}
                onChange={(e) => setNewMember({...newMember, domain: e.target.value})}
              />
              <Input
                label="Skills (comma separated)"
                value={newMember.skills}
                onChange={(e) => setNewMember({...newMember, skills: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="LinkedIn URL"
                  type="url"
                  value={newMember.linkedIn}
                  onChange={(e) => setNewMember({...newMember, linkedIn: e.target.value})}
                />
                <Input
                  label="GitHub URL"
                  type="url"
                  value={newMember.github}
                  onChange={(e) => setNewMember({...newMember, github: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 cursor-pointer" loading={submitting}>
                  {editMemberId ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};

export default TeamBatch;
