import { SPHttpClient } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";
import axios from "axios";
// import strings from "EnhancedFeaturesForPnPSearchLibraryStrings";
import { ActionButton, IButtonStyles, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import LoggerService from "../../../../services/LoggerService/LoggerService";
import TokenService from "../../../../services/TokenService/TokenService";
import ActionStylesHelper from "../ActionStylesHelper";
// export interface IObjectParam {
//     myProperty: string;
// }

export interface IPageBookmarkProps {
    listItemId: number;
    webUrl: string;
    listId: string;
    webId:string;
    siteId: string;
    uniqueId: string;
    url: string;
    color: string;
    httpClient: SPHttpClient;
    pageContext: PageContext;
}

export interface IPageBookmarkState {
    isBookmakedByUser: boolean;
}

const bookMarkIcon: IIconProps = { iconName: "SingleBookmark" };
const bookMarkSolidIcon: IIconProps = { iconName: "SingleBookmarkSolid" };

export class PageBookmark extends React.Component<IPageBookmarkProps, IPageBookmarkState> {

    constructor(props:IPageBookmarkProps) {
        super(props);

        this.state = {
            isBookmakedByUser: false
        };

        this.toggleUserBookmark = this.toggleUserBookmark.bind(this);
    }

    public async componentDidMount() {
        LoggerService.log("PageBookmark - componentDidMount");

        const tenantUrl = this.props.pageContext.site.absoluteUrl.replace(this.props.pageContext.site.serverRelativeUrl, "");
        const tenantUrlNoProtocol = tenantUrl.replace("https://", "");
        const apiUrl = `${tenantUrl}/_api/v2.1/sites/${tenantUrlNoProtocol},${this.props.siteId},${this.props.webId}/lists/{${this.props.listId}}/items/${this.props.uniqueId}/driveItem?$select=followed,id,analytics&$expand=analytics($expand=allTime)`;
        
        const response = await this.props.httpClient.get(
            apiUrl,
            SPHttpClient.configurations.v1
        );

        const responseJSON = await response.json();
        console.log(responseJSON);

        this.setState(
            {
              ...this.state,
              isBookmakedByUser:  responseJSON.followed && responseJSON.followed.followedDateTime,
            }
        );
    }
    
    public render() {

        const actionButtonStyles: IButtonStyles = ActionStylesHelper.getActionButtonStyles(this.props.color);

        return (
            <ActionButton
                styles={actionButtonStyles}
                iconProps={this.state.isBookmakedByUser ? bookMarkSolidIcon : bookMarkIcon}
                onClick={this.toggleUserBookmark}
                title={this.state.isBookmakedByUser ? "Saved for later" : "Save for later"}
            >
            </ActionButton>
        );
    }

    private async toggleUserBookmark(event:any) {
        // To avoid rage click :
        event?.preventDefault();

        const siteUrl = this.props.webUrl;
        const url = `${siteUrl}/_api/sphomeservice/context?$expand=Token`;
        const Token = await TokenService.getInstance().getToken(url);

        const saveForLaterAddUrl = `${Token.resource}/api/v1/documents/saveForLater/add`;
        const saveForLaterRemoveUrl = `${Token.resource}/api/v1/documents/saveForLater/remove`;

        const isSaved = this.state.isBookmakedByUser;
        const  apiUrl: string = isSaved ? saveForLaterRemoveUrl : saveForLaterAddUrl;

        await axios.post(apiUrl, `"${encodeURI(this.props.url)}"`, {
            headers: {
              authorization: `Bearer ${Token.access_token}`,
              accept: "*/*",
              "sphome-apicontext": `{"PortalUrl":"${siteUrl}"}`,
              "content-type": "application/json",
              "odata-version": "3.0",
              "sphome-clienttype": "PagesWeb",
              farmLabel: this.props.pageContext.legacyPageContext.farmLabel,
            },
        });

        this.setState(
            {
              ...this.state,
              isBookmakedByUser: !isSaved
            }
        );
    }
}