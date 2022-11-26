import { SPHttpClient, ISPHttpClientOptions, SPHttpClientResponse } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";
import * as strings from "PnPSearchFeaturePackLibraryStrings";
import { ActionButton, IButtonStyles, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import LoggerService from "../../../../services/LoggerService/LoggerService";
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
        // console.log(responseJSON);

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
                title={this.state.isBookmakedByUser ? strings.SavedForLater : strings.SaveForLater}
            >
            </ActionButton>
        );
    }

    private async toggleUserBookmark(event:any) {
        // To avoid rage click :
        event?.preventDefault();

        const isSaved = this.state.isBookmakedByUser;
        const tenantUrl = this.props.pageContext.site.absoluteUrl.replace(this.props.pageContext.site.serverRelativeUrl, "");
        const saveForLaterAddUrl = `${tenantUrl}/_api/v2.1/favorites/followedListItems/oneDrive.add`;
        const saveForLaterRemoveUrl = `${tenantUrl}/_api/v2.1/favorites/followedListItems/oneDrive.remove`;

        const postOptions: ISPHttpClientOptions = {
            body: `{
                "value":[
                    {
                        "listId":"{${this.props.listId}}",
                        "listItemUniqueId":"${this.props.uniqueId}",
                        "webId":"${this.props.webId}",
                        "siteId":"${this.props.siteId}"
                    }
                ]
            }`
          };

        const updateFollowedStatuts:SPHttpClientResponse = await this.props.httpClient.post(
            isSaved ? saveForLaterRemoveUrl : saveForLaterAddUrl,
            SPHttpClient.configurations.v1,
            postOptions
        )

        if (updateFollowedStatuts.ok) {
            this.setState(
                {
                  ...this.state,
                  isBookmakedByUser: !isSaved
                }
            );
        } else {
            LoggerService.logError("[PageBookmark - follow/unfollow] Error occured while sending follow status to SharePoint!", updateFollowedStatuts);
        }
    }
}