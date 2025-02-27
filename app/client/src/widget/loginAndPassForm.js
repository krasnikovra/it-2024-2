import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';
import { library } from '../utils/library';

export default class LoginAndPassForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div className='mb-3'>
                    <Input this='_ui_input_email' label='E-mail' placeholder='somebody@gmail.com' key="e-mail"/>
                </div>
                <Input this='_ui_input_pwd' label='Пароль' placeholder='********' key="pwd"/>
            </div>
        )
    }

    update = (data) => {
        const { lang } = data;

        this._ui_input_email.update({
            label: library[lang]['email'],
            placeholder: library[lang]['somebody_email']
        });
        this._ui_input_pwd.update({
            label: library[lang]['password'],
        });
    }
}
