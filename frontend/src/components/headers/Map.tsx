import React from "react";
import { IItemMeta } from "../../domain/interfaces/meta";
import "./Header.scss";
import { IHeader } from "./interfaces/IHeader";

const MapHeader: React.FC<IHeader> = (props) => {
  const [sections, _] = React.useState<IItemMeta[]>([
    { name: "regions", description: "Регионы" },
    { name: "waters", description: "Водоемы" },
  ]);
  const [selected, setSelected] = React.useState<string>("regions");

  React.useEffect(() => {
    if (props) {
      props.OnSelect(selected);
    }
  }, [selected]);

  return (
    <nav className="bg-gray-50 z-40 w-full border-b border-gray-200">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <ul className="flex flex-wrap -mb-px tab">
          {sections?.map((meta) => {
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

export default MapHeader;
