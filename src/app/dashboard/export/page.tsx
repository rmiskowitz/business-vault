// ============================================================================
// Business Vault: Download Report Page
// app/dashboard/export/page.tsx
// ============================================================================

'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUserContext, useSectionStatus } from '@/lib/hooks/useVaultAccess';
import { CONTRACT_TYPE_LABELS } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface ExportData {
  contracts: any[];
  digital: any[];
  physical: any[];
  subscriptions: any[];
  contacts: any[];
}

type ExportFormat = 'pdf' | 'csv' | 'json';

// ============================================================================
// MAIN EXPORT PAGE
// ============================================================================

export default function ExportPage() {
  const supabase = createClientComponentClient();
  const { context } = useUserContext();
  const { completeness } = useSectionStatus();

  const [isLoading, setIsLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [selectedSections, setSelectedSections] = useState({
    contracts: true,
    digital: true,
    physical: true,
    subscriptions: true,
    contacts: true,
  });
  const [includeInternalNotes, setIncludeInternalNotes] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');

  const isReviewer = context?.isReviewer || false;

  // Fetch all data for export
  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userId = context?.isReviewer ? context.vaultOwnerId : user.id;

      const [contracts, digital, physical, subscriptions, contacts] = await Promise.all([
        supabase.from('contracts').select('*').eq('user_id', userId),
        supabase.from('digital_assets').select('*').eq('user_id', userId),
        supabase.from('physical_assets').select('*').eq('user_id', userId),
        supabase.from('subscriptions').select('*').eq('user_id', userId),
        supabase.from('contacts').select('*').eq('user_id', userId),
      ]);

      setExportData({
        contracts: contracts.data || [],
        digital: digital.data || [],
        physical: physical.data || [],
        subscriptions: subscriptions.data || [],
        contacts: contacts.data || [],
      });
    }

    fetchData();
  }, [supabase, context]);

  // Generate PDF export
  const generatePDF = async () => {
    if (!exportData) return;

    setIsLoading(true);

    try {
      // Build HTML content for PDF
      const html = buildPDFContent(exportData, selectedSections, includeInternalNotes && !isReviewer);
      
      // Use browser print to PDF for now
      // In production, use a proper PDF library like jsPDF or server-side generation
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate CSV export
  const generateCSV = async () => {
    if (!exportData) return;

    setIsLoading(true);

    try {
      const csvContent = buildCSVContent(exportData, selectedSections);
      downloadFile(csvContent, 'deal-readiness-report.csv', 'text/csv');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate JSON export
  const generateJSON = async () => {
    if (!exportData) return;

    setIsLoading(true);

    try {
      const filteredData: any = {};
      if (selectedSections.contracts) filteredData.contracts = exportData.contracts;
      if (selectedSections.digital) filteredData.digital = exportData.digital;
      if (selectedSections.physical) filteredData.physical = exportData.physical;
      if (selectedSections.subscriptions) filteredData.subscriptions = exportData.subscriptions;
      if (selectedSections.contacts) filteredData.contacts = exportData.contacts;

      // Remove internal notes if not included
      if (!includeInternalNotes || isReviewer) {
        Object.keys(filteredData).forEach(key => {
          filteredData[key] = filteredData[key].map((item: any) => {
            const { internal_notes, ...rest } = item;
            return rest;
          });
        });
      }

      const jsonContent = JSON.stringify(filteredData, null, 2);
      downloadFile(jsonContent, 'deal-readiness-report.json', 'application/json');
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'pdf': generatePDF(); break;
      case 'csv': generateCSV(); break;
      case 'json': generateJSON(); break;
    }
  };

  const totalItems = exportData ? 
    (selectedSections.contracts ? exportData.contracts.length : 0) +
    (selectedSections.digital ? exportData.digital.length : 0) +
    (selectedSections.physical ? exportData.physical.length : 0) +
    (selectedSections.subscriptions ? exportData.subscriptions.length : 0) +
    (selectedSections.contacts ? exportData.contacts.length : 0)
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Download Report</h1>
        <p className="mt-1 text-zinc-400">
          Generate a Deal Readiness Report for due diligence
        </p>
      </div>

      {/* Readiness Status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl">
            {completeness.readinessLevel === 'Deal-Ready' ? '✓' : '📋'}
          </div>
          <div>
            <h2 className="font-medium text-white">{completeness.readinessLevel}</h2>
            <p className="text-sm text-zinc-400">
              {completeness.completedSections} of {completeness.totalSections} sections complete
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-medium text-white mb-4">Report Options</h2>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-3">Format</label>
          <div className="flex gap-3">
            {(['pdf', 'csv', 'json'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  exportFormat === format
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Section Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-3">Include Sections</label>
          <div className="space-y-2">
            {[
              { key: 'contracts', label: 'Contracts & Legal', count: exportData?.contracts.length || 0 },
              { key: 'digital', label: 'Digital Infrastructure', count: exportData?.digital.length || 0 },
              { key: 'physical', label: 'Physical Assets', count: exportData?.physical.length || 0 },
              { key: 'subscriptions', label: 'Subscriptions', count: exportData?.subscriptions.length || 0 },
              { key: 'contacts', label: 'Key Relationships', count: exportData?.contacts.length || 0 },
            ].map((section) => (
              <label key={section.key} className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSections[section.key as keyof typeof selectedSections]}
                  onChange={(e) => setSelectedSections({
                    ...selectedSections,
                    [section.key]: e.target.checked
                  })}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                />
                <span className="flex-1 text-white">{section.label}</span>
                <span className="text-sm text-zinc-500">{section.count} items</span>
              </label>
            ))}
          </div>
        </div>

        {/* Internal Notes Toggle (owners only) */}
        {!isReviewer && (
          <div className="mb-6">
            <label className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={includeInternalNotes}
                onChange={(e) => setIncludeInternalNotes(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-amber-500 focus:ring-amber-500"
              />
              <div>
                <span className="text-white">Include Internal Notes</span>
                <p className="text-xs text-zinc-500">Private notes will be visible in the export</p>
              </div>
            </label>
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-zinc-800/50 rounded-lg mb-6">
          <p className="text-sm text-zinc-400">
            Your report will include <span className="text-white font-medium">{totalItems} items</span> across {Object.values(selectedSections).filter(Boolean).length} sections.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isLoading || totalItems === 0}
          className="w-full px-4 py-3 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : `Download ${exportFormat.toUpperCase()} Report`}
        </button>
      </div>

      {/* Use Cases */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Common Use Cases</h3>
        <div className="space-y-3 text-sm text-zinc-500">
          <div className="flex items-start gap-3">
            <span>📋</span>
            <span>Share with business brokers during listing process</span>
          </div>
          <div className="flex items-start gap-3">
            <span>🤝</span>
            <span>Provide to buyers during due diligence</span>
          </div>
          <div className="flex items-start gap-3">
            <span>📁</span>
            <span>Archive for business continuity planning</span>
          </div>
          <div className="flex items-start gap-3">
            <span>🔒</span>
            <span>Secure backup of critical business information</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildPDFContent(
  data: ExportData, 
  sections: Record<string, boolean>,
  includeNotes: boolean
): string {
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Deal Readiness Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1a1a1a; }
        h1 { font-size: 24px; margin-bottom: 8px; }
        h2 { font-size: 18px; margin-top: 32px; margin-bottom: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
        .subtitle { color: #666; margin-bottom: 24px; }
        .item { margin-bottom: 16px; padding: 12px; background: #f9f9f9; border-radius: 8px; }
        .item-name { font-weight: 600; }
        .item-detail { font-size: 14px; color: #666; margin-top: 4px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <h1>Deal Readiness Report</h1>
      <p class="subtitle">Generated on ${date}</p>

      ${sections.contracts && data.contracts.length > 0 ? `
        <h2>Contracts & Legal (${data.contracts.length})</h2>
        ${data.contracts.map(c => `
          <div class="item">
            <div class="item-name">${c.name}</div>
            <div class="item-detail">Type: ${CONTRACT_TYPE_LABELS[c.type as keyof typeof CONTRACT_TYPE_LABELS] || c.type}</div>
            ${c.counterparty ? `<div class="item-detail">Party: ${c.counterparty}</div>` : ''}
            ${c.expiration_date ? `<div class="item-detail">Expires: ${new Date(c.expiration_date).toLocaleDateString()}</div>` : ''}
            ${c.document_location ? `<div class="item-detail">Location: ${c.document_location}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${sections.digital && data.digital.length > 0 ? `
        <h2>Digital Infrastructure (${data.digital.length})</h2>
        ${data.digital.map(d => `
          <div class="item">
            <div class="item-name">${d.name}</div>
            <div class="item-detail">Type: ${d.type}</div>
            ${d.provider ? `<div class="item-detail">Provider: ${d.provider}</div>` : ''}
            ${d.expiration_date ? `<div class="item-detail">Expires: ${new Date(d.expiration_date).toLocaleDateString()}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${sections.physical && data.physical.length > 0 ? `
        <h2>Physical Assets (${data.physical.length})</h2>
        ${data.physical.map(p => `
          <div class="item">
            <div class="item-name">${p.name}</div>
            <div class="item-detail">Type: ${p.type}</div>
            ${p.location ? `<div class="item-detail">Location: ${p.location}</div>` : ''}
            ${p.serial_number ? `<div class="item-detail">Serial: ${p.serial_number}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${sections.subscriptions && data.subscriptions.length > 0 ? `
        <h2>Subscriptions (${data.subscriptions.length})</h2>
        ${data.subscriptions.map(s => `
          <div class="item">
            <div class="item-name">${s.name}</div>
            <div class="item-detail">Provider: ${s.provider}</div>
            ${s.monthly_cost ? `<div class="item-detail">Cost: $${s.monthly_cost}/mo</div>` : ''}
            ${s.renewal_date ? `<div class="item-detail">Renews: ${new Date(s.renewal_date).toLocaleDateString()}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      ${sections.contacts && data.contacts.length > 0 ? `
        <h2>Key Relationships (${data.contacts.length})</h2>
        ${data.contacts.map(c => `
          <div class="item">
            <div class="item-name">${c.name}</div>
            <div class="item-detail">Role: ${c.role}</div>
            ${c.organization ? `<div class="item-detail">Organization: ${c.organization}</div>` : ''}
            ${c.email ? `<div class="item-detail">Email: ${c.email}</div>` : ''}
          </div>
        `).join('')}
      ` : ''}

      <div class="footer">
        <p>This report was generated by Deal-Ready Vault (businessvault.io)</p>
      </div>
    </body>
    </html>
  `;
}

function buildCSVContent(data: ExportData, sections: Record<string, boolean>): string {
  let csv = 'Section,Name,Type,Details,Expiration\n';

  if (sections.contracts) {
    data.contracts.forEach(c => {
      csv += `"Contracts","${c.name}","${c.type}","${c.counterparty || ''}","${c.expiration_date || ''}"\n`;
    });
  }
  if (sections.digital) {
    data.digital.forEach(d => {
      csv += `"Digital","${d.name}","${d.type}","${d.provider || ''}","${d.expiration_date || ''}"\n`;
    });
  }
  if (sections.physical) {
    data.physical.forEach(p => {
      csv += `"Physical","${p.name}","${p.type}","${p.location || ''}",""\n`;
    });
  }
  if (sections.subscriptions) {
    data.subscriptions.forEach(s => {
      csv += `"Subscriptions","${s.name}","${s.provider}","$${s.monthly_cost || 0}/mo","${s.renewal_date || ''}"\n`;
    });
  }
  if (sections.contacts) {
    data.contacts.forEach(c => {
      csv += `"Contacts","${c.name}","${c.role}","${c.organization || ''}",""\n`;
    });
  }

  return csv;
}