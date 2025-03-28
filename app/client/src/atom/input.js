import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Input {
    constructor(settings = {}) {
        const {
            label = '',
            placeholder = '',
            type = 'text',
            key = 'undefined',
        } = settings;

        this._prop = {
            label,
            placeholder,
            type,
            key
        }

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { label, placeholder, type, key } = this._prop;

        const inputId = `base-input-${key}`;
        return (
            <div>
                <label this='_ui_label' for={inputId} className='form-label'>{label}</label>
                <input this='_ui_input' type={type} id={inputId} className='form-control' placeholder={placeholder} />
            </div>
        )
    }

    update = (data) => {
        const {
            label = this._prop.label,
            placeholder = this._prop.placeholder,
            type = this._prop.type
        } = data;

        if (label !== this._prop.label) {
            this._ui_label.textContent = label;
        }
        if (placeholder !== this._prop.placeholder) {
            this._ui_input.placeholder = placeholder;
        }
        if (type !== this._prop.type) {
            this._ui_input.type = type;
        }
        
        this._prop = { ...this.prop, label, placeholder, type };
    }

    get_value = () => this._ui_input.value;
}
