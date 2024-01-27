import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent, IDataFilterInfo, IDataFilterValueInfo, IDataFilterInternal, ExtensibilityConstants } from '@pnp/modern-search-extensibility';
import { DateHelper } from '../../../../helpers/DateHelper';
import FilterDateSlider from './FilterDateSliderComponent';

export class FilterDateSliderWrapper extends BaseWebComponent {
    public constructor() {
        super();
    }

    public async connectedCallback() {
        const props = this.resolveAttributes();

        if (props.filter) {
            const dateHelper = this._serviceScope.consume<DateHelper>(DateHelper.ServiceKey);
            const moment = await dateHelper.moment();

            const filter = props.filter as IDataFilterInternal;

            const renderDateSlider = <FilterDateSlider {...props} withFuture={props.withFuture} moment={moment} filter={filter} onUpdate={((filterValues: IDataFilterValueInfo[]) => {

                // Unselect all previous values
                const updatedValues = filter.values.map(value => {

                    // Exclude current selected values
                    if (filterValues.filter(filterValue => { return filterValue.value === value.value; }).length === 0) {
                        return {
                            name: value.name,
                            selected: false,
                            value: value.value,
                            operator: value.operator
                        } as IDataFilterValueInfo;
                    }
                });

                // Bubble event through the DOM
                this.dispatchEvent(new CustomEvent(ExtensibilityConstants.EVENT_FILTER_UPDATED, {
                    detail: {
                        filterName: filter.filterName,
                        filterValues: filterValues.concat(updatedValues.filter(v => v)),
                        instanceId: props.instanceId
                    } as IDataFilterInfo,
                    bubbles: true,
                    cancelable: true
                }));
            }).bind(this)}
            />;

            ReactDOM.render(renderDateSlider, this);
        }
    }
}
