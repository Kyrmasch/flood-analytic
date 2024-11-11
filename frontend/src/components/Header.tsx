import { useRef } from "react";
import { useUser } from "../domain/contexts/UserContext";
import DialogYesNo, { IDialogYesNoRef } from "./dialogs/DialogYesNo";
import { useAppDispatch } from "../domain/store/hook";
import { setToken } from "../domain/store/slices/baseSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Header() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dialogYesNoRef = useRef<IDialogYesNoRef>(null);
  const { t } = useTranslation();

  const logOut = () => {
    dialogYesNoRef.current?.open({
      title: "Выход",
      question: "Вы действительно хотите выйти?",
      yes: () => {
        dispatch(setToken(null));
        navigate("/login");
      },
      not: () => {},
    });
  };

  return (
    <header className="relative">
      <nav className="top-0 w-full bg-white border-b border-gray-200">
        <div className="flex justify-between items-center mx-auto px-4 py-2">
          <a href="https://flowbite.com" className="flex items-center">
            <span className="self-center text-xl font-medium whitespace-nowrap ">
              Flood Analytic
            </span>
          </a>
          <div className="flex items-center space-x-6">
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
              <span className="font-medium text-gray-600">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={logOut}
              className="text-[1em] font-normal text-primary-600 hover:underline hidden sm:block"
            >
              {t("signout")}
            </button>
          </div>
        </div>
      </nav>
      <DialogYesNo ref={dialogYesNoRef} />
    </header>
  );
}

export default Header;
