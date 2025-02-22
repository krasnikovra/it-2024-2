import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';
import Link from '../atom/link';
import Button from '../atom/button';
import LoginAndPassForm from '../widget/loginAndPassForm';

export default class RegFrom {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class='mb-4'>
                    <div className='mb-3'>
                        <LoginAndPassForm />
                    </div>
                    <Input label='Повторите пароль' placeholder='********' />
                    <p><small>Уже есть аккаунт? <Link text='Войти' href='./login.html' /></small></p>
                </div>
                <div className='text-center'>
                    <Button text='Зарегистрироваться' className='w-100' type='primary' />
                </div>
            </div>
        )
    }
}
