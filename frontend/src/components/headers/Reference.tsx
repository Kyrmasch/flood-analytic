import React from "react";
import { useGetTablesQuery } from "../../domain/store/api/meta";
import "./Header.scss";
import { IHeader } from "./interfaces/IHeader";

const ReferenceHeader: React.FC<IHeader> = (props) => {
  const [selected, setSelected] = React.useState<string | null>(null);
  const { data: table, isLoading } = useGetTablesQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  React.useEffect(() => {
    if (table) {
      setSelected(table[0].name);
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (selected) {
      props.OnSelect(selected);
    }
  }, [selected]);

  return (
    <nav className="bg-gray-50 z-40 w-full border-b border-gray-200">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px tab">
          {table?.map((meta) => {
            return (
              <li className="me-2" key={`header-item-${meta.name}`}>
                <a
                  href="#"
                  onClick={() => setSelected(meta.name)}
                  className={selected == meta.name ? "selected" : "default"}
                >
                  {meta.description}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default ReferenceHeader;
