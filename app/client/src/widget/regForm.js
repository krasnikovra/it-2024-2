import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';
import Link from '../atom/link';
import Button from '../atom/button';
import LoginAndPassForm from '../widget/loginAndPassForm';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';
import fake_fetch from '../api/index';
import responseStatus from '../api/status';
import { error as regError } from '../api/register';

export default class RegFrom {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div>
                    <div className='mb-3'>
                        <LoginAndPassForm this='_ui_login_and_pass_form' />
                    </div>
                    <Input this='_ui_input_repeat_pwd' label={t9n(defaultLang, 'repeat_password')} type='password'
                        placeholder='********' />
                    <div className="my-2 text-center">
                        <small>
                            <span this='_ui_span'>{t9n(defaultLang, 'already_have_account_question')}</span>&nbsp;
                            <Link this='_ui_link' text={t9n(defaultLang, 'to_login')} href='./login.html' />
                        </small>
                    </div>
                </div>
                <div className='text-center'>
                    <Button this='_ui_button' text={t9n(defaultLang, 'to_register')} className='w-100' type='primary'
                        onClick={this._get_on_btn_click(defaultLang)} />
                </div>
            </div>
        )
    }

    _get_on_btn_click = (lang) => {
        return async () => {
            if (!this._validate(lang)) {
                return;
            }

            const login = this._ui_login_and_pass_form.get_login();
            const password = this._ui_login_and_pass_form.get_password();
            const passwordRepeat = this._ui_input_repeat_pwd.get_value();

            this._ui_button.start_loading(
                t9n(lang, 'loading', 'em')
            );
            const response = await fake_fetch('/api/v1/register', { login, password, passwordRepeat });
            this._ui_button.end_loading(
                t9n(lang, 'to_register')
            );

            const { status, detail } = response;
            if (status === responseStatus.ok) {
                window.location.href = './login.html';
            } else {
                const { error } = detail;

                switch (error) {
                    case regError.emptyLogin:
                        this._ui_login_and_pass_form.invalidateLogin(
                            t9n(lang, 'enter_nonempty_login')
                        );
                        this._ui_login_and_pass_form.removeInvalidityOfPassword();
                        this._ui_input_repeat_pwd.removeInvalidity();
                        break;
                    case regError.emptyPwd:
                        this._ui_login_and_pass_form.invalidatePassword(
                            t9n(lang, 'enter_nonempty_password')
                        );
                        this._ui_login_and_pass_form.removeInvalidityOfLogin();
                        this._ui_input_repeat_pwd.removeInvalidity();
                        break;
                    case regError.emptyPwdRepeat:
                        this._ui_login_and_pass_form.removeInvalidityOfLogin();
                        this._ui_login_and_pass_form.removeInvalidityOfPassword();
                        this._ui_input_repeat_pwd.invalidate(
                            t9n(lang, 'enter_nonempty_password')
                        );
                        break;
                    case regError.loginAlreadyRegistered:
                        this._ui_login_and_pass_form.invalidateLogin(
                            t9n(lang, 'login_already_registered')
                        );
                        this._ui_login_and_pass_form.removeInvalidityOfPassword();
                        this._ui_input_repeat_pwd.removeInvalidity();
                        break;
                }
            }
        }
    }

    _validate = (lang) => {
        let valid = this._ui_login_and_pass_form.validate(lang);

        const password = this._ui_login_and_pass_form.get_password();
        const passwordRepeat = this._ui_input_repeat_pwd.get_value();

        if (password !== passwordRepeat) {
            this._ui_login_and_pass_form.invalidatePassword();
            this._ui_input_repeat_pwd.invalidate(
                t9n(lang, 'passwords_are_not_equal')
            );
            valid = false;
        } else {
            if (valid) {
                this._ui_login_and_pass_form.removeInvalidityOfPassword();
            }
            this._ui_input_repeat_pwd.removeInvalidity();
        }

        return valid;
    }

    update = (data) => {
        const { lang = defaultLang } = data;

        this._ui_login_and_pass_form.update(data);
        this._ui_input_repeat_pwd.update({
            label: t9n(lang, 'repeat_password')
        });
        this._ui_span.innerHTML = t9n(lang, 'already_have_account_question');
        this._ui_link.update({
            text: t9n(lang, 'to_login')
        });
        this._ui_button.update({
            text: t9n(lang, 'to_register'),
            onClick: this._get_on_btn_click(lang)
        })
    }
}
