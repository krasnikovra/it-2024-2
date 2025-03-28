import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Link from '../atom/link';
import LoginAndPassForm from './loginAndPassForm';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';
import fake_fetch from '../api/index';
import responseStatus from '../api/status';
import localStorageItems from '../utils/localStorageItems';

export default class LoginForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div className='mb-4'>
                    <LoginAndPassForm this='_ui_login_and_pass_form' />
                    <p>
                        <small>
                            <span this='_ui_span'>{t9n(defaultLang, 'no_account_question')}</span>&nbsp;
                            <Link this='_ui_link' text={t9n(defaultLang, 'to_register')} href='./register.html' />
                        </small>
                    </p>
                </div>
                <div className='text-center'>
                    <Button this='_ui_button' text={t9n(defaultLang, 'to_login')}
                        onClick={this._get_on_btn_click(defaultLang)} className='w-100' type='primary' />
                </div>
            </div>
        );
    }

    _get_on_btn_click = (lang) => {
        return async () => {
            const login = this._ui_login_and_pass_form.get_login();
            const password = this._ui_login_and_pass_form.get_password();

            this._ui_button.start_loading(
                t9n(lang, 'loading', 'em')
            );
            const response = await fake_fetch('/api/v1/login', { login, password });
            this._ui_button.end_loading(
                t9n(lang, 'to_login')
            );

            const { status, detail } = response;
            if (status === responseStatus.ok) {
                const { token } = detail
                localStorage.setItem(localStorageItems.token, token);
                window.location.href = './edit.html';
            } else {
                const { error } = detail;
                console.error('status', status, 'error', error);
            }
        }
    }

    update = (data) => {
        const { lang } = data;

        this._ui_login_and_pass_form.update(data);
        this._ui_link.update({
            text: t9n(lang, 'to_register'),
        });
        this._ui_span.textContent = t9n(lang, 'no_account_question');
        this._ui_button.update({
            text: t9n(lang, 'to_login'),
            onClick: this._get_on_btn_click(lang)
        });
    }

}
