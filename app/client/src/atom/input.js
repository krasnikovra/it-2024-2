import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Input {
    constructor(settings = {}) {
        const {
            label = '',
            placeholder = '',
            className = '',
            key = 'undefined',
        } = settings;

        this._prop = {
            label,
            placeholder,
            className,
            key
        }

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { label, placeholder, className, key } = this._prop;
        
        const inputId = `base-input-${key}`;
        return (
            <div>
                <label for={inputId} className={`form-label ${className}`}>{label}</label>
                <input type='text' id={inputId} className='form-control' placeholder={placeholder}/>
            </div>
        )
    }
}
