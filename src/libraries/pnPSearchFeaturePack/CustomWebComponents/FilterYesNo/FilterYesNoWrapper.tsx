import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import FilterYesNoComponent from './FilterYesNoComponent';

export class FilterYesNoWrapper extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {
       const props = this.resolveAttributes();
       const customComponent = <FilterYesNoComponent />;
       ReactDOM.render(customComponent, this);
    }
}