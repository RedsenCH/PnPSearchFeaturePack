import { BaseWebComponent } from "@pnp/modern-search-extensibility";
import * as React from "react";
import * as ReactDom from "react-dom";
import {
    IEventAddCalendarProps,
    EventAddCalendar,
} from "./EventAddCalendarComponent";

export class EventAddCalendarWrapper extends BaseWebComponent {
    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        const customComponent: React.ReactElement<IEventAddCalendarProps> =
            React.createElement(EventAddCalendar, {
                sitepath: props.sitePath,
                listid: props.listId,
                listitemid: props.listItemId,
                title: props.title,
            });

        ReactDom.render(customComponent, this);
    }
}
