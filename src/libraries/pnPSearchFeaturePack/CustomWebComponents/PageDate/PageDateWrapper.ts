import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPageDateProps, PageDate } from "./PageDateComponent";

export class PageDateWrapper extends BaseWebComponent {

    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const customComponent: React.ReactElement<IPageDateProps> = React.createElement(PageDate, {
            date: props.date,
            format: props.format,
            color: props.color
        });

        ReactDom.render(customComponent, this);
    }
}