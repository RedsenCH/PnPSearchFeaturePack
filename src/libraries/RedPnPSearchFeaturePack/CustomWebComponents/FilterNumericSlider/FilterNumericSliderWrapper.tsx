import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import FilterNumericSliderComponent from './FilterNumericSliderComponent';

export class FilterNumericSliderWrapper extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {
        // const props = this.resolveAttributes();
        const customComponent = <FilterNumericSliderComponent  />;
        ReactDOM.render(customComponent, this);
    }
}