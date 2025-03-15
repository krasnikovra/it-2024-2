import { mount, el } from '../../node_modules/redom/dist/redom.es';
import LoginAndPassFrom from '../widget/loginAndPassFrom';
import Button from '../atom/button';
import t9n from '../utils/t9n/index';
import { commonEventManager } from '../utils/eventManager';

export default class LoginFrom {
    constructor(settings = {}) {
        const {
            langId = 'ru',
        } = settings;

        this._prop = {
            langId,
        };

        this.el = this._ui_render();
    }

    // Пример
    _onBtnClick = () => {
        commonEventManager.dispatch('changeLang', 'en')
    }

    _ui_render = () => {
        const { langId } = this._prop;
        return (
            <div className='d-flex flex-column'>
                <LoginAndPassFrom langId={langId} />
                <Button title={t9n(langId, 'TO_LOGIN')} className='btn btn-primary' onClick={this._onBtnClick} />
            </div>
        )
    }
}
