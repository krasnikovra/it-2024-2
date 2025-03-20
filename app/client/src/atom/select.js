import { mount, el } from '../../node_modules/redom/dist/redom.es';

export default class Select {
    constructor(settings = {}) {
        const {
            options = [
                {
                    label: 'Option 1',
                    value: 'option1'
                }
            ],
            value = 'option1',
            onChange = (value) => { console.log(value) },
        } = settings;

        this._prop = {
            options,
            value,
            onChange
        };

        this.el = this._ui_render();
    }

    _ui_render = () => {
        const { options, value, onChange } = this._prop;

        this._ui_options = [];
        return (
            <select this='_ui_select' className='form-select' onchange={e => onChange(e.target.value)}>
                {options.map(option => {
                    const uiOpt = 
                        <option value={option.value} selected={value === option.value}>{option.label}</option>
                    this._ui_options.push(uiOpt);
                    return uiOpt;
                })}
            </select>
        )
    }

    updateLabels = (labels) => {
        if (labels.length !== this._prop.options.length) {
            console.error('Failed to update select\'s options labels!\
                 Labels array is incompatible with select\' options array.');
            return;
        }

        this._ui_options.forEach((uiOption, index) => {
            uiOption.innerHTML = labels[index];
        });
    }
}
