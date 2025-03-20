import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';

export default class LoginAndPassForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div className='mb-3'>
                    <Input this='_ui_input_email' label={t9n(defaultLang, 'email')} 
                      placeholder={t9n(defaultLang, 'somebody_email')} key="e-mail" />
                </div>
                <Input this='_ui_input_pwd' label={t9n(defaultLang, 'password')} placeholder='********' key="pwd"/>
            </div>
        )
    }

    update = (data) => {
        const { lang } = data;

        this._ui_input_email.update({
            label: t9n(lang, 'email'),
            placeholder: t9n(lang, 'somebody_email')
        });
        this._ui_input_pwd.update({
            label: t9n(lang, 'password'),
        });
    }
}
