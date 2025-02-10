import { mount, el } from "../node_modules/redom/dist/redom.es";
import FormHeader from "./components/forms/FormHeader.jsx";
import FormInput from "./components/forms/FormInput.jsx";
import FormSwitchLabel from "./components/forms/FormSwitchLabel.jsx";
import FormButtonPrimary from "./components/forms/FormButtonPrimary.jsx";

const Register =
  <div class="container-md">
    <div class="mb-3">
      <FormHeader text="Регистрация"/>
    </div>
    <div class="mb-3">
      <FormInput label="E-mail" placeholder="somebody@gmail.com"/>
    </div>
    <div class="mb-3">
      <FormInput label="Пароль" placeholder="********"/>
    </div>
    <div class="mb-4">
      <FormInput label="Повторите пароль" placeholder="********"/>
      <FormSwitchLabel text="Уже есть аккаунт?" linkText="Войти" link="./login.html"/>
    </div>
    <FormButtonPrimary text="Зарегистрироваться"/>
  </div>;

mount(
    document.getElementById("main"),
    Register
);
