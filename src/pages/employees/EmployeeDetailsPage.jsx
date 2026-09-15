import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import OutlineButton from '../../components/buttons/OutlineButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { mockEmployees, mockProjects, mockTasks } from '../../utils/mockData';
import { formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowLeft,
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
} from 'lucide-react';

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useNotifications();

  const employee = mockEmployees.find((e) => e.id === id) || mockEmployees[0];
  const assignedProjects = mockProjects.filter((p) =>
    p.team.some((t) => t.name.includes(employee.name.split(' ')[0]))
  );

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
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-20 h-20 rounded-[22px] object-cover ring-4 ring-purple-100 shadow-md"
              />
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
    </PageTransition>
  );
};

export default EmployeeDetailsPage;
