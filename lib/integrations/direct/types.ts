export interface DirectCampaignStat {
  campaignId: string;
  campaignName: string;
  costRub: number;
  clicks: number;
  impressions: number;
  cpc: number;
  ctr: number;
  conversions: number;
}

export interface DirectReportSummary {
  periodDays: number;
  totalCostRub: number;
  totalClicks: number;
  totalImpressions: number;
  avgCpc: number;
  avgCtr: number;
  campaigns: DirectCampaignStat[];
  source: 'api' | 'mock' | 'cache';
}

export interface DirectApiConfig {
  token: string;
  clientLogin?: string;
  sandbox?: boolean;
}
