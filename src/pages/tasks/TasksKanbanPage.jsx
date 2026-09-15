import React, { useState, useMemo } from 'react';
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
import SearchBar from '../../components/forms/SearchBar';
import { mockTasks, mockEmployees, mockProjects } from '../../utils/mockData';
import { TASK_COLUMNS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Plus,
  Clock,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  X,
  User,
  History,
  Send,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const TasksKanbanPage = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [myTasksOnly, setMyTasksOnly] = useState(false);
  const [projectFilter, setProjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [dueTodayOnly, setDueTodayOnly] = useState(false);

  // Drawers & Modals
  const [selectedTask, setSelectedTask] = useState(null); // Right-side drawer
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({});

  // Comments inside Drawer
  const [comments, setComments] = useState([
    { id: 'tc-1', author: 'Sanjay Verma', time: '2 hours ago', text: 'Please ensure webhook response handles signature verification retries.' },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const { showSuccess } = useNotifications();

  // Filter Computation
  const filteredTasks = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMyTasks = !myTasksOnly || t.assignedTo?.name?.includes('Pooja') || t.assignedTo?.name?.includes('Sanjay');
      const matchesProject = projectFilter === 'All' || t.project.includes(projectFilter);
      const matchesPriority = priorityFilter === 'All' || t.priority.toLowerCase() === priorityFilter.toLowerCase();
      const matchesDueToday = !dueTodayOnly || t.dueDate === todayStr;

      return matchesSearch && matchesMyTasks && matchesProject && matchesPriority && matchesDueToday;
    });
  }, [tasks, searchQuery, myTasksOnly, projectFilter, priorityFilter, dueTodayOnly]);

  const handleMoveTask = (taskId, newColId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: newColId } : t))
    );
    showSuccess(`Task updated!`);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const created = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'New Sprint Task',
      columnId: newTask.columnId || 'todo',
      project: newTask.project || mockProjects[0].title,
      priority: newTask.priority || 'medium',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      label: 'Engineering',
      assignedTo: {
        name: newTask.assignee || mockEmployees[0].name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      },
      commentsCount: 0,
      progress: 0,
    };

    setTasks([...tasks, created]);
    setIsAddModalOpen(false);
    setNewTask({});
    showSuccess('Task added to Sprint Board!');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    setComments([
      ...comments,
      {
        id: `tc-${Date.now()}`,
        author: 'Sanjay Verma (You)',
        time: 'Just now',
        text: newCommentText.trim(),
      },
    ]);
    setNewCommentText('');
    showSuccess('Comment added to task!');
  };

  return (
    <PageTransition>
      <PageHeader
        title="Sprint Task Board"
        subtitle="Manage tickets, engineering tasks, priorities, and code review deliverables."
        breadcrumbs={[{ label: 'Tasks' }]}
        actions={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Task
          </PrimaryButton>
        }
      />

      {/* FILTER BAR WITH REQUIRED CONTROLS */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks by title or project..."
            className="max-w-xs w-full"
          />

          <div className="flex items-center gap-3 flex-wrap">
            {/* My Tasks Filter Button */}
            <button
              type="button"
              onClick={() => setMyTasksOnly(!myTasksOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                myTasksOnly ? 'bg-purple-100 text-brand-primary border-purple-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              My Tasks
            </button>

            {/* Project Filter */}
            <Select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              options={['All', ...mockProjects.map((p) => p.title.split(' ')[0])]}
              className="w-36 py-1 text-xs"
            />

            {/* Priority Filter */}
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={['All', 'Urgent', 'High', 'Medium', 'Low']}
              className="w-32 py-1 text-xs"
            />

            {/* Due Today Filter Toggle */}
            <button
              type="button"
              onClick={() => setDueTodayOnly(!dueTodayOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                dueTodayOnly ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              Due Today
            </button>
          </div>
        </div>
      </Card>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {TASK_COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === col.id);

          return (
            <div key={col.id} className="bg-slate-100/70 rounded-[22px] p-4 border border-slate-200/60 min-h-[500px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-800">{col.title}</h3>
                <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="p-4 bg-white rounded-[18px] border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                        {task.label || 'Task'}
                      </span>
                      <Badge variant={task.priority === 'urgent' ? 'danger' : 'warning'}>
                        {task.priority}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{task.project}</p>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-medium text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" /> {formatDate(task.dueDate)}
                      </span>
                      <img
                        src={task.assignedTo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt="avatar"
                        className="w-5 h-5 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT-SIDE DRAWER FOR TASK DETAILS WITH COMMENTS & TIMELINE */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Task #{selectedTask.id}
                </span>
                <h3 className="text-lg font-bold font-heading text-slate-900 mt-1">{selectedTask.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedTask(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Project:</span>
                  <span className="font-bold text-slate-900">{selectedTask.project}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <Badge variant={selectedTask.priority === 'urgent' ? 'danger' : 'warning'}>{selectedTask.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Due Date:</span>
                  <span className="font-bold text-slate-800">{formatDate(selectedTask.dueDate)}</span>
                </div>
              </div>

              {/* Comments Feed */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Comments</h4>
                <div className="space-y-3 mb-4">
                  {comments.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                      <p className="text-slate-700 mt-1">{c.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <PrimaryButton type="submit" size="sm" icon={Send}>Post</PrimaryButton>
                </form>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Task Timeline</h4>
                <div className="space-y-3 pl-2 border-l-2 border-slate-100">
                  <div className="relative pl-4">
                    <span className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-white" />
                    <p className="font-bold text-slate-800">Task created & assigned</p>
                    <span className="text-[10px] text-slate-400">Mar 15, 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Sprint Task"
        subtitle="Create ticket."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Summary..."
            value={newTask.title || ''}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Select
            label="Project"
            options={mockProjects.map((p) => p.title)}
            value={newTask.project || ''}
            onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" variant="orange">Create Task</PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default TasksKanbanPage;
