import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';
import Link from '../atom/link';
import Button from '../atom/button';
import LoginAndPassForm from '../widget/loginAndPassForm';
import t9n from '../utils/t9n/index';
import { defaultLang } from '../utils/constants';

export default class RegFrom {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class='mb-4'>
                    <div className='mb-3'>
                        <LoginAndPassForm this='_ui_login_and_pass_form' />
                    </div>
                    <Input this='_ui_input_repeat_pwd' label={t9n(defaultLang, 'repeat_password')} placeholder='********' />
                    <p>
                        <small>
                            <span this='_ui_span'>{t9n(defaultLang, 'already_have_account_question')}</span>&nbsp;
                            <Link this='_ui_link' text={t9n(defaultLang, 'to_login')} href='./login.html' />
                        </small>
                    </p>
                </div>
                <div className='text-center'>
                    <Button this='_ui_btn' text={t9n(defaultLang, 'to_register')} className='w-100' type='primary' />
                </div>
            </div>
        )
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
        this._ui_btn.update({
            text: t9n(lang, 'to_register')
        })
    }
}
