import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import FilterDateSliderComponent from './FilterDateSliderComponent';

export class FilterDateSliderWrapper extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {
       const props = this.resolveAttributes();
       const customComponent = <FilterDateSliderComponent 
        instanceId={props.instanceId}
        filter={props.filter}
        themeVariant={props.themeVariant} />;
       ReactDOM.render(customComponent, this);
    }
}