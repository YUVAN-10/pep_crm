import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/forms/SearchBar';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import { mockEmployees } from '../../utils/mockData';
import { useNotifications } from '../../context/NotificationContext';
import {
  Plus,
  User,
  UserCog,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Star,
  Eye,
  Briefcase,
} from 'lucide-react';

export const EmployeesListPage = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({});
  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  const departments = ['All', 'Artificial Intelligence', 'Web & Cloud', 'Mobile Engineering', 'Design & Experience', 'Finance & Operations', 'Executive / Leadership'];

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, departmentFilter]);

  const [editEmpModal, setEditEmpModal] = useState(null);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const skillsArr = typeof newEmp.skills === 'string'
      ? newEmp.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : (newEmp.skills || ['React', 'Node.js', 'PostgreSQL']);

    const created = {
      id: `emp-${Date.now()}`,
      name: newEmp.name || 'New Engineer',
      role: newEmp.role || 'Fullstack Developer',
      department: newEmp.department || 'Web & Cloud',
      email: newEmp.email || 'engineer@pepsoftwares.com',
      phone: newEmp.phone || '+91 99000 11111',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      status: newEmp.status || 'Active',
      joinDate: newEmp.joinDate || new Date().toISOString().split('T')[0],
      location: newEmp.location || 'Mumbai Office',
      skills: skillsArr.length > 0 ? skillsArr : ['Software Engineering', 'Problem Solving'],
      activeProjects: 1,
      completedTasks: 0,
      rating: '5.0/5.0',
      attendance: '100%',
    };

    setEmployees([...employees, created]);
    setIsAddModalOpen(false);
    setNewEmp({});
    showSuccess(`Employee ${created.name} onboarded successfully!`);
  };

  const handleSaveEditEmployee = (e) => {
    e.preventDefault();
    if (!editEmpModal) return;
    const skillsArr = typeof editEmpModal.skills === 'string'
      ? editEmpModal.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : editEmpModal.skills;

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === editEmpModal.id ? { ...editEmpModal, skills: skillsArr } : emp))
    );
    setEditEmpModal(null);
    showSuccess(`Employee ${editEmpModal.name} profile updated successfully!`);
  };

  return (
    <PageTransition>
      <PageHeader
        title="Employee Directory"
        subtitle="Manage engineers, AI architects, product designers, and project managers."
        breadcrumbs={[{ label: 'Employees' }]}
        actions={
          <PrimaryButton
            variant="orange"
            size="sm"
            icon={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Employee
          </PrimaryButton>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search team members by name, role, email..."
            className="max-w-md w-full"
          />

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Department:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-[12px] px-3 py-2 outline-none"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Employees Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <Card
              key={emp.id}
              hover
              onClick={() => navigate(`/employees/${emp.id}`)}
              className="flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Top Avatar & Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-[18px] bg-purple-100 text-brand-primary flex items-center justify-center ring-2 ring-purple-100 shadow-sm">
                      <User className="w-7 h-7" />
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="purple">{emp.department}</Badge>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditEmpModal({
                          ...emp,
                          skills: Array.isArray(emp.skills) ? emp.skills.join(', ') : emp.skills,
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-brand-primary hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <UserCog className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-brand-primary transition-colors">
                  {emp.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{emp.role}</p>

                {/* Contact info */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.location}</span>
                  </p>
                  <p className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>Joined: {emp.joinDate || '2022-01-01'} • Status: <strong className="text-slate-700">{emp.status}</strong></span>
                  </p>
                </div>

                {/* Skills tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(Array.isArray(emp.skills) ? emp.skills : (emp.skills || '').split(',')).slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                    >
                      {typeof skill === 'string' ? skill.trim() : skill}
                    </span>
                  ))}
                  {(Array.isArray(emp.skills) ? emp.skills : (emp.skills || '').split(',')).length > 3 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-brand-primary">
                      +{(Array.isArray(emp.skills) ? emp.skills : (emp.skills || '').split(',')).length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
                  {emp.activeProjects} Active Projects
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                  {emp.rating}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={UserCog}
            title="No Employees Found"
            description="We could not find any team member matching the search filters."
            actionLabel="Add Employee"
            onAction={() => setIsAddModalOpen(true)}
          />
        </Card>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Team Member"
        subtitle="Add a new engineer or staff member to PEP Software team."
        footer={
          <>
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleAddEmployee} variant="orange">
              Save Employee
            </PrimaryButton>
          </>
        }
      >
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Aditi Sharma"
            value={newEmp.name || ''}
            onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role *"
              placeholder="e.g. Senior Frontend Engineer"
              value={newEmp.role || ''}
              onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
              required
            />
            <Select
              label="Department *"
              options={departments.filter((d) => d !== 'All')}
              value={newEmp.department || 'Web & Cloud'}
              onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Work Email *"
              type="email"
              placeholder="aditi@pepsoftwares.com"
              value={newEmp.email || ''}
              onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number *"
              placeholder="+91 98201 00000"
              value={newEmp.phone || ''}
              onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Base Office Location *"
              options={['Mumbai Office', 'Bengaluru Office', 'Pune Office', 'Remote']}
              value={newEmp.location || 'Mumbai Office'}
              onChange={(e) => setNewEmp({ ...newEmp, location: e.target.value })}
            />
            <Select
              label="Employment Status"
              options={['Active', 'On Leave', 'Inactive']}
              value={newEmp.status || 'Active'}
              onChange={(e) => setNewEmp({ ...newEmp, status: e.target.value })}
            />
          </div>
          <Input
            label="Joining Date"
            type="date"
            value={newEmp.joinDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setNewEmp({ ...newEmp, joinDate: e.target.value })}
          />
          <Input
            label="Core Skills (comma-separated)"
            placeholder="e.g. React, Node.js, Python, AWS"
            value={newEmp.skills || ''}
            onChange={(e) => setNewEmp({ ...newEmp, skills: e.target.value })}
          />
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      {editEmpModal && (
        <Modal
          isOpen={!!editEmpModal}
          onClose={() => setEditEmpModal(null)}
          title={`Edit Profile — ${editEmpModal.name}`}
          subtitle="Update employee information and skill set."
          footer={
            <>
              <SecondaryButton onClick={() => setEditEmpModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSaveEditEmployee} variant="purple">
                Update Profile
              </PrimaryButton>
            </>
          }
        >
          <form onSubmit={handleSaveEditEmployee} className="space-y-4">
            <Input
              label="Full Name *"
              value={editEmpModal.name || ''}
              onChange={(e) => setEditEmpModal({ ...editEmpModal, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Designation / Role *"
                value={editEmpModal.role || ''}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, role: e.target.value })}
                required
              />
              <Select
                label="Department *"
                options={departments.filter((d) => d !== 'All')}
                value={editEmpModal.department || 'Web & Cloud'}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, department: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Work Email *"
                type="email"
                value={editEmpModal.email || ''}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number *"
                value={editEmpModal.phone || ''}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Base Office Location *"
                options={['Mumbai Office', 'Bengaluru Office', 'Pune Office', 'Remote']}
                value={editEmpModal.location || 'Mumbai Office'}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, location: e.target.value })}
              />
              <Select
                label="Employment Status"
                options={['Active', 'On Leave', 'Inactive']}
                value={editEmpModal.status || 'Active'}
                onChange={(e) => setEditEmpModal({ ...editEmpModal, status: e.target.value })}
              />
            </div>
            <Input
              label="Joining Date"
              type="date"
              value={editEmpModal.joinDate || '2022-01-01'}
              onChange={(e) => setEditEmpModal({ ...editEmpModal, joinDate: e.target.value })}
            />
            <Input
              label="Core Skills (comma-separated)"
              placeholder="e.g. React, Node.js, Python, AWS"
              value={editEmpModal.skills || ''}
              onChange={(e) => setEditEmpModal({ ...editEmpModal, skills: e.target.value })}
            />
          </form>
        </Modal>
      )}
    </PageTransition>
  );
};

export default EmployeesListPage;
