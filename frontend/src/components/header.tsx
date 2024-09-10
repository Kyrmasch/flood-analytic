import { useRef } from "react";
import { useUser } from "../domain/contexts/UserContext";
import DialogYesNo, { IDialogYesNoRef } from "./dialogs/dialogYesNo";
import { useAppDispatch } from "../domain/store/hook";
import { setToken } from "../domain/store/slices/baseSlice";
import { useNavigate } from "react-router-dom";

function Header() {
  const user = useUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dialogYesNoRef = useRef<IDialogYesNoRef>(null);

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
    <header>
      <nav className="fixed top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-2">
          <a href="https://flowbite.com" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap ">
              Flood
            </span>
          </a>
          <div className="flex items-center space-x-6">
            <div className="text-[1em] font-semibold text-primary hidden sm:block">
              {user && user.username}
            </div>
            <button
              onClick={logOut}
              className="text-[1em] font-semibold text-primary-600 hover:underline hidden sm:block"
            >
              Выход
            </button>
          </div>
        </div>
      </nav>
      <nav className="bg-gray-50 fixed top-[2.8rem] z-40 w-full border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <ul className="flex space-x-8 text-gray-900 ">
            <li>
              <a href="#" className="hover:underline">
                Главная
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Участки
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Водоемы
              </a>
            </li>
          </ul>
          <div
            id="dropdown"
            className="hidden absolute bg-white shadow-lg rounded-lg mt-2 py-2"
          >
            <ul className="text-sm text-gray-700 ">
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Resources
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <DialogYesNo ref={dialogYesNoRef} />
    </header>
  );
}

export default Header;
