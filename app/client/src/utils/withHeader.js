import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Header from '../widget/header';
import LocalizedPage from './localizedPage';

export default class WithHeader extends LocalizedPage {
    constructor(settings = {}, elem) {
        super();

        const { authorized = false } = settings;

        this._prop = {
            authorized
        };

        this._ui_elem = elem;
        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { authorized } = this._prop;

        return (
            <div className='app-body'>
                <Header this='_ui_header' authorized={authorized} />
                <div className='container centered'>
                    {this._ui_elem}
                </div>
            </div>
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data;
        this._ui_header.update(data);
        this._ui_elem.update(data);
    }
};
