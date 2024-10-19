import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import "./DefaultTable.scss";
import { IPaginatedResponse } from "../../domain/interfaces/data";
import { useGetMetaQuery } from "../../domain/store/api/meta";
import { IColumnMeta, ITableMeta } from "../../domain/interfaces/meta";
import { useTranslation } from "react-i18next";
import Pagination from "./Pagination";
import { isObject } from "../../utils/utils";

export interface IDefaultTable<T> {
  tableName: string;
  data: IPaginatedResponse<T>;
  setOffset: (x: number) => void;
}

export interface IDefaultTableRef {}

const DefaultTable = <T,>(
  props: IDefaultTable<T>,
  ref: Ref<IDefaultTableRef>
) => {
  const { t } = useTranslation();
  const { data: table, isSuccess } = useGetMetaQuery(
    {
      tablename: props.tableName,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const columns = useCallback(
    (table: ITableMeta) => {
      var cols = [...table.columns];
      table.relationships.map((rel) => {
        if (rel) {
          let field = rel.foreign_keys[0];
          if (field) {
            let joinIndex = cols.findIndex((x) => x.name == field);
            if (joinIndex !== -1) {
              let join: IColumnMeta = {
                name: rel.relation,
                type: "VARCHAR",
                is_rel: true,
              };
              cols[joinIndex] = join;
            }
          }
        }
      });

      return cols;
    },
    [props.tableName]
  );

  const [page, setPage] = React.useState<number>(0);

  useImperativeHandle(ref, () => ({
    open: open,
  }));

  React.useEffect(() => {
    props.setOffset(page * props.data.limit);
  }, [page]);

  const getData = (data: Record<string, any>, col: IColumnMeta) => {
    var value = data[col.name];
    if (!isObject(value)) return value;

    const relField = Object.entries(value)[1];
    const [_, fieldValue] = relField;
    return fieldValue;
  };

  if (!isSuccess) return <></>;

  return (
    <div className="table_container">
      <table className="table">
        <thead className="head">
          <tr>
            {columns(table).map((col: IColumnMeta, index: number) => {
              return (
                <th
                  scope="col"
                  key={`${props.tableName}_${index}`}
                  className="px-6 py-3"
                >
                  {t(col.name)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {props.data.data.map((item, i: number) => {
            if (item.data) {
              return (
                <tr
                  className="bg-white border-b"
                  key={`${props.tableName}_row_${i}`}
                >
                  {columns(table).map((col, y: number) => {
                    if ((item.data as Record<string, any>)[col.name]) {
                      return (
                        <td
                          className="px-6 py-4"
                          key={`${props.tableName}_item_${i}_${y}`}
                        >
                          {getData(item.data as Record<string, any>, col)}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      <Pagination
        currentPage={page}
        edgePageCount={2}
        setCurrentPage={setPage}
        totalPages={
          props.data.count /
          (props.data.limit > props.data.count
            ? props.data.count
            : props.data.limit)
        }
      />
    </div>
  );
};

export default forwardRef(DefaultTable) as <T>(
  props: IDefaultTable<T> & { ref?: Ref<IDefaultTableRef> }
) => React.ReactElement;
