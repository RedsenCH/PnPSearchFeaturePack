import * as React from "react";

export interface IFilterDateSliderComponentProps {
    instanceId:string;
    filter:any;
    themeVariant:any;
}

// data-instance-id="{{@root.instanceId}}" 
// data-filter="{{JSONstringify filter 2}}"
// data-theme-variant="{{JSONstringify @root.theme}}"


const FilterDateSliderComponent: React.FunctionComponent<IFilterDateSliderComponentProps> = (props: IFilterDateSliderComponentProps) : JSX.Element => {

    return (
        <>
            <div>-- RefinerDateSliderComponent --</div>
            <div>{props.instanceId}</div>
            <div>{JSON.stringify(props.filter)}</div>
            <div>{JSON.stringify(props.themeVariant)}</div>
        </>
    );
};

export default FilterDateSliderComponent;