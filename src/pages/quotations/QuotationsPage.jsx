import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/common/PageTransition';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/cards/Card';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';
import SearchBar from '../../components/forms/SearchBar';
import Modal from '../../components/modal/Modal';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import { useNotifications } from '../../context/NotificationContext';
import { useCRM } from '../../context/CRMContext';
import { QUOTATION_STATUSES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import {
  Plus,
  ExternalLink,
  FileCheck,
  CheckCircle2,
  XCircle,
  Edit,
  Eye,
  FolderKanban,
  FileText,
  Clock,
  AlertCircle,
} from 'lucide-react';

const mockQuotations = [
  {
    id: 'quote-1',
    quotationNumber: 'QT-2026-041',
    customer: 'NexGen Digital Solutions',
    opportunity: 'NexGen B2B Distributor Commerce Suite',
    amount: 1850000,
    quotationDate: '2026-02-10',
    sentDate: '2026-02-12',
    validUntil: '2026-03-31',
    status: 'Accepted',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-041',
    notes: 'Quotation accepted after volume discount approval.',
  },
  {
    id: 'quote-2',
    quotationNumber: 'QT-2026-044',
    customer: 'QuickBite FoodTech Network',
    opportunity: 'QuickBite Rider App Revamp',
    amount: 850000,
    quotationDate: '2026-02-28',
    sentDate: '2026-03-01',
    validUntil: '2026-04-15',
    status: 'Sent',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-044',
    notes: 'Awaiting client board review.',
  },
  {
    id: 'quote-3',
    quotationNumber: 'QT-2026-045',
    customer: 'Apex Health Logistics',
    opportunity: 'Apex Cold-Chain Mobile App',
    amount: 1200000,
    quotationDate: '2026-01-15',
    sentDate: '2026-01-16',
    validUntil: '2026-02-15',
    status: 'Expired',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-045',
    notes: 'Expired proposal.',
  },
  {
    id: 'quote-4',
    quotationNumber: 'QT-2026-046',
    customer: 'CloudScale Enterprise',
    opportunity: 'Cloud Management Dashboard',
    amount: 1400000,
    quotationDate: '2026-03-10',
    sentDate: '2026-03-10',
    validUntil: '2026-04-10',
    status: 'Draft',
    zohoInvoiceUrl: 'https://books.zoho.com/app/invoices/quote-046',
    notes: 'Draft quotation under internal review.',
  },
];

export const QuotationsPage = () => {
  const crm = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const activeQuotes = crm?.quotations || mockQuotations;

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [editQuoteModal, setEditQuoteModal] = useState(null);
  const [formData, setFormData] = useState({});

  const { showSuccess, showInfo } = useNotifications();
  const navigate = useNavigate();

  // Counts for KPI Cards
  const kpis = {
    draft: activeQuotes.filter((q) => q.status === 'Draft').length,
    sent: activeQuotes.filter((q) => q.status === 'Sent').length,
    accepted: activeQuotes.filter((q) => q.status === 'Accepted').length,
    expired: activeQuotes.filter((q) => q.status === 'Expired').length,
  };

  const filteredQuotes = activeQuotes.filter(
    (q) =>
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAccepted = (quote) => {
    if (crm?.acceptQuotation) {
      crm.acceptQuotation(quote.id);
    }
    showSuccess(`Quotation ${quote.quotationNumber} marked as Accepted! Automatically converting to Project...`);
    setTimeout(() => {
      if (crm?.convertOppToProject) {
        crm.convertOppToProject(quote.customer, quote.amount);
      }
      navigate('/projects');
    }, 800);
  };

  const handleMarkRejected = (quote) => {
    showInfo(`Quotation ${quote.quotationNumber} marked as Rejected.`);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (crm?.addQuotation) {
      crm.addQuotation(formData);
    }
    setIsAddModalOpen(false);
    setFormData({});
    showSuccess('Quotation saved successfully!');
  };

  return (
    <PageTransition>
      <PageHeader
        title="Quotation Tracking"
        subtitle="Track formal client quotations, validity windows, and Zoho Invoice integrations."
        breadcrumbs={[{ label: 'Quotations' }]}
        action={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Create Quotation
          </PrimaryButton>
        }
      />

      {/* KPI CARDS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-slate-400">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft</p>
            <h3 className="text-xl font-bold font-heading text-slate-800 mt-1">{kpis.draft}</h3>
          </div>
          <FileText className="w-6 h-6 text-slate-400" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sent</p>
            <h3 className="text-xl font-bold font-heading text-blue-700 mt-1">{kpis.sent}</h3>
          </div>
          <Clock className="w-6 h-6 text-blue-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted</p>
            <h3 className="text-xl font-bold font-heading text-emerald-700 mt-1">{kpis.accepted}</h3>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </Card>

        <Card className="p-4 flex items-center justify-between border-l-4 border-l-rose-500">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expired</p>
            <h3 className="text-xl font-bold font-heading text-rose-700 mt-1">{kpis.expired}</h3>
          </div>
          <AlertCircle className="w-6 h-6 text-rose-500" />
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="w-full sm:w-80">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search quotations..." />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Quotation #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Opportunity Scope</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Valid Until</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
              {filteredQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono font-bold text-slate-900">{q.quotationNumber}</td>
                  <td className="p-4 font-bold text-slate-800">{q.customer}</td>
                  <td className="p-4">{q.opportunity}</td>
                  <td className="p-4 font-bold text-emerald-600">{formatCurrency(q.amount)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        q.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : q.status === 'Sent'
                          ? 'bg-blue-100 text-blue-700'
                          : q.status === 'Expired'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="p-4">{q.validUntil}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(q)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="View Quotation"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Open Zoho Invoice */}
                      <a
                        href={q.zohoInvoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                        title="Open Zoho Invoice"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditQuoteModal(q)}
                        className="p-1.5 rounded-lg bg-purple-50 text-brand-primary hover:bg-purple-100"
                        title="Edit Quotation"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      {/* Mark Accepted / Rejected */}
                      {q.status !== 'Accepted' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkAccepted(q)}
                            className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold"
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkRejected(q)}
                            className="px-2 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {/* WHEN ACCEPTED: CONVERT TO PROJECT BUTTON */}
                      {q.status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (crm?.convertOppToProject) {
                              crm.convertOppToProject(q.customer, q.amount);
                            }
                            showSuccess(`Quotation for ${q.customer} converted to active Project!`);
                            navigate('/projects');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-brand-primary text-white text-[11px] font-bold flex items-center gap-1 hover:bg-purple-900 transition-colors"
                        >
                          <FolderKanban className="w-3.5 h-3.5" /> Convert to Project
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Quotation Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Quotation"
        subtitle="Generate proposal entry with Zoho Invoice link."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g. Acme Corp"
            value={formData.customer || ''}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            required
          />
          <Input
            label="Opportunity Scope"
            placeholder="e.g. B2B Ecommerce Suite"
            value={formData.opportunity || ''}
            onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="1500000"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Select
              label="Status"
              options={['Draft', 'Sent', 'Accepted', 'Expired']}
              value={formData.status || 'Draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            />
          </div>
          <Input
            label="Zoho Invoice URL"
            placeholder="https://books.zoho.com/app/invoices/quote-xxx"
            value={formData.zohoInvoiceUrl || ''}
            onChange={(e) => setFormData({ ...formData, zohoInvoiceUrl: e.target.value })}
          />
          <Input
            label="Valid Until Date"
            type="date"
            value={formData.validUntil || ''}
            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" variant="orange">Save Quotation</PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default QuotationsPage;
