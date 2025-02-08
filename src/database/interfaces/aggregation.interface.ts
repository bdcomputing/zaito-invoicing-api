export interface AggregationPayload {
  keyword: string;
  skip: number;
  limit: number;
  sort: object;
  clientId: string;
}
