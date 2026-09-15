import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export const WORKFLOW_STAGES = [
  { id: 'lead_created', label: 'Lead Created' },
  { id: 'followup_scheduled', label: 'Follow-up Scheduled' },
  { id: 'followup_completed', label: 'Follow-up Completed' },
  { id: 'opportunity_created', label: 'Opportunity Created' },
  { id: 'requirement_added', label: 'Requirement Added' },
  { id: 'ready_for_quotation', label: 'Ready for Quotation' },
  { id: 'quotation_sent', label: 'Quotation Sent' },
  { id: 'quotation_accepted', label: 'Quotation Accepted' },
  { id: 'customer_created', label: 'Customer Created' },
  { id: 'project_created', label: 'Project Created' },
  { id: 'tasks_added', label: 'Tasks Added' },
  { id: 'payments_completed', label: 'Payments Completed' },
  { id: 'project_completed', label: 'Project Completed' },
];

export const WorkflowTracker = ({ currentStageId = 'project_created' }) => {
  const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === currentStageId);
  const activeIdx = currentIndex >= 0 ? currentIndex : 9; // default to project_created if unknown

  return (
    <div className="w-full bg-white p-4 rounded-[22px] border border-slate-200/80 shadow-2xs overflow-x-auto select-none">
      <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-slate-400 min-w-[1080px] mb-3">
        <span className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          End-to-End Business Workflow Tracker
        </span>
        <span className="text-brand-primary font-bold">
          Stage {activeIdx + 1} of {WORKFLOW_STAGES.length}: {WORKFLOW_STAGES[activeIdx]?.label}
        </span>
      </div>

      <div className="flex items-center justify-between min-w-[1080px] relative py-2">
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <React.Fragment key={stage.id}>
              {/* Step Circle Node */}
              <div className="flex flex-col items-center gap-1.5 relative z-10 group cursor-pointer">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-brand-primary text-white ring-4 ring-purple-300 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <Circle className="w-3.5 h-3.5" />
                  )}
                </motion.div>

                {/* Stage Label */}
                <span
                  className={`text-[9.5px] font-bold text-center leading-tight max-w-[72px] ${
                    isCurrent
                      ? 'text-brand-primary font-heading'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {idx < WORKFLOW_STAGES.length - 1 && (
                <div className="flex-1 h-1 bg-slate-100 mx-1 rounded-full overflow-hidden relative top-[-9px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: idx < activeIdx ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowTracker;

