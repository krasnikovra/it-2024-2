import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Input from '../atom/input';

export default class LoginAndPassForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div className='mb-3'>
                    <Input className='w-100' label='E-mail' placeholder='somebody@gmail.com'/>
                </div>
                <Input className='w-100' label='Пароль' placeholder='********'/>
            </div>
        )
    }
}
