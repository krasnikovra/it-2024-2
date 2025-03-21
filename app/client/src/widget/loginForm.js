import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Link from '../atom/link';
import LoginAndPassForm from './loginAndPassForm';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';

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
        const toggleBtnLabel = (secLeft) => {
            setTimeout(() => {
                if (secLeft > 0) {
                    this._ui_button.update({ text: t9n(lang, 'loading_n_seconds_left', 'em', secLeft) });
                    toggleBtnLabel(secLeft - 1);
                } else {
                    this._ui_button.endLoading(t9n(lang, 'to_login'));
                }
            }, 1000);
        }

        const sec = 3;
        return () => {
            this._ui_button.startLoading(
                t9n(lang, 'loading_n_seconds_left', 'em', sec)
            );
            toggleBtnLabel(sec - 1);
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
