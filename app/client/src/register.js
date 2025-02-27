import { mount, el } from '../node_modules/redom/dist/redom.es';
import RegForm from './widget/regForm'

class RegPage {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div className='container-md'>
                <div className='mb-3'>
                    <h1 className='text-center'>Регистрация</h1>
                </div>
                <RegForm/>
            </div>
        );
    }
}

mount(
    document.getElementById("main"),
    <RegPage />
);