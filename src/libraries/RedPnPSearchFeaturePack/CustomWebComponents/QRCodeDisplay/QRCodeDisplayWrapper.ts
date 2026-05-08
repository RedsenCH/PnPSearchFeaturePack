import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IQRCodeDisplayProps, QRCodeDisplay } from "./QRCodeDisplayComponent";

export class QRCodeDisplayWrapper extends BaseWebComponent {

    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const customComponent: React.ReactElement<IQRCodeDisplayProps> = React.createElement(QRCodeDisplay, {
            text: props.text,
            size: props.size,
            bgColor: props.bgColor,
            fgColor: props.fgColor
        });

        ReactDom.render(customComponent, this);
    }
}