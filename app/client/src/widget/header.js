import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import SelectLang from './selectLang';
import { defaultLang } from '../utils/constants';
import t9n from '../utils/t9n/index';

export default class Header {
    constructor(settings = {}) {
        const { authorized = false } = settings;

        this._prop = { authorized };

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { authorized } = this._prop;

        return (
            <div class="header">
                <h1 this='_ui_h1' className='me-5'>{t9n(defaultLang, 'task_manager')}</h1>
                <div>
                    <SelectLang this='_ui_select' />
                </div>
                { authorized && 
                    <Button this='_ui_btn' type="button" className='ms-auto' text={t9n(defaultLang, 'to_log_out')} /> }
            </div>
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data; 

        this._ui_select.update(data);
        this._ui_h1.textContent = t9n(lang, 'task_manager');
        this._ui_btn && this._ui_btn.update({
            text: t9n(lang, 'to_log_out')
        });
    }
}
