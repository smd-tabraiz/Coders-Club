import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import { HiArrowLeft, HiCalendarDays, HiMapPin, HiUserGroup, HiCurrencyRupee } from 'react-icons/hi2';
import api from '../../../../../api/axios';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import Modal from '../../../../../components/ui/Modal';
import Spinner from '../../../../../components/ui/Spinner';
import { QRCodeSVG } from 'qrcode.react';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Modal forms states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [regFormData, setRegFormData] = useState({
    name: user?.name || '',
    rollNo: user?.rollNo || '',
    branch: user?.department || 'CSE',
    year: user?.year ? user.year.toString() : '3',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  // Payment States
  const [regStep, setRegStep] = useState(1);
  const [transactionId, setTransactionId] = useState('');

  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [userRegistration, setUserRegistration] = useState(null);

  useEffect(() => {
    fetchEvent();
    if (user) {
      checkRegistration();
    }
  }, [id, user]);

  const checkRegistration = async () => {
    try {
      const res = await api.get('/registrations/my');
      const regs = res.data.data;
      const myReg = regs.find(r => (r.eventId?._id || r.eventId || r.event) === id);
      if (myReg) setUserRegistration(myReg);
    } catch (err) {
      console.error('Failed to check registration:', err);
    }
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      // Mock event details if fetch fails
      const mockEvent = {
        _id: id,
        name: 'Code Sprint 2026',
        category: 'competition',
        banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
        description: 'Prepare to stretch your coding capabilities. Code Sprint 2026 brings algorithmic challenges and logical problem-solving puzzles straight to G. Pulla Reddy Engineering College. Bring your own laptops and battle against coders across all branches.',
        venue: 'CSE Seminar Hall',
        date: '2026-10-15T10:00:00Z',
        time: '10:00 AM',
        status: 'upcoming',
        registrationFee: 50,
        maxParticipants: 100,
        coordinators: [
          { name: 'Anish Reddy', phone: '+91 9988776655', email: 'anish@gprec.ac.in' },
          { name: 'Sai Kiran', phone: '+91 8877665544', email: 'kiran@gprec.ac.in' }
        ],
        rules: [
          'Teams of maximum 2 participants allowed.',
          'Bring your own system/laptops fully charged.',
          'Plagiarism check will run instantly.',
          'Only standard libraries are allowed.'
        ],
        sponsors: [
          { name: 'Google Developers Group' }
        ]
      };
      setEvent(mockEvent);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    // Local validation for allowedYears
    if (event.allowedYears && event.allowedYears.length > 0) {
      const allowed = event.allowedYears;
      if (!allowed.includes(Number(regFormData.year))) {
        setRegError(`Your academic year (Year ${regFormData.year}) is not eligible for this event. Allowed years: ${allowed.join(', ')}`);
        setRegLoading(false);
        return;
      }

      if (event.teamSize > 1) {
        for (const member of teamMembers) {
          if (!allowed.includes(Number(member.year))) {
            setRegError(`Team member ${member.name} (Year ${member.year}) is not eligible. Allowed years: ${allowed.join(', ')}`);
            setRegLoading(false);
            return;
          }
        }
      }
    }

    if (event.teamSize > 1 && event.maxFourthYears !== null && event.maxFourthYears !== undefined) {
      let fourthYearCount = 0;
      if (Number(regFormData.year) === 4) fourthYearCount++;
      for (const member of teamMembers) {
        if (Number(member.year) === 4) fourthYearCount++;
      }
      if (fourthYearCount > event.maxFourthYears) {
        setRegError(`This team has ${fourthYearCount} 4th-year student(s). The maximum allowed per team for this event is ${event.maxFourthYears}.`);
        setRegLoading(false);
        return;
      }
    }

    if (event.registrationFee > 0 && regStep === 1) {
      setRegStep(2);
      setRegLoading(false);
      return;
    }

    try {
      const payload = {
        event: id,
        teamName,
        teamMembers
      };
      
      if (event.registrationFee > 0) {
        payload.transactionId = transactionId;
      }

      const res = await api.post('/registrations', payload);
      
      setTicket({
        ticketId: res.data.data.ticketId,
        eventName: event.name,
        name: res.data.data.name || user?.name,
        rollNo: res.data.data.rollNo || user?.rollNo,
        venue: event.venue,
      });
      setIsRegisterOpen(false);
      setRegStep(1);
      setTransactionId('');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    if (isRegisterOpen && event && event.teamSize > 1) {
      // Initialize team members if not already set, minus the leader
      if (teamMembers.length !== event.teamSize - 1) {
        setTeamMembers(Array(event.teamSize - 1).fill({ name: '', rollNo: '', branch: '', phone: '', email: '', year: '' }));
      }
    }
  }, [isRegisterOpen, event]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="lg" />
      </div>
    );
  }

  const rolePath = user?.role === 'superadmin' ? '/superadmin' : user?.role === 'admin' ? '/admin' : user?.role === 'member' ? '/member' : '/dashboard';
  const regPath = user?.role === 'student' ? '/dashboard/my-registrations' : `${rolePath}/registrations`;

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 font-bold">Event not found.</p>
        <Link to={`${rolePath}/events`} className="mt-4 inline-block btn btn-primary">Go back</Link>
      </div>
    );
  }

  const isUpcoming = event.status === 'upcoming';
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <div className="space-y-8 select-none">
      
      {/* Back Link */}
      <Link to={`${rolePath}/events`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-bold">
        <HiArrowLeft /> Back to Events
      </Link>

      {/* Hero Banner Banner Card */}
      <Card className="p-0 overflow-hidden border border-slate-200/10">
        <div className="h-64 relative bg-slate-100 dark:bg-slate-950">
          <img src={event.banner} alt={event.name} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8 text-white">
            <div className="space-y-2">
              <Badge variant={event.status === 'upcoming' ? 'primary' : 'success'}>
                {event.status}
              </Badge>
              <h1 className="text-2xl md:text-4xl font-extrabold">{event.name}</h1>
            </div>
          </div>
        </div>
      </Card>

      {/* Info Row Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Date', val: new Date(event.date).toDateString(), icon: HiCalendarDays },
          { label: 'Venue', val: event.venue, icon: HiMapPin },
          { label: 'Max Seats', val: `${event.maxParticipants} slots`, icon: HiUserGroup },
          { label: 'Fee', val: event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`, icon: HiCurrencyRupee }
        ].map((item, i) => (
          <Card key={i} className="flex items-center gap-4 py-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary text-xl">
              <item.icon />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">{item.label}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{item.val}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Split Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-slate-200/20 gap-6">
            {['details', 'rules', 'coordinators'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-bold capitalize relative cursor-pointer ${
                  activeTab === tab ? 'text-primary' : 'text-slate-500'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === 'details' && (
              <Card>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </Card>
            )}

            {activeTab === 'rules' && (
              <Card className="space-y-3">
                {event.rules.length === 0 ? (
                  <p className="text-slate-500 text-sm">Standard community participation rules apply.</p>
                ) : (
                  event.rules.map((rule, idx) => (
                    <div key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-primary">{idx + 1}.</span>
                      <p>{rule}</p>
                    </div>
                  ))
                )}
              </Card>
            )}

            {activeTab === 'coordinators' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.coordinators.map((coord, idx) => (
                  <Card key={idx} className="space-y-2">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">{coord.name}</h5>
                    <p className="text-xs text-slate-500">Phone: {coord.phone}</p>
                    {coord.email && <p className="text-xs text-slate-500">Email: {coord.email}</p>}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column Registration & Tickets */}
        <div>
          {ticket ? (
            <Card className="border border-emerald-500/30 bg-emerald-500/5 text-center space-y-6">
              <div className="space-y-2">
                <span className="text-3xl">🎉</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Registration Confirmed</h3>
                <p className="text-xs text-slate-500">Show this ticket checkin code at the venue entry.</p>
              </div>

              {/* Ticket stub */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative text-left">
                {/* side stub punches */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800" />

                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{ticket.ticketId}</div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{ticket.eventName}</h4>
                <div className="text-xs text-slate-500 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-1">
                  <p>Name: {ticket.name}</p>
                  <p>Roll No: {ticket.rollNo}</p>
                  <p>Venue: {ticket.venue}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  You have successfully registered for the event!
                </p>
              </div>
            </Card>
          ) : userRegistration ? (
            <Card className="space-y-4 text-center border border-emerald-500/20 bg-emerald-500/5">
              <span className="text-4xl block">🎉</span>
              <h3 className="font-extrabold text-emerald-700 dark:text-emerald-400">You're Registered!</h3>
              <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">
                Status: {userRegistration.status}
              </p>
              <Button variant="outline" className="w-full text-xs" onClick={() => navigate(regPath)}>
                View My Registrations
              </Button>
            </Card>
          ) : (
            <Card className="space-y-4 text-center">
              <h3 className="font-bold text-slate-800 dark:text-white">Registration Portal</h3>
              
              {event.allowedYears && event.allowedYears.length > 0 && (
                <div className="py-2 px-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-semibold">
                  Allowed Years: {event.allowedYears.sort().map(y => `${y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'}`).join(', ')}
                </div>
              )}

              <p className="text-xs text-slate-500">
                {isUpcoming
                  ? 'Registration is open. Register immediately to secure your participation slot.'
                  : 'Registrations are closed or completed.'}
              </p>

              {isUpcoming ? (
                <Button variant="primary" onClick={() => setIsRegisterOpen(true)} className="w-full">
                  Register Now
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  Closed
                </Button>
              )}
            </Card>
          )}
        </div>

      </div>

      {/* Registration Form Modal */}
      <Modal 
        isOpen={isRegisterOpen} 
        onClose={() => {
          setIsRegisterOpen(false);
          setRegStep(1);
          setTransactionId('');
        }} 
        title={regStep === 1 ? "Register for Event" : "Complete Payment"}
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className={regStep === 1 ? 'space-y-4' : 'hidden'}>
            {regError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold">
                {regError}
              </div>
            )}
            <Input
            label="Full Name"
            value={regFormData.name}
            onChange={(e) => setRegFormData({ ...regFormData, name: e.target.value })}
            required
          />
          <Input
            label="Roll Number"
            value={regFormData.rollNo}
            onChange={(e) => setRegFormData({ ...regFormData, rollNo: e.target.value })}
            required
          />
          <Input
            label="Branch"
            value={regFormData.branch}
            onChange={(e) => setRegFormData({ ...regFormData, branch: e.target.value })}
            required
          />
          <Input
            label="Year"
            value={regFormData.year}
            onChange={(e) => setRegFormData({ ...regFormData, year: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={regFormData.phone}
            onChange={(e) => setRegFormData({ ...regFormData, phone: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={regFormData.email}
            onChange={(e) => setRegFormData({ ...regFormData, email: e.target.value })}
            required
            disabled
          />

          {event?.teamSize > 1 && (
            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white">Team Details (Size: {event.teamSize})</h4>
              <Input
                label="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
              {teamMembers.map((member, index) => (
                <div key={index} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Team Member {index + 1}</p>
                  <Input
                    label="Name"
                    value={member.name}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = { ...newMembers[index], name: e.target.value };
                      setTeamMembers(newMembers);
                    }}
                    required
                  />
                  <Input
                    label="Roll Number"
                    value={member.rollNo}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = { ...newMembers[index], rollNo: e.target.value };
                      setTeamMembers(newMembers);
                    }}
                    required
                  />
                  <Input
                    label="Branch"
                    value={member.branch}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = { ...newMembers[index], branch: e.target.value };
                      setTeamMembers(newMembers);
                    }}
                    required
                  />
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Year</label>
                    <select
                      value={member.year}
                      onChange={(e) => {
                        const newMembers = [...teamMembers];
                        newMembers[index] = { ...newMembers[index], year: Number(e.target.value) };
                        setTeamMembers(newMembers);
                      }}
                      className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-sm"
                      required
                    >
                      <option value="" disabled>Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <Input
                    label="Phone Number"
                    value={member.phone}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = { ...newMembers[index], phone: e.target.value };
                      setTeamMembers(newMembers);
                    }}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={member.email}
                    onChange={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[index] = { ...newMembers[index], email: e.target.value };
                      setTeamMembers(newMembers);
                    }}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {regError && (
            <p className="text-rose-500 text-sm font-semibold">{regError}</p>
          )}

          </div>

          <div className={regStep === 1 ? "block" : "hidden"}>
            <Button type="submit" variant="primary" loading={regLoading} className="w-full py-3 mt-4">
              {event?.registrationFee > 0 ? 'Proceed to Payment' : 'Submit Registration'}
            </Button>
          </div>
        </form>

        {regStep === 2 && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6 mt-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 text-center border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-sm text-slate-500 font-medium">Scan the QR code below to pay the registration fee.</p>
              
              <div className="flex justify-center p-4 bg-white rounded-xl shadow-sm inline-block mx-auto border border-slate-100">
                <QRCodeSVG 
                  value={`upi://pay?pa=${event.paymentUpiId || 'codersclub@ybl'}&pn=Coders Club&am=${event.registrationFee * (event.teamSize > 1 ? (1 + teamMembers.length) : 1)}&cu=INR`} 
                  size={200}
                  level="H"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Amount Due</p>
                <p className="text-3xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-1">
                  <HiCurrencyRupee className="w-8 h-8 text-primary" />
                  {event.registrationFee * (event.teamSize > 1 ? (1 + teamMembers.length) : 1)}
                </p>
                <p className="text-xs text-slate-500">UPI ID: <span className="font-bold text-slate-700 dark:text-slate-300">{event.paymentUpiId || 'codersclub@ybl'}</span></p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                12-Digit Transaction / UTR Number
              </label>
              <Input
                placeholder="e.g. 312345678901"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500">Please provide the exact transaction ID from your payment app to ensure verification.</p>
            </div>

            {regError && (
              <p className="text-rose-500 text-sm font-semibold text-center">{regError}</p>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setRegStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" variant="primary" loading={regLoading} className="flex-[2]">
                Verify & Submit
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default EventDetail;
