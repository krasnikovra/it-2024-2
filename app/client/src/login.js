import { mount, el } from '../node_modules/redom/dist/redom.es';
import LoginForm from './widget/loginForm'

const lang = 'ru'; // 'ru', 'en'

class LoginPage {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div className='container-md'>
                <div className='mb-3'>
                    <h1 className='text-center'>Вход</h1>
                </div>
                <LoginForm />
            </div>
        );
    }
}

mount(
    document.getElementById("main"),
    <LoginPage />
);
