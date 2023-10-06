import { SPHttpClient } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";
import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import { IPageBookmarkProps, PageBookmark } from "./PageBookmarkComponent";

export class PageBookmarkWrapper extends BaseWebComponent {

    public constructor() {
        super(); 
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const spHttpClient = this._serviceScope.consume<SPHttpClient>(SPHttpClient.serviceKey);
        const pageContext = this._serviceScope.consume<PageContext>(PageContext.serviceKey);
        // const temp = this._webPartServiceScopes[0];
        // temp.value.

        const customComponent: React.ReactElement<IPageBookmarkProps> = React.createElement(PageBookmark, {
            listItemId: props.listItemId,
            webUrl: props.webUrl,
            listId: props.listId,
            webId: props.webId,
            siteId: props.siteId,
            uniqueId: props.uniqueId,
            url: props.url,
            color: props.color,
            pageContext,
            httpClient: spHttpClient
        });
        ReactDom.render(customComponent, this);
    }
}