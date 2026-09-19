export enum PortalType {
  INDIVIDUAL = 'INDIVIDUAL',
  ENTERPRISE = 'ENTERPRISE'
}

export interface AppUsageItem {
  name: string;
  category: string;
  hours: number;
  minutes: number;
}

export interface AppCategoryResult {
  category: string;
  totalMinutes: number;
  co2Emissions: number; // in grams
  color: string;
  icon: string;
}

export interface IndividualResultData {
  totalCO2: number;
  breakdown: AppCategoryResult[];
  comparison: string;
}

export interface MaterialItem {
  name: string;
  weight: number; // kg
  origin: string;
  type?: string;
  factor?: number;
  co2?: number;
  transport?: number;
}

export interface InvoiceData {
  materials: MaterialItem[];
  supplier: string;
  invoiceNumber: string;
  date: string;
  batchId?: string;
}

export interface EnterpriseResultData extends InvoiceData {
  totalProductionCO2: number;
  totalTransportCO2: number;
  grandTotalCO2: number;
}
