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

      {/* 4 ENHANCED FINANCIAL KPI CARDS WITH DISTINCT BORDERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Received Amount Card */}
        <Card className="!p-5 bg-gradient-to-br from-emerald-50/60 via-emerald-50/20 to-white border-2 border-emerald-300/90 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              RECEIVED AMOUNT
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-heading text-slate-900 mt-2.5 tracking-tight">
            {formatCurrency(totalReceived)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Cleared in bank account</span>
        </Card>

        {/* Pending Amount Card */}
        <Card className="!p-5 bg-gradient-to-br from-blue-50/60 via-blue-50/20 to-white border-2 border-blue-300/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              PENDING AMOUNT
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-heading text-slate-900 mt-2.5 tracking-tight">
            {formatCurrency(totalPending)}
          </p>
          <span className="text-[11px] text-blue-700 font-semibold mt-1 block">Awaiting payment processing</span>
        </Card>

        {/* Overdue Amount Card */}
        <Card className="!p-5 bg-gradient-to-br from-rose-50/60 via-rose-50/20 to-white border-2 border-rose-300/90 shadow-2xs hover:shadow-md hover:border-rose-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              OVERDUE AMOUNT
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-heading text-slate-900 mt-2.5 tracking-tight">
            {formatCurrency(totalOverdue)}
          </p>
          <span className="text-[11px] text-rose-700 font-semibold mt-1 block">Overdue client receivables</span>
        </Card>

        {/* Due Soon Amount Card */}
        <Card className="!p-5 bg-gradient-to-br from-amber-50/60 via-amber-50/20 to-white border-2 border-amber-300/90 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              DUE SOON AMOUNT
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold font-heading text-slate-900 mt-2.5 tracking-tight">
            {formatCurrency(totalDueSoon)}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Milestones due in next 14 days</span>
        </Card>
      </div>

      {/* INVOICE TABLE WITH ACTION BUTTONS */}
      <Card className="mb-6 !p-5 border border-slate-200/90">
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
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
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
                          className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                        >
                          <Check className="w-3 h-3" /> Mark Paid
                        </button>
                      )}

                      {/* Payment Reminder Button */}
                      {inv.status !== 'Paid' && (
                        <button
                          type="button"
                          onClick={() => handleSendReminder(inv)}
                          className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-200 transition-colors"
                        >
                          <Bell className="w-3 h-3" /> Payment Reminder
                        </button>
                      )}

                      {/* Open Zoho Invoice Link */}
                      <a
                        href="https://invoice.zoho.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-purple-50 text-brand-primary font-semibold text-[11px] flex items-center gap-1 hover:bg-purple-100 transition-colors"
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

