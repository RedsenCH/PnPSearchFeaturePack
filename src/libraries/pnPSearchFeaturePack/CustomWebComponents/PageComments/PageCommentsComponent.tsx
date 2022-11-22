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
}

const icon: IIconProps = { iconName: "Comment" };

export class PageComments extends React.Component<IPageCommentsProps, IPageCommentsState> {

    constructor(props:IPageCommentsProps) {
        super(props);

        this.state = {
            commentCount: 0
        };
    }

    public async componentDidMount() {
        LoggerService.log("PageComments - componentDidMount");
        
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
              commentCount
            }
        );
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
        >
            {this.state.commentCount}
        </ActionButton>);
    }
}