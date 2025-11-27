import * as React from "react";

export interface IIframeEnhancedProps {
    src: string;
    height: string | number;
    width: string | number;
}

export interface IIframeEnhancedState {
}


export class IframeEnhanced extends React.Component<IIframeEnhancedProps, IIframeEnhancedState> {

    constructor(props:IIframeEnhancedProps) {
        super(props);
    }
    
    public render() {
      return <div dangerouslySetInnerHTML={{ __html: `<iframe src="${this.props.src}" style="width:${this.props.width}; height:${this.props.height};" frameborder="0" allowfullscreen></iframe>` }}></div>;
    }
}