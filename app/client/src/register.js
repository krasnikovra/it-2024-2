import { mount, el } from '../node_modules/redom/dist/redom.es';
import { defaultLang } from './utils/constants';
import t9n from './utils/t9n/index';
import WithHeader from './utils/withHeader';
import RegForm from './widget/regForm';
import localStorageItems from './utils/localStorageItems';

class RegPage {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div className='container-md'>
                <div className='mb-3'>
                    <h1 this='_ui_h1' className='text-center'>{t9n(defaultLang, 'registration')}</h1>
                </div>
                <RegForm this='_ui_reg_form' />
            </div>
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data;

        this._ui_h1.innerHTML = t9n(lang, 'registration');
        this._ui_reg_form.update(data);
    }

    onmount = () => {
        const token = localStorage.getItem(localStorageItems.token);
        if (token) {
            window.location.href = './edit.html';
        }
    }
}

mount(
    document.getElementById("root"),
    <WithHeader>
        <RegPage />
    </WithHeader>
);
