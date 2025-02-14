import { mount, el } from "../node_modules/redom/dist/redom.es";
import FormHeader from "./components/forms/FormHeader.jsx";
import FormInput from "./components/forms/FormInput.jsx";
import FormButton from "./components/forms/FormButton.jsx";
import FormCheckbox from "./components/forms/FormCheckbox.jsx";

const Edit =
  <div class="container-md">
    <div class="mb-3">
      <FormHeader text="Редактирование"/>
    </div>
    <div class="mb-3">
      <FormInput label="Название задачи" placeholder="Моя задача"/>
    </div>
    <div class="mb-3">
      <FormInput label="Дедлайн" placeholder="01.01.2025"/>
    </div>
    <div class="mb-4">
      <FormCheckbox label="Важная задача" key="important-task" />
    </div>
    <div class="row">
      <div class="col">
        <FormButton text="Отмена" type="secondary"/>
      </div>
      <div class="col">
        <FormButton text="Сохранить" type="primary"/>
      </div>
    </div>
  </div>;

mount(
    document.getElementById("main"),
    Edit
);
