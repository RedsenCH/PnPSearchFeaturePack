import * as React from "react";
import {QRCodeSVG} from 'qrcode.react';

export interface IQRCodeDisplayProps {
    text: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
}

export class QRCodeDisplay extends React.Component<IQRCodeDisplayProps, null> {

    constructor(props:IQRCodeDisplayProps) {
        super(props);
    }
    
    public render() {
        return (
          <QRCodeSVG 
            value={this.props.text} 
            size={this.props.size?this.props.size:128} 
            bgColor={this.props.bgColor?this.props.bgColor:"#FFFFFF"}
            fgColor={this.props.fgColor?this.props.fgColor:"#000000"}/>
        );
    }
}