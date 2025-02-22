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
            <a href={href}>{text}</a>
        );
    }
}
