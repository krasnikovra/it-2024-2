import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Input {
    constructor(settings = {}) {
        const {
            label = '',
            placeholder = '',
            className = '',
        } = settings;

        this._prop = {
            label,
            placeholder,
            className
        }

        this.el = this._ui_render();
    }

    updateLabel = (label) => {
        // TODO:
        console.log('input. change lang', label)
    }

    _ui_render = () => {
        const { label, placeholder, className } = this._prop;
        return (
            <div>
                <label className={`form-label ${className}`}>{label}
                    <input type='text' className='form-control' placeholder={placeholder}/>
                </label>
            </div>
        )
    }
}
