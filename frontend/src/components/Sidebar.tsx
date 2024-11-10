import React, { ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapIcon } from "./svg/map";
import { UsersIcon } from "./svg/users";
import { SettingsIcon } from "./svg/settings";
import { useTranslation } from "react-i18next";

interface ISection {
  url: string;
  title: string;
  icon: ReactElement | null;
}

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [sections, setSections] = React.useState<ISection[]>([]);

  React.useEffect(() => {
    setSections([
      {
        title: t("map"),
        url: "/",
        icon: <MapIcon />,
      } as ISection,
      {
        title: t("references"),
        url: "/reference",
        icon: <UsersIcon />,
      } as ISection,
    ]);
  }, []);

  return (
    <aside
      id="logo-sidebar"
      className="left-0 w-64 min-h-0 flex-shrink-0 bg-white border-r border-gray-200 sm:translate-x-0"
    >
      <div className="h-full px-3 pt-4 pb-4 overflow-y-auto bg-white">
        <ul className="space-y-2 font-normal">
          {sections.map((item: ISection, i: number) => {
            return (
              <li key={`item-section-${i}`}>
                <Link
                  to={item.url}
                  className={`flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group ${
                    location.pathname == item.url ? "bg-gray-100" : ""
                  }`}
                >
                  {item.icon}
                  <span className="ms-3">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-white dark:bg-gray-800 z-20 border-r border-gray-200 dark:border-gray-700">
        <a
          title={t("adminpanel")}
          href="http://127.0.0.1:8000/admin/"
          className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <SettingsIcon />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
