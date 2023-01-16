import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import PanelFilePreviewComponent from './PanelFilePreviewComponent';

export class PanelFilePreviewWrapper extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {
       const props = this.resolveAttributes();
       const customComponent = <PanelFilePreviewComponent fileTitle={props.filetitle} filePath={props.filepath} panelPosition={props.panelposition} iconSize={props.iconsize} url={props.url} panelType={props.paneltype} />;
       ReactDOM.render(customComponent, this);
    }    
}