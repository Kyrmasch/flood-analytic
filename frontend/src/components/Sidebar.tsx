import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { MapIcon } from "./svg/map";
import { UsersIcon } from "./svg/users";
import { SettingsIcon } from "./svg/settings";

interface ISection {
  url: string;
  title: string;
  icon: ReactElement | null;
}

const Sidebar = () => {
  const [sections, setSections] = React.useState<ISection[]>([]);

  React.useEffect(() => {
    setSections([
      {
        title: "Карта",
        url: "/",
        icon: <MapIcon />,
      } as ISection,
      {
        title: "Справочники",
        url: "/reference",
        icon: <UsersIcon />,
      } as ISection,
      {
        title: "Администрирование",
        url: "http://127.0.0.1:8000/admin/",
        icon: <SettingsIcon />,
      } as ISection,
    ]);
  }, []);

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-30 w-64 h-screen pt-[3.5rem] transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 "
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pt-4 pb-4 overflow-y-auto bg-gray-50 ">
        <ul className="space-y-2 font-normal">
          {sections.map((item: ISection, i: number) => {
            return (
              <li key={`item-section-${i}`}>
                <Link
                  to={item.url}
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                >
                  {item.icon}
                  <span className="ms-3">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
