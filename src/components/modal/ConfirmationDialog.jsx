import React from 'react';
import Modal from './Modal';
import PrimaryButton from '../buttons/PrimaryButton';
import OutlineButton from '../buttons/OutlineButton';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const ConfirmationDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  loading = false,
}) => {
  const iconMap = {
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    danger: <AlertTriangle className="w-6 h-6 text-rose-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
  };

  const bgMap = {
    warning: 'bg-amber-50 border-amber-100',
    danger: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
    success: 'bg-emerald-50 border-emerald-100',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <OutlineButton onClick={onClose} disabled={loading}>
            {cancelText}
          </OutlineButton>
          <PrimaryButton
            onClick={onConfirm}
            loading={loading}
            variant={type === 'danger' ? 'dark' : 'orange'}
            className={type === 'danger' ? '!bg-rose-600 hover:!bg-rose-700 !shadow-none' : ''}
          >
            {confirmText}
          </PrimaryButton>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl border shrink-0 ${bgMap[type]}`}>
          {iconMap[type]}
        </div>
        <div className="space-y-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
