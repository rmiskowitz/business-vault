// ============================================================================
// Business Vault: Deal-Ready Types
// lib/types.ts
// ============================================================================

// ============================================================================
// SECTION STATUS TYPES
// ============================================================================

export type SectionStatusValue = 'not_started' | 'in_progress' | 'complete';

export interface SectionStatus {
  id: string;
  user_id: string;
  section_id: number;
  status: SectionStatusValue;
  item_count: number;
  last_item_added_at: string | null;
  created_at: string;
  updated_at: string;
}

export const SECTIONS = {
  CONTRACTS_LEGAL: 1,
  DIGITAL: 2,
  PHYSICAL: 3,
  SUBSCRIPTIONS: 4,
  CONTACTS: 5,
} as const;

export const SECTION_NAMES: Record<number, string> = {
  1: 'Contracts & Legal',
  2: 'Digital Infrastructure',
  3: 'Physical Assets',
  4: 'Subscriptions',
  5: 'Key Relationships',
};

export const SECTION_ICONS: Record<number, string> = {
  1: '📄',
  2: '🌐',
  3: '🏢',
  4: '💳',
  5: '👥',
};

// ============================================================================
// VAULT ACCESS TYPES (Reviewer/Broker/Buyer Access)
// ============================================================================

export type VaultAccessStatus = 'pending' | 'active' | 'revoked' | 'expired';
export type ReviewerRole = 'reviewer' | 'buyer' | 'broker';

export interface VaultAccess {
  id: string;
  owner_id: string;
  owner_email: string;
  reviewer_id: string | null;
  reviewer_email: string;
  reviewer_name: string | null;
  role: ReviewerRole;
  status: VaultAccessStatus;
  invite_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COMPLETENESS INDICATOR TYPES
// ============================================================================

export type ReadinessLevel = 'Not Started' | 'In Progress' | 'Almost Ready' | 'Deal-Ready';

export interface VaultCompleteness {
  totalSections: number;
  completedSections: number;
  inProgressSections: number;
  notStartedSections: number;
  overallPercentage: number;
  readinessLevel: ReadinessLevel;
  sectionStatuses: SectionStatus[];
}

export function calculateReadinessLevel(completedSections: number, totalSections: number): ReadinessLevel {
  const percentage = (completedSections / totalSections) * 100;
  
  if (percentage === 0) return 'Not Started';
  if (percentage < 60) return 'In Progress';
  if (percentage < 100) return 'Almost Ready';
  return 'Deal-Ready';
}

export function getReadinessColor(level: ReadinessLevel): string {
  switch (level) {
    case 'Not Started': return 'text-red-500';
    case 'In Progress': return 'text-yellow-500';
    case 'Almost Ready': return 'text-amber-500';
    case 'Deal-Ready': return 'text-green-500';
    default: return 'text-gray-500';
  }
}

export function getReadinessBgColor(level: ReadinessLevel): string {
  switch (level) {
    case 'Not Started': return 'bg-red-500/20';
    case 'In Progress': return 'bg-yellow-500/20';
    case 'Almost Ready': return 'bg-amber-500/20';
    case 'Deal-Ready': return 'bg-green-500/20';
    default: return 'bg-gray-500/20';
  }
}

// ============================================================================
// EXPANDED CONTRACT TYPES (Now includes Ownership & Financials)
// ============================================================================

export type ContractType = 
  | 'lease'
  | 'service_agreement'
  | 'vendor_contract'
  | 'client_contract'
  | 'insurance_policy'
  | 'nda'
  | 'partnership_agreement'
  | 'employment_contract'
  | 'other_contract'
  | 'business_license'
  | 'operating_agreement'
  | 'articles_of_incorporation'
  | 'bylaws'
  | 'shareholder_agreement'
  | 'ownership_document'
  | 'tax_return'
  | 'financial_statement'
  | 'profit_loss'
  | 'balance_sheet'
  | 'bank_statement'
  | 'accounts_receivable'
  | 'accounts_payable';

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  lease: 'Lease Agreement',
  service_agreement: 'Service Agreement',
  vendor_contract: 'Vendor Contract',
  client_contract: 'Client Contract',
  insurance_policy: 'Insurance Policy',
  nda: 'NDA / Non-Disclosure',
  partnership_agreement: 'Partnership Agreement',
  employment_contract: 'Employment Contract',
  other_contract: 'Other Contract',
  business_license: 'Business License',
  operating_agreement: 'Operating Agreement',
  articles_of_incorporation: 'Articles of Incorporation',
  bylaws: 'Bylaws',
  shareholder_agreement: 'Shareholder Agreement',
  ownership_document: 'Ownership Document',
  tax_return: 'Tax Return',
  financial_statement: 'Financial Statement',
  profit_loss: 'Profit & Loss Statement',
  balance_sheet: 'Balance Sheet',
  bank_statement: 'Bank Statement',
  accounts_receivable: 'Accounts Receivable',
  accounts_payable: 'Accounts Payable',
};

export const CONTRACT_TYPE_CATEGORIES = {
  contracts: [
    'lease',
    'service_agreement',
    'vendor_contract',
    'client_contract',
    'insurance_policy',
    'nda',
    'partnership_agreement',
    'employment_contract',
    'other_contract',
  ],
  ownership: [
    'business_license',
    'operating_agreement',
    'articles_of_incorporation',
    'bylaws',
    'shareholder_agreement',
    'ownership_document',
  ],
  financial: [
    'tax_return',
    'financial_statement',
    'profit_loss',
    'balance_sheet',
    'bank_statement',
    'accounts_receivable',
    'accounts_payable',
  ],
} as const;