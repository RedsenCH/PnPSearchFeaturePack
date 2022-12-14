import { BaseLayout } from "@pnp/modern-search-extensibility";
import { IPropertyPaneField, PropertyPaneTextField, PropertyPaneSlider, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import * as strings from "PnPSearchFeaturePackLibraryStrings";

export interface INewsCardsLayoutsProperties {
    cardsPerLine: number;
    titleLineNumber: number;
    descriptionLineNumber: number;
    readMoreLabel: string;
    showAuthor: boolean;
}

export class NewsCardsLayout extends BaseLayout<INewsCardsLayoutsProperties> {
    
    public getPropertyPaneFieldsConfiguration(availableFields: string[]): IPropertyPaneField<any>[] {

        // Initializes the property if not defined
        this.properties.readMoreLabel = this.properties.readMoreLabel !== null ? this.properties.readMoreLabel : strings.CustomLayouts.NewsCardsLayout.readMore;
        
        return [
            PropertyPaneToggle('layoutProperties.showAuthor', {
                label: "Show author",
                checked: this.properties.showAuthor,
                onText: "Yes",
                offText: "No",
                key: "layoutProperties.showAuthor"
            }),
            PropertyPaneSlider('layoutProperties.cardsPerLine', {
                min:1,
                max:4,
                step:1,
                value: this.properties.cardsPerLine ? this.properties.cardsPerLine : 3,
                label: "Cards per line"
            }),
            PropertyPaneSlider('layoutProperties.titleLineNumber', {
                min:1,
                max:3,
                step:1,
                value: this.properties.titleLineNumber ? this.properties.titleLineNumber : 2,
                label: "Title : Max number of lines"
            }),
            PropertyPaneSlider('layoutProperties.descriptionLineNumber', {
                min:1,
                max:5,
                step:1,
                value: this.properties.descriptionLineNumber ? this.properties.descriptionLineNumber : 4,
                label: "Description : Max number of lines"
            }),          
            PropertyPaneTextField('layoutProperties.readMoreLabel', {
                label: "Read more label",
                placeholder: ""
            })
        ];
    }
}