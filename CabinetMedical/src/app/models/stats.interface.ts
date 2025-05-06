export interface StatsResponse {
  appointments: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
  };
  documents: {
    byType: { type: string; count: number }[];
    viewed: number;
    pending: number;
  };
  responseTime: {
    average: number;
    byDoctor: {
      doctorId: string;
      doctorName: string;
      averageTime: number;
    }[];
  };
  advertisements: {
    titre: string;
    description: string;
    dateFin: string;
    image: string;
    active: boolean;
  }[];
}

export interface PeriodSelection {
  value: string;
  label: string;
}