export interface PeriodsInterface {
  year: number;
  months: { month: string; value: number }[];
}
export interface PaginatedDataInterface {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: any;
  filters?: {
    months?: PeriodsInterface[];
  };
}
