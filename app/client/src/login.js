import { mount, el } from '../node_modules/redom/dist/redom.es';
import { library } from './utils/library';
import LoginForm from './widget/loginForm'

const lang = 'en'; // 'ru', 'en'

class LoginPage {
    constructor(settings = {}) {
        const {
            lang = 'ru',
        } = settings;

        this._lang = lang;

        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div className='container-md'>
                <div className='mb-3'>
                    <h1 this="_ui_h1" className='text-center'>Вход</h1>
                </div>
                <LoginForm this="_ui_login_form" />
            </div>
        );
    }

    update = () => {
        this._ui_h1.textContent = library[this._lang]['login'];
        
        const data = {
            lang: this._lang
        };
        this._ui_login_form.update(data);
    }

    onmount = () => {
        this.update();
    }
}

mount(
    document.getElementById("main"),
    <LoginPage lang={lang} />
);
