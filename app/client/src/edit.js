import { mount, el } from "../node_modules/redom/dist/redom.es";
import { defaultLang } from "./utils/constants.js";
import WithHeader from "./utils/withHeader.js";
import EditForm from "./widget/editForm.js";
import t9n from "./utils/t9n/index.js";

class Edit {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class="mb-3">
                    <h1 this='_ui_h1' className='text-center'>{t9n(defaultLang, 'editing')}</h1>
                </div>
                <EditForm this='_ui_edit_form' />
            </div>
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data;

        this._ui_h1.innerHTML = t9n(lang, 'editing');
        this._ui_edit_form.update(data);
    }
}

mount(
    document.getElementById("root"),
    <WithHeader authorized>
      <Edit/>
    </WithHeader>
);
