import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Header {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div class="header">
                <h1>Менеджер задач</h1>
                <button type="button" class="btn">Выход</button>
            </div>
        );
    }
}
