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

export interface IDefaultTable<T> {
  tableName: string;
  data: IPaginatedResponse<T>;
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
      return table.columns.filter((x) => x.type != "WTKElement");
    },
    [props.tableName]
  );

  useImperativeHandle(ref, () => ({
    open: open,
  }));

  React.useEffect(() => {
    if (props) {
    }
  }, []);

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
                          {(item.data as Record<string, any>)[col.name]}
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
    </div>
  );
};

export default forwardRef(DefaultTable) as <T>(
  props: IDefaultTable<T> & { ref?: Ref<IDefaultTableRef> }
) => React.ReactElement;
