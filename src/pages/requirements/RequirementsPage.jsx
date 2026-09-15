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
import { REQUIREMENT_STATUSES, PROJECT_TYPES } from '../../utils/constants';
import {
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  ExternalLink,
  Edit,
  FileCheck,
  X,
  Building2,
  Globe,
  Server,
  Users,
} from 'lucide-react';

const mockRequirements = [
  {
    id: 'req-1',
    customer: 'NexGen Digital Solutions',
    projectType: 'E-commerce',
    businessRequirement: 'B2B Distributor Commerce Portal with bulk e-invoicing and GST calculation.',
    modules: 'Catalog, Cart, GST Engine, Credit Line Tracker, Order Dispatcher',
    userTypes: 'Super Admin, Distributor, Retailer, Finance Clerk',
    integrations: 'Razorpay, ICICI Bank Webhook, Tally ERP API',
    hosting: 'AWS EC2 + Cloudflare CDN',
    domain: 'b2b.nexgendigital.io',
    timeline: '3 Months',
    referenceLinks: 'https://figma.com/file/sample-nexgen-b2b',
    notes: 'Must support mobile viewport for distributors in field.',
    status: 'Ready for Quotation',
  },
  {
    id: 'req-2',
    customer: 'Apex Health Logistics',
    projectType: 'Mobile App',
    businessRequirement: 'Cold-chain BLE temperature monitoring driver mobile app on iOS/Android.',
    modules: 'BLE Scanner, Background GPS, Offline SQLite Sync, Alert Push Notification',
    userTypes: 'Truck Driver, Logistics Manager, Warehouse Operator',
    integrations: 'Firebase Cloud Messaging, AWS IoT Core',
    hosting: 'Firebase Hosting + Google Cloud Functions',
    domain: 'app.apexhealthlog.in',
    timeline: '2.5 Months',
    referenceLinks: 'https://github.com/apex-sensor-spec',
    notes: 'BLE sensor polling frequency every 30 seconds.',
    status: 'Confirmed',
  },
];

export const RequirementsPage = () => {
  const crm = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [reqs, setReqs] = useState(crm?.requirements?.length > 0 ? crm.requirements : mockRequirements);

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null); // Right-side drawer
  const [editReqModal, setEditReqModal] = useState(null);
  const [createQuotationModal, setCreateQuotationModal] = useState(null);

  const [formData, setFormData] = useState({});
  const { showSuccess } = useNotifications();
  const navigate = useNavigate();

  const filteredReqs = (crm?.requirements || reqs).filter(
    (r) =>
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.businessRequirement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (crm?.addRequirement) {
      crm.addRequirement(formData);
    }
    setIsAddModalOpen(false);
    setFormData({});
    showSuccess('Requirement documented!');
  };

  const handleMarkConfirmed = (req) => {
    setReqs((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Confirmed' } : r))
    );
    showSuccess(`Requirement for ${req.customer} marked as Confirmed!`);
  };

  const handleMarkReadyForQuotation = (req) => {
    if (crm?.markRequirementReady) {
      crm.markRequirementReady(req.id);
    }
    showSuccess(`Requirement for ${req.customer} is Ready for Quotation!`);
    setCreateQuotationModal(req);
  };

  return (
    <PageTransition>
      <PageHeader
        title="Requirement Gathering"
        subtitle="Collect scope, modules, APIs, user roles, hosting details, and timeline before quotation."
        breadcrumbs={[{ label: 'Requirements' }]}
        action={
          <PrimaryButton variant="orange" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Requirement
          </PrimaryButton>
        }
      />

      <div className="flex items-center justify-between mb-6">
        <div className="w-full sm:w-80">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search requirements..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReqs.map((req) => (
          <Card key={req.id} className="flex flex-col justify-between border-slate-200 hover:border-purple-200 transition-all">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {req.projectType}
                  </span>
                  <h3 className="text-base font-bold font-heading text-slate-900 mt-1">{req.customer}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {req.status}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <strong className="text-slate-800 font-semibold block mb-0.5">Business Scope:</strong>
                  <p className="leading-relaxed text-slate-600">{req.businessRequirement}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-[14px] border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Core Modules</span>
                    <p className="font-semibold text-slate-800 truncate">{req.modules}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Integrations</span>
                    <p className="font-semibold text-slate-800 truncate">{req.integrations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON ACTION BAR ON EVERY CARD */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReq(req)}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-brand-primary text-xs font-semibold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Details
                </button>
                <button
                  type="button"
                  onClick={() => setEditReqModal(req)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="flex items-center gap-2">
                {req.status !== 'Confirmed' && req.status !== 'Ready for Quotation' && (
                  <button
                    type="button"
                    onClick={() => handleMarkConfirmed(req)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold"
                  >
                    Mark Confirmed
                  </button>
                )}
                {req.status !== 'Ready for Quotation' ? (
                  <button
                    type="button"
                    onClick={() => handleMarkReadyForQuotation(req)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Ready for Quotation
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCreateQuotationModal(req)}
                    className="px-2.5 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold flex items-center gap-1"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Create Quotation
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* RIGHT-SIDE DRAWER: REQUIREMENT DETAILS & EDITABLE SECTIONS */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  Requirement Spec
                </span>
                <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">{selectedReq.customer}</h3>
              </div>
              <button type="button" onClick={() => setSelectedReq(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-1">Business Requirement</h4>
                <p className="text-slate-600 leading-relaxed">{selectedReq.businessRequirement}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="font-bold text-slate-800">Modules</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.modules}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                  <span className="font-bold text-slate-800">User Types</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.userTypes}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Integrations / APIs</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.integrations}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Hosting & Stack</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.hosting}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Target Domain</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.domain}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800">Target Timeline</span>
                  <p className="text-slate-600 mt-0.5">{selectedReq.timeline}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 flex justify-between">
              <SecondaryButton onClick={() => setEditReqModal(selectedReq)}>Edit Scope</SecondaryButton>
              <PrimaryButton
                variant="orange"
                onClick={() => {
                  handleMarkReadyForQuotation(selectedReq);
                  setSelectedReq(null);
                }}
              >
                Mark Ready for Quotation
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUOTATION ACTION MODAL */}
      {createQuotationModal && (
        <Modal
          isOpen={!!createQuotationModal}
          onClose={() => setCreateQuotationModal(null)}
          title="Create Quotation from Scope"
          subtitle={`Generate pricing quotation for ${createQuotationModal.customer}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const amount = Number(formData.amount) || 1500000;
              const qNumber = formData.quotationNumber || `QT-2026-${Math.floor(100 + Math.random() * 900)}`;
              if (crm?.addQuotation) {
                crm.addQuotation({
                  customer: createQuotationModal.customer,
                  opportunity: formData.opportunity || `${createQuotationModal.customer} - ${createQuotationModal.projectType}`,
                  amount: amount,
                  quotationNumber: qNumber,
                  validUntil: formData.validUntil || '2026-04-15',
                });
              }
              showSuccess(`Quotation ${qNumber} generated for ${createQuotationModal.customer}!`);
              setCreateQuotationModal(null);
              setFormData({});
              navigate('/quotations');
            }}
            className="space-y-4"
          >
            <Input label="Customer Company" value={createQuotationModal.customer} disabled />
            <Input
              label="Quotation / Opportunity Scope"
              defaultValue={`${createQuotationModal.customer} - ${createQuotationModal.projectType}`}
              onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
            />
            <Input
              label="Total Quoted Amount (₹)"
              type="number"
              defaultValue="1500000"
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
            <Input
              label="Valid Until Date"
              type="date"
              defaultValue="2026-04-15"
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-3">
              <SecondaryButton type="button" onClick={() => setCreateQuotationModal(null)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" variant="orange">
                Save & Open Quotations
              </PrimaryButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Collect / Add Requirement Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Requirement Scope"
        subtitle="Document client specifications."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            placeholder="e.g. Acme Corp"
            value={formData.customer || ''}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            required
          />
          <Select
            label="Project Type"
            options={PROJECT_TYPES}
            value={formData.projectType || PROJECT_TYPES[0]}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
          />
          <TextArea
            label="Business Requirement Scope"
            placeholder="Scope description..."
            value={formData.businessRequirement || ''}
            onChange={(e) => setFormData({ ...formData, businessRequirement: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-3">
            <SecondaryButton onClick={() => setIsAddModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton type="submit" variant="orange">Save Scope</PrimaryButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};

export default RequirementsPage;
