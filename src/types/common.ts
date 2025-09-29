export interface Paginated<T> {
  total: number;
  limit: number;
  page: number;
  items: T[];
}
