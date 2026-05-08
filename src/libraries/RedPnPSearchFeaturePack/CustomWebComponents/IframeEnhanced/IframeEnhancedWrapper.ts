import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IframeEnhanced, IIframeEnhancedProps } from "./IframeEnhancedComponent";

export class IframeEnhancedWrapper extends BaseWebComponent {

    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const customComponent: React.ReactElement<IIframeEnhancedProps> = React.createElement(IframeEnhanced, {
            ...props as IIframeEnhancedProps
        });

        ReactDom.render(customComponent, this);
    }
}