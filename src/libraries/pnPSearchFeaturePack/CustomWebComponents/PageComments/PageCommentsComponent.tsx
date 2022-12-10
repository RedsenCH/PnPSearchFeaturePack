import { SPHttpClient } from "@microsoft/sp-http";
import { ActionButton, IButtonStyles, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import LoggerService from "../../../../services/LoggerService/LoggerService";
import ActionStylesHelper from "../ActionStylesHelper";

export interface IPageCommentsProps {
    listItemId: number;
    webUrl: string;
    listId: string;
    color: string;
    httpClient: SPHttpClient;
}

export interface IPageCommentsState {
    commentCount: number;
    isError: boolean;
}

const icon: IIconProps = { iconName: "Comment" };

export class PageComments extends React.Component<IPageCommentsProps, IPageCommentsState> {

    constructor(props:IPageCommentsProps) {
        super(props);

        this.state = {
            commentCount: 0,
            isError: false
        };
    }

    public async componentDidMount() {
        LoggerService.log("PageComments - componentDidMount");
        
        if (this.props.webUrl && this.props.listId && this.props.listItemId) {
            const response = await this.props.httpClient.get(
                `${this.props.webUrl}/_api/web/lists('${this.props.listId}')/GetItemById(${this.props.listItemId})/Comments`,
                SPHttpClient.configurations.v1
            );
    
            const responseJSON = await response.json();
            // console.log(responseJSON);
    
            const commentCount = responseJSON && responseJSON.value ? responseJSON.value.length : 0;
    
            this.setState(
                {
                  ...this.state,
                  commentCount,
                  isError:false
                }
            );
        } else {
            LoggerService.logError("[PnPSearchFeaturePack - PageComments component] Could not retreive item listId, listItemId or webUrl \n please ensure you've added following properties in Selected Properties: \n- ListItemID\n- SPSiteUrl\n- NormListID");
            
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
            iconProps={icon}
            onClick={(event) => {
                event.preventDefault();
            }}
            disabled={this.state.isError}
        >
            {this.state.isError ? "" : this.state.commentCount}
        </ActionButton>);
    }
}