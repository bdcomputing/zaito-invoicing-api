export interface Periods {
  year: number;
  months: { month: string; value: number }[];
}
export interface PaginatedData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: any;
  filters?: {
    months?: Periods[];
  };
}
