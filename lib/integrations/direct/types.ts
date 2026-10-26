export interface DirectCampaignStat {
  campaignId: string;
  campaignName: string;
  costRub: number;
  clicks: number;
  impressions: number;
  cpc: number;
  ctr: number;
  conversions: number;
  status?: string;
  region?: string;
  feedInfo?: string;
}

export interface DirectReportSummary {
  periodDays: number;
  totalCostRub: number;
  costWithVatRub: number;
  balanceRub: number;
  initialDepositRub: number;
  totalClicks: number;
  totalImpressions: number;
  avgCpc: number;
  avgCtr: number;
  campaigns: DirectCampaignStat[];
  source: 'api' | 'metrika_direct' | 'mock' | 'cache';
}

export interface DirectApiConfig {
  token: string;
  clientLogin?: string;
  sandbox?: boolean;
}
