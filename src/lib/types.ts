export interface PhysicalAsset {
  id: string
  user_id: string
  name: string
  category: string
  location: string
  serial_number?: string
  purchase_date?: string
  purchase_price?: number
  warranty_expires?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DigitalAsset {
  id: string
  user_id: string
  name: string
  type: 'domain' | 'hosting' | 'social_media' | 'software' | 'other'
  url?: string
  registrar?: string
  credential_location: string
  expires?: string
  auto_renew: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  user_id: string
  name: string
  party: string
  type: string
  start_date: string
  end_date?: string
  value?: number
  auto_renew: boolean
  document_location?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  provider: string
  cost: number
  billing_cycle: 'monthly' | 'quarterly' | 'annual'
  next_billing?: string
  credential_location: string
  cancellation_terms?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  user_id: string
  name: string
  company?: string
  role: string
  email?: string
  phone?: string
  category: 'vendor' | 'client' | 'partner' | 'contractor' | 'other'
  notes?: string
  created_at: string
  updated_at: string
}

export type AssetCategory = 'physical' | 'digital' | 'contracts' | 'subscriptions' | 'contacts'
