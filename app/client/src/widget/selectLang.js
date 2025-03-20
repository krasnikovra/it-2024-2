import Select from "../atom/select";
import { defaultLang } from "../utils/constants";
import { commonEventManager } from "../utils/eventManager";
import events from "../utils/events";
import t9n from "../utils/t9n/index";

export default class SelectLang {
    _langIds = ['ru', 'en'];
    _langT9nKeys = ['ru', 'en'];

    constructor() {
        this.el = this._ui_render();
    }

    _langLabels = (langId) => {
        return this._langT9nKeys.map(t9nKey => t9n(langId, t9nKey));
    }

    _ui_render = () => {
        const labels = this._langLabels(defaultLang);
        const options = this._langIds.map((langId, index) => ({
            value: langId,
            label: labels[index]
        }));

        return (
            <Select this='_ui_select' options={options} value={defaultLang} 
                onChange={langId => commonEventManager.dispatch(events.changeLang, langId)} />
        );
    }

    update = (data) => {
        const { lang = defaultLang } = data;
        const labels = this._langLabels(lang);
        this._ui_select.updateLabels(labels);
    }
}
