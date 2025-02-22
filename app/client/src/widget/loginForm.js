import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
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
                </div>
                <div className='text-center'>
                    <Button text="Войти" type="primary" />
                </div>
            </div>
        );
    }
}
