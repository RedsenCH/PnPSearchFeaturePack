import { IDataSourceDefinition } from "@pnp/modern-search-extensibility";
import * as strings from "CommonStrings";

export enum BuiltinDataSourceProviderKeys {
    SharePointSearch = "SharePointSearch",
    MicrosoftSearch = "MicrosoftSearch",
    SharePointSearchEnhanced = "SharePointSearchEnhanced",
}

export class AvailableDataSources {
    /**
     * Returns the list of builtin data sources for the search results
     */
    public static BuiltinDataSources: IDataSourceDefinition[] = [
        {
            name: strings.DataSources.SharePointSearch.SourceName,
            iconName: "SharePointLogo",
            key: BuiltinDataSourceProviderKeys.SharePointSearch.toString(),
            serviceKey: null, // ServiceKey will be created dynamically for builtin source
        },
        {
            name: strings.DataSources.MicrosoftSearch.SourceName,
            iconName: "OfficeLogo",
            key: BuiltinDataSourceProviderKeys.MicrosoftSearch.toString(),
            serviceKey: null, // ServiceKey will be created dynamically for builtin source
        },
        // {
        //     name: "SharePoint Search enhanced",
        //     iconName: "FinancialSolid",
        //     key: BuiltinDataSourceProviderKeys.SharePointSearchEnhanced.toString(),
        //     serviceKey: null, // ServiceKey will be created dynamically for builtin source
        // },
    ];
}
