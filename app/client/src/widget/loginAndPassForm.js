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
                <Input this='_ui_input_pwd' label={t9n(defaultLang, 'password')} placeholder='********' type='password' key="pwd"/>
            </div>
        )
    }

    validate = (lang) => {
        const login = this.get_login();
        const password = this.get_password();

        let valid = true;
        if (login.trim() === '') {
            this.invalidateLogin(
                t9n(lang, 'enter_nonempty_login')
            );
            valid = false;
        } else {
            this.removeInvalidityOfLogin();
        }

        if (password.trim() === '') {
            this.invalidatePassword(
                t9n(lang, 'enter_nonempty_password')
            );
            valid = false;
        } else {
            this.removeInvalidityOfPassword();
        }

        return valid;
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

        this.removeInvalidityOfLogin();
        this.removeInvalidityOfPassword();
    }

    get_login = () => this._ui_input_email.get_value();

    get_password = () => this._ui_input_pwd.get_value();

    invalidateLogin = (text = '') => this._ui_input_email.invalidate(text);

    removeInvalidityOfLogin = () => this._ui_input_email.removeInvalidity();

    invalidatePassword = (text = '') => this._ui_input_pwd.invalidate(text);

    removeInvalidityOfPassword= () => this._ui_input_pwd.removeInvalidity();
}
