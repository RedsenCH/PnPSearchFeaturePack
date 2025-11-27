import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import { PanelEnhancedComponent } from './PanelEnhancedComponent';

export class PanelEnhancedWrapper extends BaseWebComponent {
   
    public constructor() {
            super();
        }
    
        public async connectedCallback() {
    
            const domParser = new DOMParser();
            const htmlContent: Document = domParser.parseFromString(this.innerHTML, 'text/html');
    
            // Get the templates
            const openTemplate = htmlContent.getElementById('panel-open');
            const contentTemplate = htmlContent.getElementById('panel-content');
    
            let contentTemplateContent = null;
            let openTemplateContent = null;
    
            if (contentTemplate) {
                contentTemplateContent = contentTemplate.innerHTML;
            }
    
            if (openTemplate) {
                openTemplateContent = openTemplate.innerHTML;
            }
    
            const props = this.resolveAttributes();
            const fileIcon = <PanelEnhancedComponent {...props} contentTemplate={contentTemplateContent} openTemplate={openTemplateContent} />;
            ReactDOM.render(fileIcon, this);
        }
    
        protected onDispose(): void {
            ReactDOM.unmountComponentAtNode(this);
        }   
}