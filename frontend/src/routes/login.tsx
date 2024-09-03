import { useLoginMutation } from "../domain/store/api/auth";
import "./login.scss";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../domain/interfaces/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginApi] = useLoginMutation({});

  return (
    <div className="login">
      <div className="left">
        <h1 className="title">FLOOD ANALITIC</h1>
      </div>
      <div className="right">
        <div id="contentWrapper">
          <div id="content">
            <div id="header" className="text-center py-4 text-2xl">
              Вход в систему
            </div>
            <div id="workArea">
              <div id="authArea" className="mt-6">
                <div id="loginArea">
                  <div id="loginMessage" className="mt-4 text-lg">
                    Выполнить вход, используя учетную запись
                  </div>
                  <Formik
                    initialValues={{
                      username: "",
                      password: "",
                    }}
                    onSubmit={(
                      values: ILogin,
                      { setSubmitting }: FormikHelpers<ILogin>
                    ) => {
                      if (values.username != "" && values.password != "") {
                        let form = new FormData();
                        form.append("username", values.username);
                        form.append("password", values.password);

                        setSubmitting(false);

                        loginApi({
                          form: form,
                        })
                          .then((response) => {
                            if (response.data) {
                              if (!response.data) {
                              } else {
                                if (navigate) {
                                  localStorage.setItem(
                                    "token",
                                    response.data.access_token
                                  );

                                  navigate("/");
                                }
                              }
                            }

                            if (response.error) {
                              alert("Не верный логин или пароль");
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          })
                          .finally(() => {
                            setSubmitting(true);
                          });
                      }
                    }}
                  >
                    <Form>
                      <div id="error" className="hidden text-red-600 text-sm">
                        <span id="errorText"></span>
                      </div>
                      <div id="formsAuthenticationArea">
                        <div id="userNameArea">
                          <label
                            id="userNameInputLabel"
                            htmlFor="userNameInput"
                            className="sr-only"
                          >
                            Учетная запись пользователя
                          </label>
                          <Field
                            id="username"
                            name="username"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Логин"
                            autoComplete="off"
                          />
                        </div>
                        <div id="passwordArea" className="mt-4">
                          <label
                            id="passwordInputLabel"
                            htmlFor="passwordInput"
                            className="sr-only"
                          >
                            Пароль
                          </label>
                          <Field
                            id="password"
                            name="password"
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Пароль"
                            autoComplete="off"
                          />
                        </div>
                        <div id="kmsiArea" className="hidden mt-2">
                          <input
                            type="checkbox"
                            name="Kmsi"
                            id="kmsiInput"
                            value="true"
                          />
                          <label htmlFor="kmsiInput">
                            Оставаться в системе
                          </label>
                        </div>
                        <div id="submissionArea" className="mt-4">
                          <button type="submit" id="submitButton">
                            Вход
                          </button>
                        </div>
                      </div>
                      <input
                        id="optionForms"
                        type="hidden"
                        name="AuthMethod"
                        value="FormsAuthentication"
                      />
                    </Form>
                  </Formik>
                  <div id="introduction" className="mt-6"></div>
                </div>
              </div>
            </div>
            <div id="footerPlaceholder"></div>
          </div>
          <div id="footer" className="bg-gray-100 p-4">
            <div id="footerLinks" className="text-right">
              <div>
                <span id="copyright">v 1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
