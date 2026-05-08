import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import ISPSite from "../../models/ISPSite";

export interface ISitesResult {
    sites: ISPSite[];
    totalRows: number;
}

export default interface ISiteService {
    isFollowSite(contentUri: string): Promise<boolean>;
    getSite(contentUri: string): Promise<ISPSite>;
    // getSiteRecentActivities(site: ISPSite);
    getSites(
        index: number,
        limitPerPage: number,
        maxResult: number,
        queryFilter: string,
        includeCommunicationSite: boolean,
        includeTeamSite: boolean,
        frequentSitesOnTop: boolean,
        maxNumberOfFrequentSites: number,
        excludedSites: IPropertyFieldSite[]
    ): Promise<ISitesResult>;
    getCommunicationFollowedSites(
        index: number,
        limitPerPage: number,
        queryFilter: string,
        includeCommunicationSite: boolean,
        includeTeamSite: boolean
    ): Promise<ISitesResult>;
}
