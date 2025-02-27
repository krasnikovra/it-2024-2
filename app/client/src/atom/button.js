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

        const iconRendered = icon ? <i className={`bi bi-${icon}`}></i> : null;

        return (
            <button this='_ui_button' className={`btn btn-${type} ${className}`}>
                {iconRendered}
                {text}
            </button>
        );
    }

    update = (data) => {
        const {
            text = this._prop.text,
            icon = this._prop.icon,
            type = this._prop.type,
            className = this._prop.className
        } = data;

        const iconRendered = icon ? <i className={`bi bi-${icon}`}></i> : null;

        this._ui_button.innerHTML = `${iconRendered ?? ''}${text}`;
        this._ui_button.className = `btn btn-${type} ${className}`;
    }
}
