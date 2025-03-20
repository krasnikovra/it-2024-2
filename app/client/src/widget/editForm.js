import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Checkbox from '../atom/checkbox';
import Input from '../atom/input';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';

export default class EditForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class="mb-3">
                    <Input this='_ui_input_task_name' label={t9n(defaultLang, 'task_name')} 
                        placeholder={t9n(defaultLang, 'my_task')} key="task-name" />
                </div>
                <div class="mb-3">
                    <Input this='_ui_input_deadline' label={t9n(defaultLang, 'deadline')}
                        placeholder="01.01.2025" key="deadline" />
                </div>
                <div class="mb-4">
                    <Checkbox this='_ui_checkbox' label={t9n(defaultLang, 'important_task')} key="important-task" />
                </div>
                <div class="row">
                    <div class="col">
                        <Button this='_ui_btn_cancel' text={t9n(defaultLang, 'cancel')} type="secondary" className="w-100" />
                    </div>
                    <div class="col">
                        <Button this='_ui_btn_save' text={t9n(defaultLang, 'to_save')} type="primary" className="w-100" />
                    </div>
                </div>
            </div>
        )
    }

    update = (data) => {
        const { lang = defaultLang } = data;

        this._ui_input_task_name.update({
            label: t9n(lang, 'task_name'),
            placeholder: t9n(lang, 'my_task')
        });
        this._ui_input_deadline.update({
            label: t9n(lang, 'deadline'),
        });
        this._ui_checkbox.update({
            label: t9n(lang, 'important_task')
        });
        this._ui_btn_cancel.update({
            text: t9n(lang, 'cancel')
        });
        this._ui_btn_save.update({
            text: t9n(lang, 'to_save')
        });
    }
}
