import React, { useState } from 'react';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import { mockMeetings } from '../../utils/mockData';
import { formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  CalendarDays,
  Plus,
  Video,
  Clock,
  ExternalLink,
  Users,
  MapPin,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const MeetingsCalendarPage = () => {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMeet, setNewMeet] = useState({});
  const { showSuccess, showInfo } = useNotifications();

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const created = {
      id: `meet-${Date.now()}`,
      title: newMeet.title || 'Client Project Sync',
      client: newMeet.client || 'Enterprise Client',
      date: newMeet.date || new Date().toISOString().split('T')[0],
      time: newMeet.time || '11:00 AM - 11:45 AM',
      platform: newMeet.platform || 'Google Meet',
      link: 'https://meet.google.com/pep-sync',
      agenda: newMeet.agenda || 'Discuss project deliverables and timeline.',
      host: 'Sanjay Verma',
      attendees: ['sanjay@pepsoftwares.com', 'client@domain.com'],
      status: 'Scheduled',
    };

    setMeetings([created, ...meetings]);
    setIsAddModalOpen(false);
    setNewMeet({});
    showSuccess('Meeting scheduled and invitations sent!');
  };

  return (
    <PageTransition>
      <PageHeader
        title="Meetings & Calendar"
        subtitle="Coordinate client sprint reviews, product architecture demos, and discovery calls."
        breadcrumbs={[{ label: 'Meetings' }]}
        actions={
          <PrimaryButton
            variant="orange"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Schedule Meeting
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Calendar Grid */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-purple-50 text-brand-primary flex items-center justify-center font-bold">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900">March 2026</h3>
                  <p className="text-xs text-slate-400">Showing all client meetings & sprint calls</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => showInfo('Previous Month')}
                  className="p-1.5 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="px-3 py-1 text-xs font-semibold rounded-[10px] bg-purple-100 text-brand-primary"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => showInfo('Next Month')}
                  className="p-1.5 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase text-slate-400 mb-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-purple-600 font-extrabold">Sat</span>
              <span className="text-purple-600 font-extrabold">Sun</span>
            </div>

            {/* Mini Month Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === 15;
                const hasMeeting = day === 15 || day === 16 || day === 18;

                return (
                  <div
                    key={day}
                    className={`min-h-[70px] p-2 rounded-[14px] border transition-all text-left flex flex-col justify-between ${
                      isToday
                        ? 'bg-purple-50/80 border-brand-primary/50 shadow-xs'
                        : 'bg-slate-50/40 border-slate-100 hover:bg-slate-100/60'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isToday ? 'text-brand-primary' : 'text-slate-700'}`}>
                      {day}
                    </span>

                    {hasMeeting && (
                      <div className="mt-1">
                        <span className="inline-block w-full truncate text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          {day === 15 ? 'Discovery Call' : day === 16 ? 'Architecture' : 'Retro'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Today's Agenda & Call Join cards */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">
              Scheduled Meetings ({meetings.length})
            </h3>

            <div className="space-y-3.5">
              {meetings.map((meet) => (
                <div
                  key={meet.id}
                  className="p-4 rounded-[18px] bg-slate-50/80 hover:bg-purple-50/50 border border-slate-100 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-brand-primary uppercase">
                        {meet.platform}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 font-heading mt-1.5 leading-snug">
                        {meet.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{meet.client}</p>
                    </div>

                    {meet.link && (
                      <a
                        href={meet.link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white shadow-2xs text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                        title="Join Meeting Call"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{meet.agenda}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(meet.date)} • {meet.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Client Meeting"
        subtitle="Setup conference link and send invitations."
        footer={
          <>
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleScheduleMeeting} variant="orange">
              Book Meeting
            </PrimaryButton>
          </>
        }
      >
        <form onSubmit={handleScheduleMeeting} className="space-y-4">
          <Input
            label="Meeting Subject"
            placeholder="e.g. Sprint 5 Release & Architecture Review"
            value={newMeet.title || ''}
            onChange={(e) => setNewMeet({ ...newMeet, title: e.target.value })}
            required
          />
          <Input
            label="Client Organization"
            placeholder="e.g. Zenith Global FinTech"
            value={newMeet.client || ''}
            onChange={(e) => setNewMeet({ ...newMeet, client: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={newMeet.date || ''}
              onChange={(e) => setNewMeet({ ...newMeet, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              placeholder="11:00 AM - 11:45 AM"
              value={newMeet.time || ''}
              onChange={(e) => setNewMeet({ ...newMeet, time: e.target.value })}
              required
            />
          </div>
          <Select
            label="Video Platform"
            options={['Google Meet', 'Zoom', 'In-Person / Office', 'Microsoft Teams']}
            value={newMeet.platform || 'Google Meet'}
            onChange={(e) => setNewMeet({ ...newMeet, platform: e.target.value })}
          />
          <TextArea
            label="Agenda"
            placeholder="Outline topics to discuss..."
            value={newMeet.agenda || ''}
            onChange={(e) => setNewMeet({ ...newMeet, agenda: e.target.value })}
          />
        </form>
      </Modal>
    </PageTransition>
  );
};

export default MeetingsCalendarPage;
