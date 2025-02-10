import { el } from "../../../node_modules/redom/dist/redom.es";

class FormInput {
  constructor(props) {
    const {label, ...otherProps} = props;

    this.el = 
      <div>
        <label for="base-input" class="form-label">{label}</label>
        <input id="base-input" type="text" class="form-control" {...otherProps}/>
      </div>
  }
}

export default FormInput;
