import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Link from '../atom/link';
import { library } from '../utils/library';
import LoginAndPassForm from './loginAndPassForm';

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
                            <span this='_ui_span'>Нет аккаунта?</span>&nbsp;
                            <Link this='_ui_link' text='Зарегистрироваться' href='./register.html' />
                        </small>
                    </p>
                </div>
                <div className='text-center'>
                    <Button this='_ui_button' text='Войти' className='w-100' type='primary' />
                </div>
            </div>
        );
    }

    update = (data) => {
        const { lang } = data;

        this._ui_login_and_pass_form.update(data);
        this._ui_link.update({
            text: library[lang]['to_register'],
        });
        this._ui_span.textContent = library[lang]['no_account_question'];
        this._ui_button.update({
            text: library[lang]['to_login']
        });
    }
}
