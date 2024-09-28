import { Modal, ModalInterface } from "flowbite";
import React, { ReactNode, forwardRef, useImperativeHandle } from "react";

import "./DialogYesNo.scss";
import { IDialog } from "../../domain/interfaces/dialog";
import { CloseModalIcon } from "../svg/closeModal";

export interface IDialogYesNo {
  question: string | ReactNode;
  title: string;
  yes: () => void;
  not: () => void;
}

export interface IDialogYesNoRef {
  open: (options: IDialogYesNo) => void;
}

const DialogYesNo = forwardRef<IDialogYesNoRef, IDialog>((props, ref) => {
  const [dialog, setDialog] = React.useState<ModalInterface | null>(null);
  const [settings, setSettings] = React.useState<IDialogYesNo | null>(null);

  useImperativeHandle(ref, () => ({
    open: open,
  }));

  React.useEffect(() => {
    if (props) {
    }

    if (!dialog) {
      setDialog(
        new Modal(document.getElementById("global-yes-no-dialog"), {
          backdrop: "static",
          closable: false,
          backdropClasses: "_blur",
        })
      );
    }
  }, []);

  const open = (options: IDialogYesNo) => {
    setSettings(options);
    if (dialog) {
      dialog.show();
    }
  };

  const yesHandler = () => {
    if (dialog) {
      dialog.hide();
      settings?.yes();
    }
  };

  const noHandler = () => {
    if (dialog) {
      dialog.hide();
      setSettings(null);
      settings?.not();
    }
  };

  return (
    <>
      <div
        id="global-yes-no-dialog"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 hidden w-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="container">
          <div className="dialog">
            <div className="head">
              <h3 className="title">{settings?.title}</h3>
              <button onClick={noHandler} type="button">
                <CloseModalIcon className="w-3 h-3" />
                <span className="sr-only">Закрыть</span>
              </button>
            </div>
            <div className="question">
              <p className="text">{settings?.question}</p>
            </div>
            <div className={["actions", "bg-[#ECF0F1] py-[1rem]"].join(" ")}>
              <button
                onClick={yesHandler}
                type="button"
                className={[`bg-primary hover:ring-primary/50`, "yes"].join(
                  " "
                )}
              >
                Да
              </button>
              <button onClick={noHandler} type="button" className="no">
                Нет
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default DialogYesNo;
