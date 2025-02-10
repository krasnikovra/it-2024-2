import { el } from "../../../node_modules/redom/dist/redom.es";

class FormButtonPrimary {
  constructor(props) {
    const {text, ...otherProps} = props;

    // This instantiation is needed because
    // redom + babel fails to render a jsx with
    // complex className i.e. <div class="class other-class"/>
    const btn = Object.assign(
      document.createElement("button"),
      {
        type: "button",
        className: "btn btn-primary w-100",
        textContent: props.text,
        ...otherProps
      }
    );

    this.el =
      <div class="text-center">
        {btn}
      </div>
  }
}

export default FormButtonPrimary;
