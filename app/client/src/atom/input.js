import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Input {
    constructor(settings = {}) {
        const {
            label = '',
            placeholder = '',
            key = 'undefined',
        } = settings;

        this._prop = {
            label,
            placeholder,
            key
        }

        this.el = this._ui_render();
    }

    updateLabel = (label) => {
        // TODO:
        console.log('input. change lang', label)
    }

    _ui_render = () => {
        const { label, placeholder, key } = this._prop;

        const inputId = `base-input-${key}`;
        return (
            <div>
                <label this='_ui_label' for={inputId} className='form-label'>{label}</label>
                <input this='_ui_input' type='text' id={inputId} className='form-control' placeholder={placeholder}/>
            </div>
        )
    }

    update = (data) => {
        const {
            label = this._prop.label,
            placeholder = this._prop.placeholder
        } = data;

        this._ui_label.textContent = label;
        this._ui_input.placeholder = placeholder;
    }
}
