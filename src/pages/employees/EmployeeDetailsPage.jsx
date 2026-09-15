import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import OutlineButton from '../../components/buttons/OutlineButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { mockEmployees, mockProjects, mockTasks } from '../../utils/mockData';
import { formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Star,
  Activity,
  Briefcase,
  UserCog,
} from 'lucide-react';

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotifications();

  const initialEmp = mockEmployees.find((e) => e.id === id) || mockEmployees[0];
  const [employee, setEmployee] = useState(initialEmp);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editEmpForm, setEditEmpForm] = useState({
    ...initialEmp,
    skills: Array.isArray(initialEmp.skills) ? initialEmp.skills.join(', ') : initialEmp.skills,
  });

  const assignedProjects = mockProjects.filter((p) =>
    p.team.some((t) => t.name.includes(employee.name.split(' ')[0]))
  );

  const departments = ['Artificial Intelligence', 'Web & Cloud', 'Mobile Engineering', 'Design & Experience', 'Finance & Operations', 'Executive / Leadership'];

  const handleSaveEditEmployee = (e) => {
    e.preventDefault();
    const skillsArr = typeof editEmpForm.skills === 'string'
      ? editEmpForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : editEmpForm.skills;

    const updated = {
      ...employee,
      ...editEmpForm,
      skills: skillsArr,
    };
    setEmployee(updated);
    setIsEditModalOpen(false);
    showSuccess(`Updated profile for ${updated.name}!`);
  };

  return (
    <PageTransition>
      <PageHeader
        title={employee.name}
        subtitle={`${employee.role} • ${employee.department}`}
        breadcrumbs={[
          { label: 'Employees', path: '/employees' },
          { label: employee.name },
        ]}
        actions={
          <>
            <OutlineButton icon={ArrowLeft} size="sm" onClick={() => navigate('/employees')}>
              Back to Team
            </OutlineButton>
            <SecondaryButton
              size="sm"
              icon={UserCog}
              onClick={() => {
                setEditEmpForm({
                  ...employee,
                  skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills,
                });
                setIsEditModalOpen(true);
              }}
            >
              Edit Profile
            </SecondaryButton>
            <PrimaryButton
              variant="orange"
              size="sm"
              onClick={() => showInfo(`Sending calendar invitation to ${employee.name}...`)}
            >
              Schedule 1:1 Sync
            </PrimaryButton>
          </>
        }
      />

      {/* Hero Profile Card */}
      <Card className="mb-6 !p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-[22px] bg-purple-100 text-brand-primary flex items-center justify-center ring-4 ring-purple-100 shadow-md">
                <User className="w-10 h-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  {employee.name}
                </h2>
                <Badge variant="success" dot>
                  {employee.status}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-brand-primary font-semibold mt-0.5">
                {employee.role}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{employee.department}</span>
                <span>•</span>
                <span>{employee.location}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="p-3 bg-purple-50 rounded-[14px] text-center min-w-[100px]">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Tasks Solved</p>
              <p className="text-lg font-bold font-heading text-brand-primary mt-0.5">{employee.completedTasks}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-[14px] text-center min-w-[100px]">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Attendance</p>
              <p className="text-lg font-bold font-heading text-amber-700 mt-0.5">{employee.attendance}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-[14px] text-center min-w-[100px]">
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Peer Rating</p>
              <p className="text-lg font-bold font-heading text-emerald-700 mt-0.5">{employee.rating}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Contact Info & Skills */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Email</span>
                <span className="font-semibold text-brand-primary">{employee.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Phone</span>
                <span className="font-semibold text-slate-800">{employee.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Work Location</span>
                <span className="font-semibold text-slate-800">{employee.location}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Joined Organization</span>
                <span className="font-semibold text-slate-800">{formatDate(employee.joinDate)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-3">Core Skills & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 text-brand-primary text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Assigned Projects & Velocity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-base font-bold font-heading text-slate-900 mb-4">
              Assigned Client Projects ({assignedProjects.length})
            </h3>
            <div className="space-y-3">
              {assignedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="p-4 rounded-[16px] bg-slate-50/80 hover:bg-purple-50/40 border border-slate-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 font-heading">{proj.title}</h4>
                    <Badge variant="purple">{proj.statusLabel}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{proj.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Deadline: {formatDate(proj.deadline)}</span>
                    <span className="font-bold text-brand-primary">{proj.progress}% Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Profile — ${employee.name}`}
          subtitle="Update employee details and skillset."
          footer={
            <>
              <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSaveEditEmployee} variant="purple">
                Update Profile
              </PrimaryButton>
            </>
          }
        >
          <form onSubmit={handleSaveEditEmployee} className="space-y-4">
            <Input
              label="Full Name *"
              value={editEmpForm.name || ''}
              onChange={(e) => setEditEmpForm({ ...editEmpForm, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Designation / Role *"
                value={editEmpForm.role || ''}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, role: e.target.value })}
                required
              />
              <Select
                label="Department *"
                options={departments}
                value={editEmpForm.department || departments[0]}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, department: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Email *"
                type="email"
                value={editEmpForm.email || ''}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number *"
                value={editEmpForm.phone || ''}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Base Office Location *"
                options={['Mumbai Office', 'Bengaluru Office', 'Pune Office', 'Remote']}
                value={editEmpForm.location || 'Mumbai Office'}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, location: e.target.value })}
              />
              <Select
                label="Employment Status"
                options={['Active', 'On Leave', 'Inactive']}
                value={editEmpForm.status || 'Active'}
                onChange={(e) => setEditEmpForm({ ...editEmpForm, status: e.target.value })}
              />
            </div>
            <Input
              label="Joining Date"
              type="date"
              value={editEmpForm.joinDate || '2022-01-01'}
              onChange={(e) => setEditEmpForm({ ...editEmpForm, joinDate: e.target.value })}
            />
            <Input
              label="Core Skills (comma-separated)"
              placeholder="e.g. React, Node.js, Python, AWS"
              value={editEmpForm.skills || ''}
              onChange={(e) => setEditEmpForm({ ...editEmpForm, skills: e.target.value })}
            />
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default EmployeeDetailsPage;
