import React from "react";
import { IItemMeta } from "../../domain/interfaces/meta";
import "./Header.scss";

const MapHeader: React.FC = () => {
  const [sections, setSections] = React.useState<IItemMeta[] | null>(null);
  const [selected, setSelected] = React.useState<string | null>("waters");

  React.useEffect(() => {
    setSections([
      {
        name: "regions",
        description: "Регионы",
      } as IItemMeta,
      {
        name: "waters",
        description: "Водоемы",
      } as IItemMeta,
    ]);
  }, []);

  return (
    <nav className="bg-gray-50 z-40 w-full border-b border-gray-200">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px tab">
          {sections?.map((meta) => {
            return (
              <li className="me-2">
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

export default MapHeader;
