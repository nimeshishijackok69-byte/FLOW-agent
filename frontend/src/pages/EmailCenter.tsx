import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User } from '../lib/auth';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import {
  Mail, Settings, Send, Clock, FileText, Plus, Edit2, Trash2, RefreshCw, Eye,
  CheckCircle, XCircle, AlertTriangle, Copy, Download, Filter, Zap, Bell, Server,
  ChevronRight, ExternalLink, RotateCcw, Search
} from 'lucide-react';
import { motion } from 'framer-motion';

type Tab = 'smtp' | 'templates' | 'send' | 'reminders' | 'logs';

const VARIABLES = [
  '{{user_name}}', '{{teacher_name}}', '{{reviewer_name}}', '{{otp}}',
  '{{form_title}}', '{{form_link}}', '{{school_code}}', '{{deadline}}',
  '{{submitted_at}}', '{{email}}', '{{login_link}}', '{{level_name}}',
  '{{submission_count}}', '{{pending_count}}'
];

export default function EmailCenter({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('smtp');

  const tabs: { id: Tab; label: string; icon: any; desc: string }[] = [
    { id: 'smtp', label: 'SMTP Config', icon: Server, desc: 'Server settings' },
    { id: 'templates', label: 'Templates', icon: FileText, desc: '8 built-in' },
    { id: 'send', label: 'Send Email', icon: Send, desc: 'Compose & send' },
    { id: 'reminders', label: 'Reminders', icon: Clock, desc: 'Auto schedules' },
    { id: 'logs', label: 'Delivery Logs', icon: Mail, desc: 'Track emails' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold font-heading">Email Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure SMTP, manage templates, send emails, and track delivery</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[44px] ${
              tab === t.id ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'
            }`}>
            <t.icon size={15} className={tab === t.id ? 'text-primary' : ''} />
            <span>{t.label}</span>
            <span className="hidden sm:inline text-[9px] text-slate-500 dark:text-slate-400 font-normal">{t.desc}</span>
          </button>
        ))}
      </div>

      {tab === 'smtp' && <SmtpTab />}
      {tab === 'templates' && <TemplatesTab />}
      {tab === 'send' && <SendTab />}
      {tab === 'reminders' && <RemindersTab />}
      {tab === 'logs' && <LogsTab />}
    </div>
  );
}

/* ═══════════════════ TAB 1: SMTP CONFIG ═══════════════════ */
function SmtpTab() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', host: 'smtp.gmail.com', port: 587, encryption: 'starttls', username: '', password: '', from_email: 'noreply@cbss.school.org', from_name: 'CBSS Data Collection', is_active: true });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => { api.get('/smtp-config').then(setConfigs).catch(console.error).finally(() => setLoading(false)); }, []);

  const testConnection = async () => {
    setTesting(true); setTestResult(null);
    try {
      const res = await api.post('/smtp-config', { action: 'test', host: form.host, port: form.port });
      setTestResult(res);
    } catch (err: any) { setTestResult({ success: false, message: err.message }); }
    finally { setTesting(false); }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      if (editId) { await api.put('/smtp-config', { id: editId, ...form }); }
      else { await api.post('/smtp-config', form); }
      const data = await api.get('/smtp-config');
      setConfigs(data);
      setEditId(null);
      setForm({ name: '', host: 'smtp.gmail.com', port: 587, encryption: 'starttls', username: '', password: '', from_email: 'noreply@cbss.school.org', from_name: 'CBSS Data Collection', is_active: true });
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const loadEdit = (c: any) => {
    setEditId(c.id);
    setForm({ name: c.name || '', host: c.host, port: c.port, encryption: c.encryption, username: c.username, password: c.password || '', from_email: c.from_email, from_name: c.from_name, is_active: c.is_active });
  };

  return (
    <div className="space-y-6">
      {/* Existing configs */}
      {configs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs.map(c => (
            <div key={c.id} className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-sm ${c.is_active ? 'border-accent-green' : 'border-slate-200 dark:border-slate-700'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{c.name || c.host}</h3>
                <div className="flex items-center gap-2">
                  {c.is_active && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">ACTIVE</span>}
                  {c.is_verified && <CheckCircle size={14} className="text-emerald-500" />}
                  <button onClick={() => loadEdit(c)} className="p-1 rounded hover:bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary"><Edit2 size={13} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500 dark:text-slate-400">Host:</span> <span className="font-medium">{c.host}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400">Port:</span> <span className="font-medium">{c.port}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400">From:</span> <span className="font-medium">{c.from_email}</span></div>
                <div><span className="text-slate-500 dark:text-slate-400">Encryption:</span> <span className="font-medium uppercase">{c.encryption}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Config form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2"><Server size={16} className="text-primary" /> {editId ? 'Edit' : 'Add'} SMTP Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Config Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none focus:border-primary" placeholder="Primary SMTP" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">SMTP Host</label>
            <input value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none focus:border-primary" placeholder="smtp.gmail.com" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Port</label>
            <input type="number" value={form.port} onChange={e => setForm(p => ({ ...p, port: parseInt(e.target.value) || 587 }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Encryption</label>
            <select value={form.encryption} onChange={e => setForm(p => ({ ...p, encryption: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none">
              <option value="starttls">STARTTLS (Port 587)</option><option value="ssl">TLS/SSL (Port 465)</option><option value="none">None</option></select></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Username</label>
            <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" placeholder="email@domain.com" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Password / App Key</label>
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" placeholder="App password or API key" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">From Email</label>
            <input value={form.from_email} onChange={e => setForm(p => ({ ...p, from_email: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" placeholder="noreply@cbss.school.org" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">From Name</label>
            <input value={form.from_name} onChange={e => setForm(p => ({ ...p, from_name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" placeholder="CBSS Data Collection" /></div>
        </div>

        {testResult && (
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-2 text-sm font-medium ${testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
            {testResult.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {testResult.message}
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button onClick={testConnection} disabled={testing} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-white dark:bg-slate-800 flex items-center gap-2 min-h-[44px] disabled:opacity-50">
            {testing ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />} Test Connection
          </button>
          <button onClick={saveConfig} disabled={saving} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover flex items-center gap-2 min-h-[44px] disabled:opacity-50">
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />} {editId ? 'Update' : 'Save'} Config
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ name: '', host: 'smtp.gmail.com', port: 587, encryption: 'starttls', username: '', password: '', from_email: 'noreply@cbss.school.org', from_name: 'CBSS Data Collection', is_active: true }); }} className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white">Cancel</button>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ TAB 2: TEMPLATES ═══════════════════ */
function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTpl, setEditTpl] = useState<any>(null);
  const [form, setForm] = useState({ name: '', subject: '', body: '', type: 'custom' });
  const [previewTpl, setPreviewTpl] = useState<any>(null);

  const fetch = () => api.get('/email-templates').then(setTemplates).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const typeColors: Record<string, string> = {
    otp: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    invite: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    reminder: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    confirmation: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    custom: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  };

  const openCreate = () => { setEditTpl(null); setForm({ name: '', subject: '', body: '', type: 'custom' }); setShowModal(true); };
  const openEdit = (t: any) => { setEditTpl(t); setForm({ name: t.name, subject: t.subject || '', body: t.body || '', type: t.type || 'custom' }); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editTpl) await api.put('/email-templates', { id: editTpl.id, ...form });
      else await api.post('/email-templates', form);
      setShowModal(false); fetch();
    } catch (err: any) { alert(err.message); }
  };

  const handleDelete = async (id: number) => { if (!confirm('Delete this template?')) return; await api.del('/email-templates', { id }); fetch(); };

  const insertVar = (v: string) => setForm(p => ({ ...p, body: p.body + v }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{templates.length} templates ({templates.filter(t => ['otp', 'invite', 'reminder', 'confirmation'].includes(t.type)).length} built-in)</p>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover min-h-[44px]"><Plus size={15} /> New Template</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {loading ? [1,2,3,4].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />) :
          templates.map(t => (
          <div key={t.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold">{t.name}</h3>
                <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${typeColors[t.type] || typeColors.custom}`}>{t.type?.replace('_', ' ')}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setPreviewTpl(t)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary"><Eye size={13} /></button>
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 dark:text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate"><span className="font-semibold">Subject:</span> {t.subject}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{t.body?.substring(0, 120)}...</p>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTpl ? 'Edit Template' : 'Create Template'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Template Name</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none focus:border-primary" /></div>
            <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none">
                <option value="otp">OTP</option><option value="invite">Invite</option><option value="reminder">Reminder</option><option value="confirmation">Confirmation</option><option value="custom">Custom</option></select></div>
          </div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Subject</label>
            <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" placeholder="Email subject with {{variables}}" /></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Body</label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none h-48 resize-none font-mono text-xs leading-relaxed" placeholder="Email body..." /></div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 mb-2">Insert Variable (click to add at cursor):</p>
            <div className="flex flex-wrap gap-1">{VARIABLES.map(v => (
              <button key={v} onClick={() => insertVar(v)} className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 transition-colors">{v}</button>
            ))}</div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-900">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-primary text-white text-sm rounded-xl font-semibold hover:bg-primary-hover">{editTpl ? 'Update' : 'Create'} Template</button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!previewTpl} onClose={() => setPreviewTpl(null)} title={`Preview: ${previewTpl?.name || ''}`} size="lg">
        {previewTpl && (() => {
          const sampleVars: Record<string, string> = {
            user_name: 'Anita Singh', teacher_name: 'Anita Singh', reviewer_name: 'Priya Sharma',
            otp: '123456', form_title: 'Annual Teacher Performance Survey 2024',
            form_link: `${window.location.origin}/fill/1`, school_code: 'KV001',
            deadline: '31 Dec 2027', submitted_at: new Date().toLocaleString(),
            email: 'anita.teacher@school.edu', login_link: window.location.origin,
            level_name: 'Level 1 - Initial Screening', submission_count: '24', pending_count: '8',
          };
          const replaceVars = (text: string) => {
            let result = text;
            for (const [k, v] of Object.entries(sampleVars)) {
              result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
            }
            return result;
          };
          const renderedSubject = replaceVars(previewTpl.subject || '');
          const renderedBody = replaceVars(previewTpl.body || '');
          const usedVars = (previewTpl.body || '').match(/\{\{[^}]+\}\}/g) || [];

          return (
            <div className="space-y-4">
              {/* Toggle: raw vs rendered */}
              <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-1 w-fit">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm">Rendered Preview (with sample data)</span>
              </div>

              {/* Rendered email preview */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                {/* Email header bar */}
                <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs"><span className="font-bold text-slate-500 dark:text-slate-400 w-12">From:</span><span>CBSS Data Collection &lt;noreply@cbss.school.org&gt;</span></div>
                  <div className="flex items-center gap-2 text-xs"><span className="font-bold text-slate-500 dark:text-slate-400 w-12">To:</span><span>Anita Singh &lt;anita.teacher@school.edu&gt;</span></div>
                  <div className="flex items-center gap-2 text-xs"><span className="font-bold text-slate-500 dark:text-slate-400 w-12">Subject:</span><span className="font-semibold">{renderedSubject}</span></div>
                </div>
                {/* Email body */}
                <div className="p-6 bg-white dark:bg-gray-900">
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-slate-900 dark:text-white">{renderedBody}</pre>
                </div>
              </div>

              {/* Raw template */}
              <details className="group">
                <summary className="text-xs font-semibold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary">Show raw template with variables</summary>
                <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs leading-relaxed">
                  <p className="font-bold mb-1">Subject: {previewTpl.subject}</p>
                  <pre className="whitespace-pre-wrap">{previewTpl.body}</pre>
                </div>
              </details>

              {/* Variables used */}
              <div className="flex flex-wrap gap-1 items-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mr-1">Variables ({usedVars.length}):</span>
                {usedVars.map((v: string, i: number) => (
                  <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{v}</span>
                ))}
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

/* ═══════════════════ TAB 3: SEND EMAIL ═══════════════════ */
function SendTab() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const [recipientMode, setRecipientMode] = useState<'school' | 'form' | 'custom'>('custom');
  const [schoolCode, setSchoolCode] = useState('');
  const [customRecipients, setCustomRecipients] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    Promise.all([api.get('/email-templates'), api.get('/forms'), api.get('/users')])
      .then(([t, f, u]) => { setTemplates(t); setForms(f); setUsers(u); }).catch(console.error);
  }, []);

  const getRecipients = (): { name: string; email: string; school_code?: string }[] => {
    if (recipientMode === 'school' && schoolCode) {
      return users.filter(u => u.role === 'teacher' && (u.email?.includes(schoolCode.toLowerCase()) || u.school_name?.toLowerCase().includes(schoolCode.toLowerCase())))
        .map(u => ({ name: u.name, email: u.email, school_code: schoolCode }));
    }
    if (recipientMode === 'form' && selectedForm) {
      return users.filter(u => u.role === 'teacher').map(u => ({ name: u.name, email: u.email }));
    }
    if (recipientMode === 'custom' && customRecipients) {
      return customRecipients.split(',').map(r => r.trim()).filter(Boolean).map(r => {
        const match = r.match(/^(.+?)\s*<(.+?)>$/);
        if (match) return { name: match[1].trim(), email: match[2].trim() };
        return { name: r.split('@')[0], email: r };
      });
    }
    return [];
  };

  const recipients = getRecipients();

  const renderPreview = () => {
    if (!selectedTemplate) return 'Select a template first';
    let subject = selectedTemplate.subject || '';
    let body = selectedTemplate.body || '';
    const allVars = {
      ...variables,
      form_title: selectedForm?.title || variables.form_title || '{{form_title}}',
      form_link: selectedForm ? `${window.location.origin}/fill/${selectedForm.id}` : '{{form_link}}',
      deadline: selectedForm?.expires_at ? new Date(selectedForm.expires_at).toLocaleDateString() : '{{deadline}}',
      teacher_name: recipients[0]?.name || '{{teacher_name}}',
      user_name: recipients[0]?.name || '{{user_name}}',
      school_code: schoolCode || '{{school_code}}',
      login_link: window.location.origin,
    };
    for (const [k, v] of Object.entries(allVars)) {
      subject = subject.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    }
    return { subject, body };
  };

  const handleSend = async () => {
    if (!selectedTemplate || recipients.length === 0) return alert('Select template and add recipients');
    setSending(true); setResult(null);
    try {
      const allVars = {
        ...variables,
        form_title: selectedForm?.title || '',
        form_link: selectedForm ? `${window.location.origin}/fill/${selectedForm.id}` : '',
        deadline: selectedForm?.expires_at ? new Date(selectedForm.expires_at).toLocaleDateString() : '',
        school_code: schoolCode,
        login_link: window.location.origin,
      };
      const res = await api.post('/email-logs', {
        action: 'send',
        template_id: selectedTemplate.id,
        template_name: selectedTemplate.name,
        recipients,
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
        type: selectedTemplate.type,
        form_id: selectedForm?.id,
        school_code: schoolCode,
        variables: allVars,
      });
      setResult(res);
    } catch (err: any) { alert(err.message); }
    finally { setSending(false); }
  };

  const preview = renderPreview();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Compose */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold font-heading flex items-center gap-2"><Send size={15} className="text-primary" /> Compose Email</h3>

            {/* Step 1: Template */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">1</span> Select Template</label>
              <select value={selectedTemplate?.id || ''} onChange={e => setSelectedTemplate(templates.find(t => t.id === parseInt(e.target.value)) || null)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none focus:border-primary">
                <option value="">Choose template...</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
              </select>
            </div>

            {/* Step 2: Form */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">2</span> Associated Form (optional)</label>
              <select value={selectedForm?.id || ''} onChange={e => setSelectedForm(forms.find(f => f.id === parseInt(e.target.value)) || null)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none">
                <option value="">None — manual variables</option>
                {forms.filter(f => f.status === 'active').map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
              </select>
            </div>

            {/* Step 3: Recipients */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">3</span> Recipients</label>
              <div className="flex gap-1 mb-2">
                {(['school', 'form', 'custom'] as const).map(m => (
                  <button key={m} onClick={() => setRecipientMode(m)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${recipientMode === m ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    {m === 'school' ? 'By School Code' : m === 'form' ? 'By Form' : 'Custom'}
                  </button>
                ))}
              </div>
              {recipientMode === 'school' && (
                <input value={schoolCode} onChange={e => setSchoolCode(e.target.value.toUpperCase())} placeholder="Enter school code (e.g. KV001)" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none" />
              )}
              {recipientMode === 'custom' && (
                <textarea value={customRecipients} onChange={e => setCustomRecipients(e.target.value)} placeholder="Name <email>, or just email — comma separated" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none h-20 resize-none" />
              )}
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{recipients.length} recipient{recipients.length !== 1 ? 's' : ''} selected</p>
            </div>

            {/* Step 4: Variable overrides */}
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1"><span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">4</span> Variable Overrides</label>
              <div className="grid grid-cols-2 gap-2">
                {['school_code', 'deadline'].map(k => (
                  <div key={k}><label className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{`{{${k}}}`}</label>
                    <input value={variables[k] || (k === 'school_code' ? schoolCode : '') || (k === 'deadline' && selectedForm?.expires_at ? new Date(selectedForm.expires_at).toLocaleDateString() : '')}
                      onChange={e => setVariables(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs outline-none" /></div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowPreview(true)} disabled={!selectedTemplate} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-white dark:bg-slate-800 flex items-center gap-2 min-h-[44px] disabled:opacity-50"><Eye size={14} /> Preview</button>
              <button onClick={handleSend} disabled={sending || !selectedTemplate || recipients.length === 0} className="flex-1 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50">
                {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />} Send to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
              </button>
            </div>

            {result && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                <CheckCircle size={16} /> {result.sent} email{result.sent !== 1 ? 's' : ''} sent successfully!
              </div>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 className="text-sm font-bold font-heading mb-4 flex items-center gap-2"><Eye size={15} className="text-primary" /> Email Preview</h3>
          {selectedTemplate ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">To</p>
                <p className="text-xs">{recipients.length > 0 ? recipients.slice(0, 3).map(r => `${r.name} <${r.email}>`).join(', ') + (recipients.length > 3 ? ` +${recipients.length - 3} more` : '') : 'No recipients selected'}</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Subject</p>
                <p className="text-sm font-medium">{typeof preview === 'string' ? '' : preview.subject}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[200px]">
                <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-slate-900 dark:text-white">{typeof preview === 'string' ? preview : preview.body}</pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <Mail size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a template to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ TAB 4: AUTOMATED REMINDERS ═══════════════════ */
function RemindersTab() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ form_id: 0, template_id: 0, days: { 1: false, 3: false, 5: false, 7: true, 14: false } as Record<number, boolean> });

  useEffect(() => {
    Promise.all([api.get('/reminder-schedules'), api.get('/email-templates'), api.get('/forms')])
      .then(([s, t, f]) => { setSchedules(s); setTemplates(t.filter((tp: any) => tp.type === 'reminder')); setForms(f.filter((fm: any) => fm.status === 'active' && fm.expires_at)); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const createSchedule = async () => {
    const selectedForm = forms.find(f => f.id === form.form_id);
    const selectedTpl = templates.find(t => t.id === form.template_id);
    const days = Object.entries(form.days).filter(([, v]) => v).map(([k]) => parseInt(k));
    if (!selectedForm || !selectedTpl || days.length === 0) return alert('Fill all fields');
    await api.post('/reminder-schedules', {
      form_id: form.form_id, form_title: selectedForm.title,
      template_id: form.template_id, template_name: selectedTpl.name,
      days_before: days, is_active: true,
    });
    setShowModal(false);
    setSchedules(await api.get('/reminder-schedules'));
  };

  const toggleActive = async (id: number, active: boolean) => {
    await api.put('/reminder-schedules', { id, is_active: !active });
    setSchedules(await api.get('/reminder-schedules'));
  };

  const deleteSchedule = async (id: number) => {
    if (!confirm('Delete this schedule?')) return;
    await api.del('/reminder-schedules', { id });
    setSchedules(await api.get('/reminder-schedules'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{schedules.length} reminder schedule{schedules.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover min-h-[44px]"><Plus size={15} /> New Schedule</button>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium flex items-center gap-2"><Zap size={14} /> <strong>How it works:</strong> System checks daily → if days until form expiry matches your schedule → finds incomplete teachers → sends reminder → logs it.</p>
      </div>

      {loading ? <div className="skeleton h-32 rounded-2xl" /> :
        schedules.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Clock size={40} className="mx-auto text-slate-500 dark:text-slate-400 mb-3 opacity-30" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No reminder schedules yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map(s => {
              let days: number[] = [];
              try { days = typeof s.days_before === 'string' ? JSON.parse(s.days_before) : s.days_before || []; } catch {}
              return (
                <div key={s.id} className={`bg-white dark:bg-slate-800 rounded-2xl border p-4 shadow-sm ${s.is_active ? 'border-accent-green/50' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-bold">{s.form_title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Template: {s.template_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(s.id, s.is_active)} className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${s.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>
                        {s.is_active ? 'Active' : 'Paused'}
                      </button>
                      <button onClick={() => deleteSchedule(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 dark:text-slate-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Send at:</span>
                    {days.map(d => (
                      <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{d}d before</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Total sent: <strong>{s.total_sent || 0}</strong></span>
                    {s.last_sent_at && <span>Last: {new Date(s.last_sent_at).toLocaleDateString()}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Reminder Schedule">
        <div className="space-y-4">
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Select Active Form (with expiry)</label>
            <select value={form.form_id} onChange={e => setForm(p => ({ ...p, form_id: parseInt(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none">
              <option value={0}>Choose form...</option>
              {forms.map(f => <option key={f.id} value={f.id}>{f.title} (expires {new Date(f.expires_at).toLocaleDateString()})</option>)}
            </select></div>
          <div><label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Reminder Template</label>
            <select value={form.template_id} onChange={e => setForm(p => ({ ...p, template_id: parseInt(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-sm outline-none">
              <option value={0}>Choose template...</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select></div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">Days Before Expiry</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 3, 5, 7, 14].map(d => (
                <label key={d} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer min-h-[44px] transition-all ${form.days[d] ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-slate-200 dark:border-slate-700 hover:border-muted'}`}>
                  <input type="checkbox" checked={form.days[d] || false} onChange={e => setForm(p => ({ ...p, days: { ...p.days, [d]: e.target.checked } }))} className="accent-primary" />
                  <span className="text-sm font-semibold">{d} day{d > 1 ? 's' : ''}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-900">Cancel</button>
            <button onClick={createSchedule} className="px-6 py-2 bg-primary text-white text-sm rounded-xl font-semibold hover:bg-primary-hover">Create Schedule</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════ TAB 5: DELIVERY LOGS ═══════════════════ */
function LogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [resending, setResending] = useState<number | null>(null);

  const fetchLogs = () => {
    let url = '/email-logs?';
    if (typeFilter) url += `type=${typeFilter}&`;
    if (statusFilter) url += `status=${statusFilter}&`;
    api.get(url).then(setLogs).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchLogs(); }, [typeFilter, statusFilter]);

  const resend = async (logId: number) => {
    setResending(logId);
    try {
      await api.post('/email-logs', { action: 'resend', log_id: logId });
      fetchLogs();
    } catch (err: any) { alert(err.message); }
    finally { setResending(null); }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Template', 'Recipient', 'Email', 'Subject', 'Type', 'Status', 'School', 'Date', 'Error'];
    const rows = logs.map(l => [l.id, l.template_name, l.recipient_name, l.recipient_email, l.subject, l.type, l.status, l.school_code || '', l.sent_at || '', l.error_message || '']);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `email-logs-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const statusBadge = (status: string) => {
    const m: Record<string, string> = {
      sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      queued: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      bounced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${m[status] || m.sent}`}>{status}</span>;
  };

  const columns = [
    { key: 'recipient_name', label: 'Recipient', sortable: true, render: (v: string, r: any) => (
      <div><p className="text-sm font-medium">{v || 'Unknown'}</p><p className="text-[10px] text-slate-500 dark:text-slate-400">{r.recipient_email}</p></div>) },
    { key: 'template_name', label: 'Template', sortable: true, render: (v: string) => <span className="text-xs font-semibold">{v}</span> },
    { key: 'subject', label: 'Subject', render: (v: string) => <span className="text-xs text-slate-500 dark:text-slate-400 truncate block max-w-[200px]">{v}</span> },
    { key: 'type', label: 'Type', render: (v: string) => <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold uppercase">{v}</span> },
    { key: 'status', label: 'Status', render: (v: string) => statusBadge(v) },
    { key: 'school_code', label: 'School', render: (v: string) => v ? <span className="text-xs font-mono font-bold text-primary">{v}</span> : <span className="text-slate-500 dark:text-slate-400">—</span> },
    { key: 'sent_at', label: 'Sent', sortable: true, render: (v: string) => v ? <span className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(v).toLocaleString()}</span> : '—' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{logs.length} email log{logs.length !== 1 ? 's' : ''}</p>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:bg-slate-900"><Download size={13} /> Export CSV</button>
      </div>

      <DataTable columns={columns} data={logs} loading={loading} searchPlaceholder="Search by name, email, subject..."
        onRowClick={setSelectedLog}
        filters={
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-500 dark:text-slate-400" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none">
              <option value="">All Types</option><option value="otp">OTP</option><option value="invite">Invite</option><option value="reminder">Reminder</option><option value="confirmation">Confirmation</option><option value="custom">Custom</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none">
              <option value="">All Status</option><option value="sent">Sent</option><option value="queued">Queued</option><option value="failed">Failed</option><option value="bounced">Bounced</option>
            </select>
          </div>
        }
        actions={(row: any) => (
          <div className="flex items-center gap-1">
            <button onClick={e => { e.stopPropagation(); setSelectedLog(row); }} className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary"><Eye size={13} /></button>
            {(row.status === 'failed' || row.status === 'bounced') && (
              <button onClick={e => { e.stopPropagation(); resend(row.id); }} disabled={resending === row.id}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-amber-500"><RotateCcw size={13} className={resending === row.id ? 'animate-spin' : ''} /></button>
            )}
          </div>
        )}
      />

      {/* Detail Modal */}
      <Modal open={!!selectedLog} onClose={() => setSelectedLog(null)} title={`Email Log #${selectedLog?.id || ''}`} size="lg">
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[{ l: 'Recipient', v: `${selectedLog.recipient_name || ''} <${selectedLog.recipient_email}>` },
                { l: 'Template', v: selectedLog.template_name },
                { l: 'Type', v: selectedLog.type },
                { l: 'Status', v: selectedLog.status, badge: true },
                { l: 'School', v: selectedLog.school_code || 'N/A' },
                { l: 'Sent', v: selectedLog.sent_at ? new Date(selectedLog.sent_at).toLocaleString() : 'N/A' }]
                .map((m, i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-900 rounded-xl p-3">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">{m.l}</p>
                    {m.badge ? statusBadge(m.v) : <p className="text-sm font-medium mt-0.5">{m.v}</p>}
                  </div>
                ))}
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Subject</p>
              <p className="text-sm font-medium">{selectedLog.subject}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">Body</p>
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{selectedLog.body}</pre>
            </div>
            {selectedLog.error_message && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-700 dark:text-red-400 font-medium flex items-center gap-1"><AlertTriangle size={12} /> Error: {selectedLog.error_message}</p>
              </div>
            )}
            {(selectedLog.status === 'failed' || selectedLog.status === 'bounced') && (
              <button onClick={() => { resend(selectedLog.id); setSelectedLog(null); }}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 flex items-center gap-2">
                <RotateCcw size={14} /> Resend This Email
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
