import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Checkbox {
    constructor(settings = {}) {
        const {
            label = '',
            key = 'undefined',
        } = settings;

        this._prop = {
            label,
            key
        }

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { label, key } = this._prop;

        const inputId = `base-check-${key}`;
        return (
            <div class='form-check'>
                <label for={inputId} className='form-check-label'>{label}</label>
                <input type='checkbox' id={inputId} className='form-check-input'/>
            </div>
        )
    }
}
