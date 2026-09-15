import React from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import {
  UsersRound,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
  FileCheck,
  FolderKanban,
  CheckSquare,
  CreditCard,
  Award,
  Plus,
} from 'lucide-react';

export const ActivityTimeline = ({ activities: propActivities }) => {
  const crm = useCRM();
  const liveActivities = crm?.activities?.map((a) => ({
    id: a.id,
    user: a.user || 'Team Member',
    role: 'PEP Software Team',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    title: `${a.action.toUpperCase()} — ${a.target}`,
    description: `Workflow action "${a.action}" recorded for target ${a.target}.`,
    timestamp: a.time,
    icon: FolderKanban,
    color: 'text-purple-600 bg-purple-100',
  })) || [];

  const displayList = propActivities || liveActivities;
  return (
    <div className="w-full space-y-4">
      {displayList.map((act, index) => {
        const IconComponent = act.icon || Clock;

        return (
          <motion.div
            key={act.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-start gap-3.5 relative"
          >
            {/* Connecting vertical timeline line */}
            {index !== activities.length - 1 && (
              <span className="absolute left-4 top-9 bottom-0 w-[2px] bg-slate-100" />
            )}

            {/* Event Icon Badge */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                act.color || 'bg-purple-100 text-brand-primary'
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Event Card Content */}
            <div className="flex-1 bg-white p-4 rounded-[18px] border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <img
                    src={act.avatar}
                    alt={act.user}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="text-xs font-bold text-slate-900">{act.user}</span>
                  <span className="text-[10px] text-slate-400 font-medium">({act.role || 'Team Member'})</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                  {act.timestamp}
                </span>
              </div>

              <h4 className="text-xs font-bold text-brand-primary mt-1">{act.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{act.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
