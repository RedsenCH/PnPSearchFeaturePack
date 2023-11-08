import * as React from "react";
import { IconButton } from "office-ui-fabric-react";
import { download, sanitize } from "../../../../helpers/functions";

export interface IEventAddCalendarProps {
    sitepath: string;
    listid: string;
    listitemid: string;
    title: string;
}

export class EventAddCalendar extends React.Component<IEventAddCalendarProps, null> {
  
  constructor(props:IEventAddCalendarProps) {
    super(props);
  }
  
  public render() {
    const SITE_URL = this.props.sitepath;
    const LIST_GUID = this.props.listid;
    const EVENT_ID = this.props.listitemid;
    const urlForEventICSformat = `${SITE_URL}/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List={${LIST_GUID}}&CacheControl=1&ID=${EVENT_ID}&Using=event.ics`;

      return (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            download(urlForEventICSformat, `${sanitize(this.props.title, "_")}.ics`);
          }}
          iconProps={{ iconName: "AddEvent" }}
        ></IconButton>
      );
    }
}