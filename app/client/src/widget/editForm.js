import { mount, el } from '../../node_modules/redom/dist/redom.es';
import Button from '../atom/button';
import Checkbox from '../atom/checkbox';
import Input from '../atom/input';

export default class EditForm {
    constructor() {
        this.el = this._ui_render();
    }

    _ui_render = () => {
        return (
            <div>
                <div class="mb-3">
                    <Input label="Название задачи" placeholder="Моя задача" key="task-name" />
                </div>
                <div class="mb-3">
                    <Input label="Дедлайн" placeholder="01.01.2025" key="deadline" />
                </div>
                <div class="mb-4">
                    <Checkbox label="Важная задача" key="important-task" />
                </div>
                <div class="row">
                    <div class="col">
                        <Button text="Отмена" type="secondary" className="w-100" />
                    </div>
                    <div class="col">
                        <Button text="Сохранить" type="primary" className="w-100" />
                    </div>
                </div>
            </div>
        )
    }
}
