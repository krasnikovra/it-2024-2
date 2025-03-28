import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Button {
    constructor(settings = {}) {
        const {
            text = '',
            icon = null,
            type = 'primary', // 'primary', 'secondary'
            disabled = false,
            onClick = (e) => { console.log("clicked button", e.target); },
            className = '',
        } = settings;

        this._prop = {
            text,
            icon,
            type,
            disabled,
            loading: false,
            onClick,
            className,
        };

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { text, icon, type, disabled, onClick, className } = this._prop;

        return (
            <button this='_ui_button' className={`btn btn-${type} ${className}`}
                onclick={onClick} disabled={disabled}>
                {this._ui_icon(icon)}
                <span this='_ui_span'>{text}</span>
            </button>
        );
    }

    _ui_icon = (icon) => {
        return icon ? <i className={`bi bi-${icon} me-2`}></i> : null;
    }

    _ui_spinner = () => {
        return <span className='spinner-border spinner-border-sm me-2' />
    }

    start_loading = (loadingLabel) => { 
        this.update({ disabled: true, text: loadingLabel, loading: true });
    }

    end_loading = (label) => {
        this.update({ disabled: false, text: label, loading: false });
    }

    update = (data) => {
        const {
            text = this._prop.text,
            icon = this._prop.icon,
            type = this._prop.type,
            disabled = this._prop.disabled,
            loading = this._prop.loading,
            onClick = this._prop.onClick,
            className = this._prop.className
        } = data;

        if (loading !== this._prop.loading) {
            if (this._ui_button.childNodes.length > 1) {
                const childToRemove = this._ui_button.childNodes[0];
                this._ui_button.removeChild(childToRemove);
            }
            const child = loading ? this._ui_spinner() : this._ui_icon(icon);
            child && this._ui_button.insertBefore(child, this._ui_span);
        }
        if (icon !== this._prop.icon) {
            if (this._ui_button.childNodes.length > 1) {
                const childToRemove = this._ui_button.childNodes[0];
                this._ui_button.removeChild(childToRemove);
            }
            const child = this._ui_icon(icon);
            child && this._ui_button.insertBefore(this._ui_icon(icon), this._ui_span);
        }
        if (text !== this._prop.text) {
            const spanBody = <div>{text}</div>;
            this._ui_span.innerHTML = spanBody.innerHTML;
        }
        if (className !== this._prop.className) {
            this._ui_button.className = `btn btn-${type} ${className}`;
        }
        if (disabled !== this._prop.disabled) {
            this._ui_button.disabled = disabled;
        }
        if (onClick !== this._prop.onClick) {
            this._ui_button.onclick = onClick;
        }

        this._prop = { ...this._prop, text, icon, type, disabled, loading, onClick, className };
    }
}
