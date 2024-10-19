export interface IColumnMeta {
  name: string;
  type: string;
  is_rel?: boolean;
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

export interface IItemMeta {
  name: string;
  description: string;
}
