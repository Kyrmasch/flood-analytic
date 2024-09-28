export interface IColumnMeta {
  name: string;
  type: string;
}

export interface IRelationshipMeta {
  relation: string;
  related_model: string;
  foreign_keys: string[];
}

export interface ITableMeta {
  table_name: string;
  columns: IColumnMeta[];
  relationships: IRelationshipMeta[];
}
