import { BaseComponentContext } from "@microsoft/sp-component-base";
import "@pnp/common";
import { setup as pnpSetup } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/content-types";
import "@pnp/sp/fields";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/hubsites";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { ICamlQuery } from "@pnp/sp/lists";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/taxonomy";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/webs";
import LoggerService from "../LoggerService/LoggerService";

class SharePointService {
    private context: BaseComponentContext;

    constructor(context: BaseComponentContext) {
        this.context = context;
        pnpSetup({
            spfxContext: context,
        });
    }

    public async getListItems(
        listUrl: string,
        caml?: ICamlQuery,
        weburl?: string,
        forceUpdate: boolean = false
    ): Promise<any> {
        LoggerService.log("SharePointService - getListItems - " + listUrl);

        const web = weburl ? Web(weburl) : sp.web;
        const webRelativeUrl = await web.rootFolder.serverRelativeUrl.get();
        const url = this.getListUrl(listUrl, webRelativeUrl);
        let hasList = null;

        try {
            hasList = await web.getList(url).get();
        } catch (error) {
            hasList = null;
        }

        if (hasList) {
            try {
                const listitems = caml
                    ? await web.getList(url).getItemsByCAMLQuery(caml)
                    : await web.getList(url).items.getAll();
                // CachingService.putLocalStorage(
                //   CachingConstants.SharePointServiceListItems.concat(uniqueKey),
                //   listitems,
                //   this.context.pageContext.site.absoluteUrl,
                //   CachingConstants.TTL.DefaultTTL
                // );
                return listitems;
            } catch (error) {
                return null;
            }
        } else {
            return null;
        }
    }

    public getListUrl(
        listUrl: string,
        webServerRelativerl: string = null
    ): string {
        if (webServerRelativerl) {
            // 1. Check if webServerRelativeUrl is absolute url :
            webServerRelativerl = webServerRelativerl.replace(
                window.location.origin,
                ""
            );
            return `${webServerRelativerl}/${listUrl}`;
        } else {
            return `${this.context.pageContext.web.serverRelativeUrl}/${listUrl}`;
        }
    }
}

export default SharePointService;
