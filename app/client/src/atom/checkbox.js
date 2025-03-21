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
                <label this='_ui_label' for={inputId} className='form-check-label'>{label}</label>
                <input type='checkbox' id={inputId} className='form-check-input' />
            </div>
        )
    }

    update = (data) => {
        const {
            label = this._prop.label,
        } = data;

        if (label !== this._prop.label) {
            this._ui_label.textContent = label;
        }

        this._prop = { ...this._prop, label };
    }
}
