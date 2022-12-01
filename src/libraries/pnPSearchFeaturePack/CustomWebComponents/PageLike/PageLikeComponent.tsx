import { ISPHttpClientOptions, SPHttpClient } from "@microsoft/sp-http";
import * as strings from "PnPSearchFeaturePackLibraryStrings";
import { ActionButton, IButtonStyles, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import LoggerService from "../../../../services/LoggerService/LoggerService";
import ActionStylesHelper from "../ActionStylesHelper";

export interface IPageLikeProps {
    listItemId: number;
    webUrl: string;
    listId: string;
    color: string;
    httpClient: SPHttpClient;
}

export interface IPageLikeState {
    likeCount: number;
    isLikedByUser: boolean;
    isError: boolean;
}

const likeIcon: IIconProps = { iconName: "Like" };
const likeSolidIcon: IIconProps = { iconName: "LikeSolid" };

export class PageLike extends React.Component<IPageLikeProps, IPageLikeState, null> {

    constructor(props:IPageLikeProps) {
        super(props);

        // 1. state initialization:
        this.state = {
            likeCount: 0,
            isLikedByUser: false,
            isError: false
        };

        // 2. Event binding;
        this.toggleUserLike = this.toggleUserLike.bind(this);
    }

    public async componentDidMount() {
        LoggerService.log("PageLike - componentDidMount");

        if (this.props.webUrl && this.props.listId && this.props.listItemId) {
            const response = await this.props.httpClient.get(
                `${this.props.webUrl}/_api/web/lists('${this.props.listId}')/GetItemById(${this.props.listItemId})/LikedByInformation`,
                SPHttpClient.configurations.v1
            );

            const responseJSON = await response.json();

            this.setState(
                {
                    ...this.state,
                    likeCount:  responseJSON.likeCount,
                    isLikedByUser: responseJSON.isLikedByUser,
                    isError: false
                }
            );
        } else {
            LoggerService.logError("[PageLike - componentDidMount] Could not retreive item Id")
            
            this.setState(
                {
                  ...this.state,
                  isError:true
                }
            );
        }
    }
    
    public render() {
        const actionButtonStyles: IButtonStyles = ActionStylesHelper.getActionButtonStyles(this.props.color);

        return (
            <ActionButton
              styles={actionButtonStyles}
              iconProps={this.state.isLikedByUser ? likeSolidIcon : likeIcon}
              onClick={this.toggleUserLike}
              title={this.state.isLikedByUser ? strings.CustomComponents.PageLikeComponent.Liked : strings.CustomComponents.PageLikeComponent.Like}
              disabled={this.state.isError}
            >
              {this.state.isError ? "" : this.state.likeCount}
            </ActionButton>
          );
    }

    private async toggleUserLike(event:any) {
        
        // To avoid rage click :
        event?.preventDefault();

        const options: ISPHttpClientOptions = {};

        if (this.state.isLikedByUser) {
            // unlike
            const response = await this.props.httpClient.post(
                `${this.props.webUrl}/_api/web/lists('${this.props.listId}')/GetItemById(${this.props.listItemId})/unlike`,
                SPHttpClient.configurations.v1,
                options
            );

            if (response && response.ok) {
                this.setState(
                    {
                      ...this.state,
                      likeCount:  this.state.likeCount > 1 ? this.state.likeCount - 1 : 0,
                      isLikedByUser: false
                    }
                );
            }
        } else {
            // like
            
            const response = await this.props.httpClient.post(
                `${this.props.webUrl}/_api/web/lists('${this.props.listId}')/GetItemById(${this.props.listItemId})/like`,
                SPHttpClient.configurations.v1,
                options
            );

            if (response && response.ok) {
                this.setState(
                    {
                      ...this.state,
                      likeCount:  this.state.likeCount + 1,
                      isLikedByUser: true
                    }
                );
            }
        }
    }
}