import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Input {
    constructor(settings = {}) {
        const {
            label = '',
            placeholder = '',
        } = settings;

        this._prop = {
            label,
            placeholder
        }

        this.el = this._ui_render();
    }

    updateLabel = (label) => {
        // TODO:
        console.log('input. change lang', label)
    }

    _ui_render = () => {
        const { label, placeholder } = this._prop;
        return (
            <div>
                <label className='form-label'>{label}
                    <input type='text' className='form-control' placeholder={placeholder}/>
                </label>
            </div>
        )
    }
}
