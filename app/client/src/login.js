import { mount, el } from '../node_modules/redom/dist/redom.es';
import LoginForm from './widget/loginForm';
import t9n from './utils/t9n/index';
import { defaultLang } from './utils/constants';
import WithHeader from './utils/withHeader';

class LoginPage {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div className='container-md'>
                <div className='mb-3'>
                    <h1 this="_ui_h1" className='text-center'>{t9n(defaultLang, 'login')}</h1>
                </div>
                <LoginForm this="_ui_login_form" />
            </div>
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data;

        this._ui_h1.textContent = t9n(lang, 'login');
        this._ui_login_form.update(data);
    }
}

mount(
    document.getElementById("root"),
    <WithHeader>
        <LoginPage />
    </WithHeader>
);
