import * as moment from "moment";
import { ActionButton, IButtonStyles, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import ActionStylesHelper from "../ActionStylesHelper";

export interface IPageDateProps {
    date: string;
    format: string;
    color: string;
}

export interface IPageLikeDate {
}

const calendarIcon: IIconProps = { iconName: "Calendar" };

export class PageDate extends React.Component<IPageDateProps, IPageLikeDate, null> {

    constructor(props:IPageDateProps) {
        super(props);
    }
    
    public render() {
        const actionButtonStyles: IButtonStyles = ActionStylesHelper.getActionButtonStyles(this.props.color);

        const dateDisplay = moment(this.props.date).format(this.props.format);

        return (
            <ActionButton
              styles={actionButtonStyles}
              iconProps={calendarIcon}
            >
              {dateDisplay}
            </ActionButton>
          );
    }
}