import { SPHttpClient } from "@microsoft/sp-http";
import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPageCommentsProps, PageComments } from "./PageCommentsComponent";

export class PageCommentsWrapper extends BaseWebComponent {

    public constructor() {
        super(); 
    }

    public async connectedCallback() {
        const spHttpClient = this._serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);
        const props = this.resolveAttributes();
        const customComponent: React.ReactElement<IPageCommentsProps> = React.createElement(PageComments, {
            listItemId: props.listItemId,
            webUrl: props.webUrl,
            listId: props.listId,
            color: props.color,
            httpClient: spHttpClient
        });
        ReactDom.render(customComponent, this);
    }    
}