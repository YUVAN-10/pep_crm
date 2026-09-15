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
import SearchBar from '../../components/forms/SearchBar';
import { mockInvoices, mockClients, mockProjects } from '../../utils/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import {
  Wallet,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  CreditCard,
  ExternalLink,
  Bell,
  Check,
} from 'lucide-react';

export const FinanceOverviewPage = () => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInv, setNewInv] = useState({});

  const { showSuccess, showInfo } = useNotifications();

  // Summary calculations
  const totalReceived = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === 'Pending').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === 'Overdue').reduce((sum, i) => sum + i.total, 0);
  const totalDueSoon = invoices.filter((i) => i.status === 'Pending' || i.status === 'Upcoming').reduce((sum, i) => sum + i.total, 0);

  const filteredInvoices = invoices.filter(
    (inv) =>
      (filterStatus === 'All' || inv.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMarkPaid = (inv) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              status: 'Paid',
              paidDate: new Date().toISOString().split('T')[0],
            }
          : i
      )
    );
    showSuccess(`Invoice ${inv.invoiceNumber} marked as Paid!`);
  };

  const handleSendReminder = (inv) => {
    showSuccess(`Payment reminder sent to ${inv.client} for invoice ${inv.invoiceNumber}!`);
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const created = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-0${Math.floor(100 + Math.random() * 900)}`,
      client: newInv.client || 'Apex Health Logistics',
      project: newInv.project || 'Mobile App Milestone Build',
      amount: Number(newInv.amount) || 400000,
      tax: Number(newInv.amount) * 0.18 || 72000,
      total: (Number(newInv.amount) || 400000) * 1.18,
      status: 'Pending',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newInv.dueDate || '2026-04-15',
      paidDate: null,
      paymentMethod: 'Zoho Invoice NEFT',
    };

    setInvoices([created, ...invoices]);
    setIsAddModalOpen(false);
    setNewInv({});
    showSuccess(`Invoice ${created.invoiceNumber} issued!`);
  };

  return (
    <PageTransition>
      <PageHeader
        title="Payments & Revenue Tracking"
        subtitle="Track payment milestones, client invoices, received amounts, overdue receivables, and Zoho billing."
        breadcrumbs={[{ label: 'Payments' }]}
        actions={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Create Invoice
          </PrimaryButton>
        }
      />

      {/* 4 FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="!p-5 bg-gradient-to-br from-emerald-50/70 to-white border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Received Amount
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-2">{formatCurrency(totalReceived)}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Cleared in bank account</span>
        </Card>

        <Card className="!p-5 bg-gradient-to-br from-blue-50/70 to-white border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Pending Amount
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-2">{formatCurrency(totalPending)}</p>
          <span className="text-[11px] text-blue-700 font-medium">Awaiting payment processing</span>
        </Card>

        <Card className="!p-5 bg-gradient-to-br from-rose-50/70 to-white border-rose-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Overdue Amount
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-2">{formatCurrency(totalOverdue)}</p>
          <span className="text-[11px] text-rose-700 font-medium">Overdue client receivables</span>
        </Card>

        <Card className="!p-5 bg-gradient-to-br from-amber-50/70 to-white border-amber-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Due Soon Amount
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-slate-900 mt-2">{formatCurrency(totalDueSoon)}</p>
          <span className="text-[11px] text-amber-700 font-medium">Milestones due in next 14 days</span>
        </Card>
      </div>

      {/* PROJECT PAYMENT MILESTONE TIMELINE */}
      <Card className="mb-6">
        <h3 className="text-base font-bold font-heading text-slate-900 mb-4">Project Milestone Payment Timelines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { stage: 'Advance Payment', status: 'Paid', amount: '25% (₹7,00,000)', date: 'Nov 2025' },
            { stage: 'UI Approval', status: 'Paid', amount: '25% (₹7,00,000)', date: 'Dec 2025' },
            { stage: 'Beta Release', status: 'Pending', amount: '25% (₹7,00,000)', date: 'Mar 2026' },
            { stage: 'Final Delivery', status: 'Upcoming', amount: '25% (₹7,00,000)', date: 'Apr 2026' },
          ].map((milestone, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-800">{milestone.stage}</span>
                <Badge variant={milestone.status === 'Paid' ? 'success' : 'warning'}>{milestone.status}</Badge>
              </div>
              <p className="text-xs font-bold text-brand-primary">{milestone.amount}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Due: {milestone.date}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* INVOICE TABLE WITH ACTION BUTTONS */}
      <Card className="mb-6 !p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search payments by client or invoice..." className="max-w-md w-full" />
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={['All', 'Paid', 'Pending', 'Overdue']}
            className="w-40 py-1.5 text-xs"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-bold text-slate-500">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Client & Project</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-brand-primary font-mono">{inv.invoiceNumber}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{inv.client}</span>
                    <span className="text-[11px] text-slate-400">{inv.project}</span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">{formatCurrency(inv.total)}</td>
                  <td className="p-3 text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="p-3">
                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Overdue' ? 'danger' : 'warning'}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Mark Paid Button */}
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => handleMarkPaid(inv)}
                          className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark Paid
                        </button>
                      )}

                      {/* Payment Reminder Button */}
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => handleSendReminder(inv)}
                          className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1"
                        >
                          <Bell className="w-3 h-3" /> Payment Reminder
                        </button>
                      )}

                      {/* Open Zoho Invoice Link */}
                      <a
                        href="https://invoice.zoho.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-purple-50 text-brand-primary font-semibold text-[11px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Zoho Invoice
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Issue Milestone Invoice"
        subtitle="Generate milestone billing entry."
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Select
            label="Client Account"
            options={mockClients.map((c) => c.company)}
            value={newInv.client || ''}
            onChange={(e) => setNewInv({ ...newInv, client: e.target.value })}
            required
          />
          <Input
            label="Project Milestone"
            placeholder="e.g. Beta Release Milestone"
            value={newInv.project || ''}
            onChange={(e) => setNewInv({ ...newInv, project: e.target.value })}
            required
          />
          <Input
            label="Amount (₹)"
            type="number"
            placeholder="400000"
            value={newInv.amount || ''}
            onChange={(e) => setNewInv({ ...newInv, amount: e.target.value })}
            required
          />
          <Input
            label="Due Date"
            type="date"
            value={newInv.dueDate || ''}
            onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" variant="orange">Issue Invoice</PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default FinanceOverviewPage;
