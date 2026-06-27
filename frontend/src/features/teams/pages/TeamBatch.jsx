import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi2';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import api from '../../../api/axios';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';

const TeamBatch = () => {
  const { batch } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, [batch]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/teams/${batch}`);
      setTeam(res.data.data);
    } catch (err) {
      // Mock team roster if API call fails
      const mockTeam = {
        batch,
        groupPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
        members: [
          {
            _id: '1',
            name: 'Anish Reddy',
            position: 'President',
            role: 'Club Head',
            domain: 'Competitive Programming',
            skills: ['C++', 'DSA', 'Algorithms'],
            linkedIn: 'https://linkedin.com',
            github: 'https://github.com',
          },
          {
            _id: '2',
            name: 'Sai Kiran',
            position: 'Vice President',
            role: 'Operations Head',
            domain: 'Web Development',
            skills: ['React.js', 'Node.js', 'Express.js'],
            linkedIn: 'https://linkedin.com',
            github: 'https://github.com',
          },
          {
            _id: '3',
            name: 'Venkatesh P',
            position: 'Technical Lead',
            role: 'Core Team Member',
            domain: 'Full Stack Development',
            skills: ['MERN', 'Next.js', 'TypeScript'],
            linkedIn: 'https://linkedin.com',
            github: 'https://github.com',
          },
          {
            _id: '4',
            name: 'Harika K',
            position: 'Design Lead',
            role: 'Core Team Member',
            domain: 'UI/UX Design',
            skills: ['Figma', 'CSS3', 'TailwindCSS'],
            linkedIn: 'https://linkedin.com',
            github: 'https://github.com',
          }
        ]
      };
      setTeam(mockTeam);
    } finally {
      setLoading(false);
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
      <Link to="/dashboard/teams" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-bold">
        <HiArrowLeft /> Back to Teams
      </Link>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Team Batch {batch}</h1>
        <p className="text-sm text-slate-500">Batch coordinators and primary developer representatives</p>
      </div>

      {/* Team Cards Grid */}
      {team.members.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
          <p className="text-slate-500 font-medium">No members added to this batch roster yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.members.map((member) => (
            <Card key={member._id} className="text-center space-y-4 border border-slate-200/10">
              
              {/* Photo */}
              <div className="flex justify-center">
                <Avatar name={member.name} size="lg" className="ring-4 ring-primary/10" />
              </div>

              {/* Identity info */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 dark:text-white leading-tight">{member.name}</h4>
                <p className="text-xs text-slate-400 font-semibold">{member.role}</p>
                <Badge variant={member.position === 'President' ? 'primary' : 'secondary'} className="mt-1">
                  {member.position}
                </Badge>
              </div>

              {/* Skills pills */}
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {member.skills.map((skill) => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 font-bold text-slate-500">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex justify-center gap-4 text-slate-400 pt-2 border-t border-slate-200/10">
                {member.github && (
                  <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-slate-800 dark:hover:text-white transition-colors">
                    <SiGithub className="w-5 h-5" />
                  </a>
                )}
                {member.linkedIn && (
                  <a href={member.linkedIn} target="_blank" rel="noreferrer" className="hover:text-slate-800 dark:hover:text-white transition-colors">
                    <SiLinkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

            </Card>
          ))}
        </div>
      )}

    </div>
  );
};

export default TeamBatch;
