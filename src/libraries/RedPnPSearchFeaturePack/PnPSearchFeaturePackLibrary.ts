import {
    IAdaptiveCardAction,
    IComponentDefinition,
    IDataSource,
    IDataSourceDefinition,
    IExtensibilityLibrary,
    ILayout,
    ILayoutDefinition,
    IQueryModifierDefinition,
    ISuggestionProviderDefinition,
    LayoutRenderType,
    LayoutType,
} from "@pnp/modern-search-extensibility";
import LoggerService from "../../services/LoggerService/LoggerService";
import { NewsCardsLayout } from "./CustomLayouts/NewsCards/NewsCardsLayout";
import { FilterDateSliderWrapper } from "./CustomWebComponents/FilterDateSlider/FilterDateSliderWrapper";
import { FilterNumericSliderWrapper } from "./CustomWebComponents/FilterNumericSlider/FilterNumericSliderWrapper";
import { PageBookmarkWrapper } from "./CustomWebComponents/PageBookmark/PageBookmarkWrapper";
import { PageCommentsWrapper } from "./CustomWebComponents/PageComments/PageCommentsWrapper";
import { PageDateWrapper } from "./CustomWebComponents/PageDate/PageDateWrapper";
import { PageLikeWrapper } from "./CustomWebComponents/PageLike/PageLikeWrapper";
import { PanelFilePreviewWrapper } from "./CustomWebComponents/PanelFilePreview/PanelFilePreviewWrapper";
import { ServiceKey } from "@microsoft/sp-core-library";
import { isEmpty } from "@microsoft/sp-lodash-subset";
// import { FilterDateIntervalWebComponent } from "./CustomWebComponents/FilterCustomDateInterval/FilterDateIntervalComponent";
// import { FilterComboBoxWebComponent } from "./CustomWebComponents/FilterCustomCombobox/FilterComboBoxComponent";
import { FilterYesNoCheckboxWebComponent } from "./CustomWebComponents/FilterYesNoCheckBox/FilterYesNoCheckBoxComponent";
import { SiteCardsLayout } from "./CustomLayouts/SiteCards/SiteCardsLayout";
import { BuiltinDataSourceProviderKeys } from "./CustomDataSources/AvailableDataSources";
import { SharePointSearchEnhancedDataSource } from "./CustomDataSources/SharePointSearchEnhancedDataSource";
import { QRCodeDisplayWrapper } from "./CustomWebComponents/QRCodeDisplay/QRCodeDisplayWrapper";

export class PnPSearchFeaturePackLibrary implements IExtensibilityLibrary {
    getCustomLayouts(): ILayoutDefinition[] {
        return [
            {
                name: "News Cards Layout",
                iconName: "News",
                key: "REDNewsCardsLayout",
                type: LayoutType.Results,
                renderType: LayoutRenderType.Handlebars,
                templateContent: require("./CustomLayouts/NewsCards/newscards-layout.html"),
                serviceKey: ServiceKey.create<ILayout>(
                    "RED:NewsCardsLayout",
                    NewsCardsLayout
                ),
            },
            {
                name: "Site Cards",
                iconName: "Globe",
                key: "REDSiteCardsLayout",
                type: LayoutType.Results,
                renderType: LayoutRenderType.Handlebars,
                templateContent: require("./CustomLayouts/SiteCards/sitecards-layout.html"),
                serviceKey: ServiceKey.create<ILayout>(
                    "RED:SiteCardsLayout",
                    SiteCardsLayout
                ),
            },
        ];
    }
    getCustomWebComponents(): IComponentDefinition<any>[] {
        return [
            // BEGIN - Just for test
            // {
            //   componentName: 'mycustom-filtercombobox',
            //   componentClass: FilterComboBoxWebComponent
            // },
            // {
            //   componentName: 'mycustom-filterdateinterval',
            //   componentClass: FilterDateIntervalWebComponent
            // },
            // END - Just for test
            {
                componentName: "filter-yesnocheckbox",
                componentClass: FilterYesNoCheckboxWebComponent,
            },
            {
                componentName: "filter-dateslider",
                componentClass: FilterDateSliderWrapper,
            },
            {
                componentName: "filter-numericslider",
                componentClass: FilterNumericSliderWrapper,
            },
            {
                componentName: "panel-filepreview",
                componentClass: PanelFilePreviewWrapper,
            },
            {
                componentName: "page-bookmark",
                componentClass: PageBookmarkWrapper,
            },
            {
                componentName: "page-comments",
                componentClass: PageCommentsWrapper,
            },
            {
                componentName: "page-like",
                componentClass: PageLikeWrapper,
            },
            {
                componentName: "page-date",
                componentClass: PageDateWrapper,
            },
            {
                componentName: "qr-code",
                componentClass: QRCodeDisplayWrapper,
            }
        ];
    }

    /**
     *
     * @returns
     */
    getCustomSuggestionProviders(): ISuggestionProviderDefinition[] {
        return [];
    }

    /**
     *
     * @param handlebarsNamespace
     */
    registerHandlebarsCustomizations?(
        handlebarsNamespace: typeof Handlebars
    ): void {
        handlebarsNamespace.registerHelper(
            "math",
            (lvalueStr: string, operator: string, rvalueStr: string) => {
                const lvalue = parseFloat(lvalueStr);
                const rvalue = parseFloat(rvalueStr);

                return {
                    "+": lvalue + rvalue,
                    "-": lvalue - rvalue,
                    "*": lvalue * rvalue,
                    "/": lvalue / rvalue,
                    "%": lvalue % rvalue,
                }[operator];
            }
        );

        handlebarsNamespace.registerHelper("mathCeil", (valueStr) => {
            const value = parseFloat(valueStr);
            return Math.ceil(value);
        });

        handlebarsNamespace.registerHelper(
            "getUrlField",
            (urlField: string, value: "URL" | "Title") => {
                if (!isEmpty(urlField)) {
                    const separatorPos = urlField.indexOf(",");
                    if (separatorPos === -1) {
                        return urlField;
                    }
                    if (value === "URL") {
                        return urlField.substr(0, separatorPos);
                    }
                    return urlField.substr(separatorPos + 1).trim();
                }
                return new handlebarsNamespace.SafeString(urlField);
            }
        );

        handlebarsNamespace.registerHelper(
            "setVariable",
            (varName: string, varValue: any, options) => {
                if (!isEmpty(varName)) {
                    options.data.root[varName] = varValue;
                }
            }
        );

        handlebarsNamespace.registerHelper(
            "debug",
            (varName: string, varValue: any) => {
                console.log("debug - " + varName, varValue);
            }
        );

        handlebarsNamespace.registerHelper(
            "parseToBoolean",
            (varValue: string) => {
                if (!isEmpty(varValue)) {
                    return varValue.toLocaleLowerCase() === "true";
                }
                return false;
            }
        );

        handlebarsNamespace.registerHelper(
            "getValueFromArray",
            (arr: any[], index: number, propertyName: string) => {
                if (
                    !isEmpty(arr) &&
                    index >= 0 &&
                    index < arr.length &&
                    !isEmpty(propertyName)
                ) {
                    return arr[index][propertyName];
                }
                return null;
            }
        );

        handlebarsNamespace.registerHelper(
            "stringArrayContains",
            (arr: string[], val: string) => {
                if (!isEmpty(arr) && !isEmpty(val)) {
                    LoggerService.log("[stringArrayContains] arr", arr);
                    LoggerService.log("[stringArrayContains] val", val);
                    return !!arr.find((a: string) => {
                        return a === val;
                    });
                }
                return false;
            }
        );

        handlebarsNamespace.registerHelper(
            "areStringDifferent",
            (val1: string, val2: string) => {
                if (!isEmpty(val1) && !isEmpty(val2)) {
                    return val1 !== val2;
                }
                return false;
            }
        );

        handlebarsNamespace.registerHelper("getTenantUrl", (): string => {
            return document.location.host;
        });

        handlebarsNamespace.registerHelper(
            "getSiteBigram",
            (title: string): string => {
                if (isEmpty(title)) {
                    return title;
                }

                const regex = /[^\w\s]/g;
                const titleClean = title.replace(regex, " ");
                const tokens = titleClean.trim().split(" ");

                if (tokens && tokens.length > 1) {
                    return (
                        tokens[0].charAt(0).toUpperCase() +
                        tokens[1].charAt(0).toUpperCase()
                    );
                } else if (tokens && tokens.length === 1) {
                    return tokens[0].length > 1
                        ? tokens[0].charAt(0).toUpperCase() +
                              tokens[0].charAt(1).toUpperCase()
                        : tokens[0].charAt(0).toUpperCase();
                } else {
                    return title.charAt(0).toUpperCase();
                }
            }
        );

        handlebarsNamespace.registerHelper("getLength", (obj: any) => {
            return obj ? obj.length : 0;
        });

        handlebarsNamespace.registerHelper("concat", (...args) => {
            let outStr = "";
            for (const arg of args) {
                if (typeof arg !== "object") {
                    outStr += arg;
                }
            }
            return outStr;
        });

        handlebarsNamespace.registerHelper("reverseCollection", (arr: any) => {
            return arr.reverse();
        });

        handlebarsNamespace.registerHelper("extractEmail", (obj: any) => {
            const rawValueString = "" + obj;

            const reg = new RegExp("[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}", "i");
            const qs = reg.exec(rawValueString);
            return qs ? qs[0] : "NO_EMAIL";

            // return rawValueString;
        });
    }

    /**
     *
     * @param action
     */
    invokeCardAction(action: IAdaptiveCardAction): void {
        LoggerService.log("invokeCardAction - Not yet implemented");
    }

    /**
     *
     * @returns
     */
    getCustomQueryModifiers?(): IQueryModifierDefinition[] {
        return [];
    }

    /**
     *
     * @returns
     */
    getCustomDataSources?(): IDataSourceDefinition[] {
        return [
            {
                name: "SharePoint Search enhanced",
                iconName: "FinancialSolid",
                key: BuiltinDataSourceProviderKeys.SharePointSearchEnhanced.toString(),
                serviceKey: ServiceKey.create<IDataSource>(
                    "SharePointSearchEnhancedDataSource",
                    SharePointSearchEnhancedDataSource
                ),
            },
        ];
    }

    public name(): string {
        return "PnPSearchFeaturePackLibrary";
    }
}
