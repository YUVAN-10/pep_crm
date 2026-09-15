import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../cards/Card';
import Badge from './Badge';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import {
  FlaskConical,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Bell,
  Clock,
  DollarSign,
  Briefcase,
} from 'lucide-react';

export const TestingToolsPanel = () => {
  const {
    isTestingMode,
    setIsTestingMode,
    qaChecklist,
    simulateFullWorkflow,
    seedDemoData,
    resetCRMData,
    addFollowup,
    addPayment,
    completeProject,
    projects,
  } = useCRM();

  const { clearNotifications, showSuccess } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('actions'); // 'actions' | 'checklist'

  if (!isTestingMode) return null;

  const totalChecklist = Object.keys(qaChecklist).length;
  const passedChecklist = Object.values(qaChecklist).filter(Boolean).length;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Modal/Panel */}
      {isOpen && (
        <Card className="w-80 sm:w-96 shadow-2xl border-purple-200 bg-white/95 backdrop-blur-md mb-3 p-4 rounded-[22px] animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 text-brand-primary">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-heading text-slate-900">Manual QA Testing Tools</h4>
                <p className="text-[11px] text-slate-400">In-memory CRM Workflow Simulator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switch & Tabs */}
          <div className="flex items-center justify-between my-3 p-2 bg-slate-50 rounded-xl">
            <span className="text-xs font-semibold text-slate-700">Testing Mode:</span>
            <button
              type="button"
              onClick={() => setIsTestingMode(!isTestingMode)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300"
            >
              ACTIVE (No Firebase)
            </button>
          </div>

          <div className="flex items-center gap-1 mb-3 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('actions')}
              className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'actions'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Quick Test Actions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checklist')}
              className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1 ${
                activeTab === 'checklist'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              QA Checklist ({passedChecklist}/{totalChecklist})
            </button>
          </div>

          {/* TAB 1: ACTIONS */}
          {activeTab === 'actions' && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => {
                  simulateFullWorkflow();
                  showSuccess('Full 12-Step ABC Hospital Workflow simulated successfully!');
                }}
                className="w-full flex items-center gap-2 p-2.5 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all shadow-sm"
              >
                <Zap className="w-4 h-4 text-brand-accent fill-brand-accent" />
                <span>Run 12-Step ABC Hospital Workflow</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={seedDemoData}
                  className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Seed Demo Data</span>
                </button>
                <button
                  type="button"
                  onClick={resetCRMData}
                  className="flex items-center justify-center gap-1.5 p-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset CRM Data</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trigger Events</p>
                <button
                  type="button"
                  onClick={() => {
                    addFollowup({
                      leadId: 'lead-overdue',
                      clientName: 'NextGen Digital Solutions',
                      title: 'Overdue Strategy Call',
                      date: '2026-03-10',
                      time: '10:00 AM',
                      status: 'Overdue',
                    });
                    showSuccess('Generated Overdue Follow-up alert!');
                  }}
                  className="w-full text-left p-2 text-xs font-medium rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Generate Overdue Follow-up
                  </span>
                  <Badge variant="amber" size="sm">Alert</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addPayment({ client: 'CloudScale Enterprise', amount: 850000 });
                    showSuccess('Generated Pending Payment invoice!');
                  }}
                  className="w-full text-left p-2 text-xs font-medium rounded-lg bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-rose-600" /> Generate Pending Payment
                  </span>
                  <Badge variant="rose" size="sm">Billing</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (projects.length > 0) completeProject(projects[0].id);
                    showSuccess('Marked Project Completed!');
                  }}
                  className="w-full text-left p-2 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Generate Completed Project
                  </span>
                  <Badge variant="emerald" size="sm">Success</Badge>
                </button>
              </div>

              <button
                type="button"
                onClick={clearNotifications}
                className="w-full mt-2 text-center text-xs text-slate-500 hover:text-slate-800 py-1 font-medium"
              >
                Clear Notifications Center
              </button>
            </div>
          )}

          {/* TAB 2: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {Object.entries(qaChecklist).map(([moduleName, isPassed]) => (
                <div
                  key={moduleName}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-semibold text-slate-700">{moduleName}</span>
                  {isPassed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                      PENDING
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-brand-primary text-white font-bold text-xs shadow-xl hover:bg-brand-primaryHover transition-all border-2 border-brand-accent/60 group"
      >
        <FlaskConical className="w-4 h-4 text-brand-accent group-hover:rotate-12 transition-transform" />
        <span>QA Testing Tools</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>
    </div>
  );
};

export default TestingToolsPanel;
