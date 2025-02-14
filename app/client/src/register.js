import { mount, el } from "../node_modules/redom/dist/redom.es";
import FormHeader from "./components/forms/FormHeader.jsx";
import FormInput from "./components/forms/FormInput.jsx";
import FormSwitchLabel from "./components/forms/FormSwitchLabel.jsx";
import FormButton from "./components/forms/FormButton.jsx";

const Register =
  <div class="container-md">
    <div class="mb-3">
      <FormHeader text="Регистрация"/>
    </div>
    <div class="mb-3">
      <FormInput label="E-mail" placeholder="somebody@gmail.com" key="email"/>
    </div>
    <div class="mb-3">
      <FormInput label="Пароль" placeholder="********" key="pwd"/>
    </div>
    <div class="mb-4">
      <FormInput label="Повторите пароль" placeholder="********" key="pwd-repeat"/>
      <FormSwitchLabel text="Уже есть аккаунт?" linkText="Войти" link="./login.html"/>
    </div>
    <FormButton text="Зарегистрироваться" type="primary"/>
  </div>;

mount(
    document.getElementById("main"),
    Register
);
