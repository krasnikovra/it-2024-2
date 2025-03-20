import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Button {
    constructor(settings = {}) {
        const {
            text = '',
            icon = null,
            type = 'primary', // 'primary', 'secondary'
            className = '',
        } = settings;

        this._prop = {
            text,
            icon,
            type,
            className,
        };

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { text, icon, type, className } = this._prop;

        return (
            <button this='_ui_button' className={`btn btn-${type} ${className}`}>
                {this._ui_icon(icon)}
                {text}
            </button>
        );
    }

    _ui_icon = (icon) => {
        return icon ? <i className={`bi bi-${icon}`}></i> : null;
    }

    update = (data) => {
        const {
            text = this._prop.text,
            icon = this._prop.icon,
            type = this._prop.type,
            className = this._prop.className
        } = data;

        this._ui_button.innerHTML = `${this._ui_icon(icon) ?? ''}${text}`;
        this._ui_button.className = `btn btn-${type} ${className}`;
    }
}
