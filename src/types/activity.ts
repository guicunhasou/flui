import { ConnectorType } from './chargingStation';

export type RechargeHistoryItem = {
  id: string;
  stationId: string;
  stationName: string;
  address: string;
  connectorType: ConnectorType;
  powerKw: number;
  date: string;
  startTime: string;
  endTime: string;
  energyKwh: number;
  totalPaid?: number;
};

export type SentReview = {
  id: string;
  stationId: string;
  stationName: string;
  rating: number;
  quality: number;
  cleaning: number;
  availability: number;
  amenities: number;
  comment: string;
  wouldReturn: boolean;
  recommend: boolean;
  createdAt: string;
};