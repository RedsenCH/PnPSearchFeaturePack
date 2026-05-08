import * as React from "react";
import { Slider } from "@fluentui/react/lib/Slider";
import { DateFilterInterval } from "../../../../enums/DateFilterInterval";
import * as strings from 'CommonStrings';
import { FilterComparisonOperator, IDataFilterInternal, IDataFilterValueInfo } from "@pnp/modern-search-extensibility";
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IFilterDateSliderProps {
    /**
     * The current selected filters. Because we can select values outside of values retrieved from results, we need this information to display the default date picker values correctly after the user selection
     */
    filter: IDataFilterInternal;

    /**
     * The current theme settings
     */
    themeVariant?: IReadonlyTheme;

    /**
     * Handler when the date is updated
     */
    onUpdate: (filterValues: IDataFilterValueInfo[]) => void;

    /**
     * The moment.js library reference
     */
    moment: any;

    /**
     * The moment.js library reference
     */
    withFuture?: boolean;
}

const FilterDateSlider: React.FunctionComponent<IFilterDateSliderProps> = (props: IFilterDateSliderProps) => { 
    const [selectedInterval, setSelectedInterval] = React.useState<DateFilterInterval>(null);
    const _allOptions = [
        {
            key: DateFilterInterval.OlderThanAYear,
            text: strings.General.DateIntervalStrings.Older
        },
        {
            key: DateFilterInterval.PastYear,
            text: strings.General.DateIntervalStrings.PastYear
        },
        {
            key: DateFilterInterval.Past3Months,
            text: strings.General.DateIntervalStrings.Past3Months
        },
        {
            key: DateFilterInterval.PastMonth,
            text: strings.General.DateIntervalStrings.PastMonth
        },
        {
            key: DateFilterInterval.PastWeek,
            text: strings.General.DateIntervalStrings.PastWeek,
        },
        {
            key: DateFilterInterval.Past24,
            text: strings.General.DateIntervalStrings.PastDay
        },
        {
            key: DateFilterInterval.AnyTime,
            text: strings.General.DateIntervalStrings.AnyTime
        },
        {
            key: DateFilterInterval.Today,
            text: strings.General.DateIntervalStrings.Today
        },
        {
            key: DateFilterInterval.ThisWeek,
            text: strings.General.DateIntervalStrings.ThisWeek
        },
        {
            key: DateFilterInterval.ThisMonth,
            text: strings.General.DateIntervalStrings.ThisMonth
        },
        {
            key: DateFilterInterval.These3Months,
            text: strings.General.DateIntervalStrings.These3Months
        },
        {
            key: DateFilterInterval.ThisYear,
            text: strings.General.DateIntervalStrings.ThisYear
        },
        {
            key: DateFilterInterval.Further,
            text: strings.General.DateIntervalStrings.Further
        },
    ];

    const _getIntervalKeyForFilterName = (filterName: string): DateFilterInterval => {

        if (filterName) {
            switch (filterName) {
                case strings.General.DateIntervalStrings.Older:
                    return DateFilterInterval.OlderThanAYear;
                case strings.General.DateIntervalStrings.PastYear:
                    return DateFilterInterval.PastYear;
                case strings.General.DateIntervalStrings.Past3Months:
                    return DateFilterInterval.Past3Months;
                case strings.General.DateIntervalStrings.PastMonth:
                    return DateFilterInterval.PastMonth;
                case strings.General.DateIntervalStrings.PastWeek:
                    return DateFilterInterval.PastWeek;
                case strings.General.DateIntervalStrings.PastDay:
                    return DateFilterInterval.Past24;
                case strings.General.DateIntervalStrings.Today:
                    return DateFilterInterval.Today;
                case strings.General.DateIntervalStrings.ThisWeek:
                    return DateFilterInterval.ThisWeek;
                case strings.General.DateIntervalStrings.ThisMonth:
                    return DateFilterInterval.ThisMonth;
                case strings.General.DateIntervalStrings.These3Months:
                    return DateFilterInterval.These3Months;
                case strings.General.DateIntervalStrings.ThisYear:
                    return DateFilterInterval.ThisYear;
                case strings.General.DateIntervalStrings.Further:
                    return DateFilterInterval.Further;
                default:
                    return DateFilterInterval.AnyTime;
            }
        }
        return DateFilterInterval.AnyTime;
    };

    const onChange = (val: number, range: [number, number], event: MouseEvent) => {
        setSelectedInterval(val);
    };

    const onChanged = (event: MouseEvent, val: number, range?: [number, number]) => {
        const updatedValues: IDataFilterValueInfo[] = [];

        switch (val) {
            case DateFilterInterval.OlderThanAYear:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.Older,
                        value: props.moment(new Date()).subtract(1, 'years').subtract('minutes', 1).toISOString(), // Needed to distinguish past year VS older than a year
                        selected: true,
                        operator: FilterComparisonOperator.Lt
                    }
                );
                break;

            case DateFilterInterval.Past24:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.PastDay,
                        value: new Date().toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                    {
                        name: strings.General.DateIntervalStrings.PastDay,
                        value: props.moment(new Date()).subtract(24, 'hours').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;

            case DateFilterInterval.Past3Months:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.Past3Months,
                        value: props.moment(new Date()).subtract(1, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                    {
                        name: strings.General.DateIntervalStrings.Past3Months,
                        value: props.moment(new Date()).subtract(3, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;

            case DateFilterInterval.PastMonth:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.PastMonth,
                        value: props.moment(new Date()).subtract(1, 'week').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                    {
                        name: strings.General.DateIntervalStrings.PastMonth,
                        value: props.moment(new Date()).subtract(1, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;

            case DateFilterInterval.PastWeek:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.PastWeek,
                        value: props.moment(new Date()).subtract(24, 'hours').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                    {
                        name: strings.General.DateIntervalStrings.PastWeek,
                        value: props.moment(new Date()).subtract(1, 'week').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;

            case DateFilterInterval.PastYear:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.PastYear,
                        value: props.moment(new Date()).subtract(3, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                    {
                        name: strings.General.DateIntervalStrings.PastYear,
                        value: props.moment(new Date()).subtract(1, 'years').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;
            
            case DateFilterInterval.Further:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.Further,
                        value: props.moment(new Date()).add(1, 'years').add(1, 'minutes').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    }
                );
                break;

            case DateFilterInterval.ThisYear:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.ThisYear,
                        value: props.moment(new Date()).add(3, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    },
                    {
                        name: strings.General.DateIntervalStrings.ThisYear,
                        value: props.moment(new Date()).add(1, 'years').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    },
                );
                break;
            
            case DateFilterInterval.These3Months:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.These3Months,
                        value: props.moment(new Date()).add(1, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    },
                    {
                        name: strings.General.DateIntervalStrings.These3Months,
                        value: props.moment(new Date()).add(3, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    }
                );
                break;

            case DateFilterInterval.ThisMonth:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.ThisMonth,
                        value: props.moment(new Date()).add(1, 'week').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    },
                    {
                        name: strings.General.DateIntervalStrings.ThisMonth,
                        value: props.moment(new Date()).add(1, 'months').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    }
                );
                break;
            
            case DateFilterInterval.ThisWeek:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.ThisWeek,
                        value: props.moment(new Date()).add(24, 'hours').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    },
                    {
                        name: strings.General.DateIntervalStrings.ThisWeek,
                        value: props.moment(new Date()).add(1, 'week').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    }
                );
                break;
            
            case DateFilterInterval.Today:
                updatedValues.push(
                    {
                        name: strings.General.DateIntervalStrings.Today,
                        value: new Date().toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Geq
                    },
                    {
                        name: strings.General.DateIntervalStrings.Today,
                        value: props.moment(new Date()).add(24, 'hours').toISOString(),
                        selected: true,
                        operator: FilterComparisonOperator.Leq
                    }
                );
                break;
        }

        props.onUpdate(updatedValues);
    };

    React.useEffect(() => {
        const values = props.filter.values.filter(value => value.selected).sort((a, b) => {
            return new Date(a.value).getTime() - new Date(b.value).getTime();
        });
        
        const filterName: string = values.length > 0 && values[0].name || undefined;
        setSelectedInterval(_getIntervalKeyForFilterName(filterName));
    }, []);
    
    return  (selectedInterval !== null && 
        <Slider
            label={ _allOptions[selectedInterval].text }
            min={DateFilterInterval.OlderThanAYear}
            max={props.withFuture && DateFilterInterval.Further || DateFilterInterval.AnyTime}
            defaultValue={DateFilterInterval.AnyTime}
            value={selectedInterval}
            showValue={false}
            onChange={onChange}
            onChanged={onChanged}
            styles={{root: {minWidth: 250, maxWidth: '80%'}}}
        />);
};

export default FilterDateSlider;