import { SPHttpClient } from "@microsoft/sp-http";
import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPageLikeProps, PageLike } from "./PageLikeComponent";

export class PageLikeWrapper extends BaseWebComponent {

    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const spHttpClient = this._serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);

        const customComponent: React.ReactElement<IPageLikeProps> = React.createElement(PageLike, {
            listItemId: props.listItemId,
            webUrl: props.webUrl,
            listId: props.listId,
            color: props.color,
            httpClient: spHttpClient
        });

        ReactDom.render(customComponent, this);
    }
}