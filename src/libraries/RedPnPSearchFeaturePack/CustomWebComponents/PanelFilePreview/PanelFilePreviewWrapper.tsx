import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import PanelFilePreviewComponent, { IPanelFilePreviewComponentProps } from './PanelFilePreviewComponent';

export class PanelFilePreviewWrapper extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {
        const props = this.resolveAttributes();

        // const customComponent = <PanelFilePreviewComponent 
        //                             fileTitle={props.filetitle} 
        //                             filePath={props.filepath} 
        //                             panelPosition={props.panelposition} 
        //                             iconSize={props.iconsize} 
        //                             url={props.url} 
        //                             panelType={props.paneltype} />;

        const customComponent: React.ReactElement<IPanelFilePreviewComponentProps> = React.createElement(PanelFilePreviewComponent, {
            fileTitle: props.fileTitle,
            filePath: props.filePath,
            panelPosition: props.panelPosition,
            iconSize: props.iconSize,
            url: props.url,
            panelType: props.panelType,
            displayMode: props.displayMode,
            previewImage: props.previewImage
        });
                            
        
       ReactDOM.render(customComponent, this);
    }
}