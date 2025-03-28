import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Link {
    constructor(settings = {}) {
        const {
            text = '',
            href = '',
        } = settings;

        this._prop = {
            text,
            href
        };

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { text, href } = this._prop;

        return (
            <a this='_ui_a' href={href}>{text}</a>
        );
    }

    update = (data) => {
        const {
            text = this._prop.text,
            href = this._prop.href
        } = data;

        if (text !== this._prop.text) {
            this._ui_a.textContent = text;
        }
        if (href !== this._prop.href) {
            this._ui_a.href = href;
        }

        this._prop = { ...this._prop, text, href };
    }
}
