import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Link from '../atom/link';
import LoginAndPassForm from './loginAndPassForm';

export default class LoginForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div className='mb-4'>
                    <LoginAndPassForm />
                    <p><small>Нет аккаунта? <Link text='Зарегистрироваться' href='./register.html'/></small></p>
                </div>
                <div className='text-center'>
                    <Button text='Войти' className='w-100' type='primary' />
                </div>
            </div>
        );
    }
}
