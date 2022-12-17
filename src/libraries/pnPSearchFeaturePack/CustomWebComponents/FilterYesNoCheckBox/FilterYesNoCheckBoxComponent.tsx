import * as React from 'react';
import { BaseWebComponent, IDataFilterValueInfo, ExtensibilityConstants, IDataFilterInfo, FilterConditionOperator } from '@pnp/modern-search-extensibility';
import * as ReactDOM from 'react-dom';
import { Checkbox, Stack } from 'office-ui-fabric-react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'PnPSearchFeaturePackLibraryStrings';
import 'core-js/features/dom-collections';
import { IFilterValue } from '../../../../models/IFilter';
import LoggerService from '../../../../services/LoggerService/LoggerService';

type FilterMultiEventCallback = () => void;

export enum CheckBoxFilterMode {
    NUMERIC="numeric",
    BOOLEAN="boolean",
    STRING="string"
}

export interface IFilterYesNoCheckBoxProps {

    mode: CheckBoxFilterMode;

    label?: string;

    yesLabel?: string;

    noLabel?: string;

    /**
     * If you want to map a refinableString value you can map manually the value corresponding to "Yes"
     */
    yesValue?: string;

    /**
     * If you want to map a refinableString value you can map manually the value corresponding to "No"
     */
    noValue?: string;

    yesFilterValue:IFilterValue;

    noFilterValue:IFilterValue;
    
    /**
     * If the values should show the associated count
     */
    showCount?: boolean;

    /**
     * The current theme settings
     */
    themeVariant?: IReadonlyTheme;

    /**
     * Handler when a filter value is selected
     */
    onChange: (filterValues: IDataFilterValueInfo[], forceUpdate?: boolean, operator?: FilterConditionOperator) => void;

    /**
     * Callback handlers for filter multi events
     */
    onClear: FilterMultiEventCallback;
}

export interface IFilterYesNoCheckBoxState {}

export class FilterYesNoCheckBox extends React.Component<IFilterYesNoCheckBoxProps, IFilterYesNoCheckBoxState> {

    public constructor(props: IFilterYesNoCheckBoxProps) {
        
        super(props);

        this._clearFilters = this._clearFilters.bind(this);
        this. _onCheckBoxChange = this. _onCheckBoxChange.bind(this);
    }
    
    public render() {

        return  <Stack grow={true} className="filter-yesnocheckboxcontainer">
                    <Checkbox label={this.props.label ? this.props.label : ""}
                        indeterminate={!this.props.noFilterValue?.selected && !this.props.yesFilterValue?.selected}
                        checked={this.props.yesFilterValue?.selected}
                        onChange={this._onCheckBoxChange}
                    />
                </Stack>;
    } 

    public componentDidMount() {
        console.log(`[FilterYesNoCheckBox - componentDidMount()]`);
    }

    public async _onCheckBoxChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) {
        LoggerService.log("FilterYesNoCheckBox - _onCheckBoxChange()", ev, checked);

        const updatedSelectedValues: IDataFilterValueInfo[] = [];

        let targetSelectedValueTrue:string = null;
        let targetSelectedValueFalse:string = null;

        if (this.props.mode === CheckBoxFilterMode.BOOLEAN) {
            targetSelectedValueTrue = "True";
            targetSelectedValueFalse = "False";
        } else if (this.props.mode === CheckBoxFilterMode.NUMERIC) {
            targetSelectedValueTrue = "range(1, max, to=\"le\")";
            targetSelectedValueFalse = "range(min, 1)";
        } else if (this.props.mode === CheckBoxFilterMode.STRING) {
            targetSelectedValueTrue = this.props.yesValue;
            targetSelectedValueFalse = this.props.noValue;
        }
        
        if (!this.props.noFilterValue?.selected && !this.props.yesFilterValue?.selected) {
            updatedSelectedValues.push({
                name: this.props.yesLabel ? this.props.yesLabel : strings.Common.Yes,
                selected: true,
                value: targetSelectedValueTrue
            });
            this.props.onChange(updatedSelectedValues);
        } else if (this.props.yesFilterValue?.selected) {
            updatedSelectedValues.push({
                name:this.props.yesLabel ? this.props.yesLabel : strings.Common.Yes,
                selected: false,
                value: targetSelectedValueTrue
            });
            updatedSelectedValues.push({
                name:this.props.noLabel ? this.props.noLabel : strings.Common.No,
                selected: true,
                value: targetSelectedValueFalse
            });
            this.props.onChange(updatedSelectedValues);
        } else {
            this._clearFilters();
        }
    }

    /**
     * Clears all selected filters for the current refiner
     */
    private _clearFilters() {
        this.props.onClear();
    }
}

export class FilterYesNoCheckboxWebComponent extends BaseWebComponent {
   
    public constructor() {
        super(); 
    }
 
    public async connectedCallback() {

        const props = this.resolveAttributes();
        let filterStack: JSX.Element = null;

        const filterValues:IFilterValue[] = props?.filter?.values;

        let yesFilterValue:IFilterValue;
        let noFilterValue:IFilterValue;

        let mode:CheckBoxFilterMode = CheckBoxFilterMode.NUMERIC;

        if (filterValues) {
            filterValues.forEach(filterValue => {
                
                if (props.yesValue && props.noValue) {
                    mode = CheckBoxFilterMode.STRING;

                    if (filterValue.value === props.yesValue) {
                        yesFilterValue = filterValue;
                    } else if (filterValue.value === props.noValue) {
                        noFilterValue = filterValue;
                    }

                } else {
                    
                    if (filterValue.value === "range(1, max, to=\"le\")" || filterValue.value === "range(min, max, to=\"le\")") {
                        mode = CheckBoxFilterMode.NUMERIC;
                        yesFilterValue = filterValue;
                    } else if (filterValue.value === "range(min, 1)") {
                        mode = CheckBoxFilterMode.NUMERIC;
                        noFilterValue = filterValue;
                    } else if (filterValue.value === "True") {
                        mode = CheckBoxFilterMode.BOOLEAN;
                        yesFilterValue = filterValue;
                    } else if (filterValue.value === "False") {
                        mode = CheckBoxFilterMode.BOOLEAN;
                        noFilterValue = filterValue;
                    }

                }
            });
        }
        
        filterStack =   <FilterYesNoCheckBox
                                {...props} 
                                mode = {mode}
                                yesLabel = {props.yesLabel}
                                noLabel = {props.noLabel}
                                yesValue = {props.yesValue}
                                noValue = {props.noValue}
                                yesFilterValue = {yesFilterValue}
                                noFilterValue = {noFilterValue}
                                onChange = {((filterValues: IDataFilterValueInfo[], forceUpdate?: boolean, operator?: FilterConditionOperator) => {
                                    // Bubble event through the DOM
                                    this.dispatchEvent(new CustomEvent(ExtensibilityConstants.EVENT_FILTER_UPDATED, { 
                                        detail: {                                       
                                            filterName: props.filter.filterName,
                                            filterValues: filterValues,
                                            instanceId: props.instanceId,
                                            forceUpdate: forceUpdate,
                                            operator: props.filter.operator // Specific the operator explicitly
                                        } as IDataFilterInfo, 
                                        bubbles: true,
                                        cancelable: true
                                    }));
                                }).bind(this)}
                                onClear = {(() => {
                                    // Bubble event through the DOM
                                    this.dispatchEvent(new CustomEvent(ExtensibilityConstants.EVENT_FILTER_CLEAR_ALL, { 
                                        detail: {
                                            filterName: props.filterName ? props.filterName : props.filter.filterName,
                                            instanceId: props.instanceId
                                        },
                                        bubbles: true,
                                        cancelable: true
                                    }));
                                }).bind(this)}
                        />;
        
        ReactDOM.render(filterStack, this);
    }

    protected onDispose(): void {
        ReactDOM.unmountComponentAtNode(this);
    }
}