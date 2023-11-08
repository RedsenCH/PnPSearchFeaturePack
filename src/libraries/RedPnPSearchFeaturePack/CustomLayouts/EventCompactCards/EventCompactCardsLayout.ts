import { BaseLayout } from "@pnp/modern-search-extensibility";
import {
    IPropertyPaneField,
    PropertyPaneTextField,
    PropertyPaneSlider,
    PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import * as strings from "PnPSearchFeaturePackLibraryStrings";

export interface IEventCompactCardsLayoutsProperties {
    cardsPerLine: number;
    titleLineNumber: number;
    readMoreLabel: string;
    showAuthor: boolean;
    openEventsInNewTab: boolean;
    showParentSite: boolean;
}

export class EventCompactCardsLayout extends BaseLayout<IEventCompactCardsLayoutsProperties> {
    public getPropertyPaneFieldsConfiguration(
        availableFields: string[]
    ): IPropertyPaneField<any>[] {
        // Initializes the property if not defined
        this.properties.readMoreLabel =
            this.properties.readMoreLabel !== null
                ? this.properties.readMoreLabel
                : strings.CustomLayouts.NewsCardsLayout.readMore;

        return [
            PropertyPaneToggle("layoutProperties.showParentSite", {
                label: strings.CustomLayouts.Common.ShowParentSite,
                checked: this.properties.showParentSite,
                onText: strings.CustomLayouts.Common.EnabledLabel,
                offText: strings.CustomLayouts.Common.DisabledLabel,
            }),
            PropertyPaneSlider("layoutProperties.cardsPerLine", {
                min: 1,
                max: 4,
                step: 1,
                value: this.properties.cardsPerLine
                    ? this.properties.cardsPerLine
                    : 3,
                label: strings.CustomLayouts.Common.CardsPerLine,
            }),
            PropertyPaneSlider("layoutProperties.titleLineNumber", {
                min: 1,
                max: 3,
                step: 1,
                value: this.properties.titleLineNumber
                    ? this.properties.titleLineNumber
                    : 2,
                label: strings.CustomLayouts.Common.TitleMaxNumberOfLines,
            }),
            PropertyPaneTextField("layoutProperties.seeAllLabel", {
                label: strings.CustomLayouts.Common.seeAllLabel,
                placeholder: "",
            }),
            PropertyPaneTextField("layoutProperties.seeAllLink", {
                label: strings.CustomLayouts.Common.seeAllLink,
                placeholder: "",
            }),
            PropertyPaneToggle("layoutProperties.openEventsInNewTab", {
                label: strings.CustomLayouts.Common.OpenEventsInNewTab,
                checked: this.properties.openEventsInNewTab,
                onText: strings.CustomLayouts.Common.EnabledLabel,
                offText: strings.CustomLayouts.Common.DisabledLabel,
            }),
        ];
    }
}
