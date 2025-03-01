import { PaginationState } from '@tanstack/react-table';

export type PaginatedData<T> = {
  result: T[];
  rowCount: number;
};

export type PaginationParams = PaginationState;
export type SortParams = { sortBy: `${string}.${'asc' | 'desc'}` };
export type Filters<T> = Partial<T & PaginationParams & SortParams>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {
  //
};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig['columnTypes'][number];

export type FilterOperator = DataTableConfig['globalOperators'][number];

export type JoinOperator = DataTableConfig['joinOperators'][number]['value'];

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  helpText?: string;
  // columnsToSearch?: StringKeyOf<TData>[];
}

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: 'edit' | 'delete' | 'show';
}
