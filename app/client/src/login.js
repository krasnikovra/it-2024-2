import { mount, el } from "../node_modules/redom/dist/redom.es";
import FormHeader from "./components/forms/FormHeader.jsx";
import FormInput from "./components/forms/FormInput.jsx";
import FormSwitchLabel from "./components/forms/FormSwitchLabel.jsx";
import FormButtonPrimary from "./components/forms/FormButtonPrimary.jsx";

const Login =
  <div class="container-md">
    <div class="mb-3">
      <FormHeader text="Вход"/>
    </div>
    <div class="mb-3">
      <FormInput label="E-mail" placeholder="somebody@gmail.com"/>
    </div>
    <div class="mb-4">
      <FormInput label="Пароль" placeholder="********"/>
      <FormSwitchLabel text="Нет аккаунта?" linkText="Зарегистрироваться" link="./register.html"/>
    </div>
    <FormButtonPrimary text="Войти"/>
  </div>;

mount(
    document.getElementById("main"),
    Login
);
