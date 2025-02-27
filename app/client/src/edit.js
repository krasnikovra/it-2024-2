import { mount, el } from "../node_modules/redom/dist/redom.es";
import mountWithHeader from "./utils/mountWithHeader.js";
import EditForm from "./widget/editForm.js";

class Edit {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class="mb-3">
                    <h1 className='text-center'>Редактирование</h1>
                </div>
                <EditForm />
            </div>
        );
    }
}

mountWithHeader(
    document.getElementById("root"),
    <Edit />
);
