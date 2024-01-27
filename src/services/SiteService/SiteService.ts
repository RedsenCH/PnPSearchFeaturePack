import { BaseComponentContext } from "@microsoft/sp-component-base";
import { SPHttpClient } from "@microsoft/sp-http";
import { setup as pnpSetup } from "@pnp/common";
import { sp } from "@pnp/sp";
import "@pnp/sp/search";
import { ISearchQuery, SortDirection } from "@pnp/sp/search/types";
import { Site } from "@pnp/sp/sites";
import "@pnp/sp/social";
import { Web } from "@pnp/sp/webs";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";
import * as _ from "lodash";
import CachingConstants from "../../constants/Caching";
import ISPSite, { SharepointTypeSite } from "../../models/ISPSite";
import CachingService from "../CachingService/CachingService";
import LoggerService from "../LoggerService/LoggerService";
import ISiteService, { ISitesResult } from "./ISiteService";

class SiteService implements ISiteService {
    private context: BaseComponentContext;

    constructor(context: BaseComponentContext) {
        this.context = context;
        pnpSetup({
            spfxContext: context,
        });
    }

    public async isFollowSite(contentUri: string): Promise<boolean> {
        const followedSites = await this.getFollowedSites(null);
        return _.some(followedSites, { path: contentUri });
    }

    public async getFollowedSites(
        top: number = 50,
        force?: boolean
    ): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.SocialFollowedSites,
            null
        );

        if (cachedData && !force) {
            if (cachedData.length) {
                return top ? cachedData.slice(0, top) : cachedData;
            } else {
                return [];
            }
        } else {
            let returnSites: ISPSite[] = [];

            // const graphClient = await this.context.msGraphClientFactory.getClient();
            // const results = await graphClient.api("/me/followedSites").get();

            const httpCli = this.context.httpClient;
            const followedSites = await (
                await httpCli.get(
                    this.context.pageContext.site.serverRelativeUrl +
                        `/_vti_bin/homeapi.ashx/sites/followed?mostRecentFirst=true&start=0&count=100&acronyms=true`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: { "SPHome-ClientType": "PagesWeb" },
                    }
                )
            ).json();

            if (
                followedSites &&
                followedSites.Items &&
                followedSites.Items.length > 0
            ) {
                for (const followedSite of followedSites.Items) {
                    returnSites.push(await this.getSite(followedSite.Url));
                }

                // Cleanup potential reference to Tenant root site (make all search queries irrelevant)
                const tenantUrl =
                    this.context.pageContext.site.absoluteUrl.replace(
                        this.context.pageContext.site.serverRelativeUrl,
                        ""
                    );
                returnSites = _.filter(
                    returnSites,
                    (site) => site && site.path !== tenantUrl
                );

                CachingService.putLocalStorage(
                    CachingConstants.SocialFollowedSites,
                    returnSites,
                    null,
                    CachingConstants.TTL.QuarterTTL
                );

                if (returnSites && returnSites.length > 0) {
                    return top ? returnSites.slice(0, top) : returnSites;
                } else {
                    return [];
                }
            } else {
                LoggerService.logError("Could not find any recent site");
                return [];
            }
        }
    }

    public async getSite(contentUri: string): Promise<ISPSite> {
        try {
            const siteInfo = await this.getSiteInformation(contentUri);
            const webInfo = await this.getWebInformation(contentUri);
            return {
                id: null,
                path: webInfo?.Url,
                description: webInfo?.Description,
                siteId: siteInfo?.Id,
                groupId: siteInfo?.GroupId,
                type: webInfo
                    ? webInfo.WebTemplate === SharepointTypeSite.teamSite
                        ? "GroupReference"
                        : "SiteReference"
                    : "SiteReference",
                webId: webInfo?.Id,
                title: webInfo?.Title,
                modified: webInfo?.LastItemModifiedDate,
                siteImageUrl: webInfo?.SiteLogoUrl,
                webTemplate: webInfo?.WebTemplate,
            };
        } catch (exception) {
            LoggerService.logError(
                "Could not retreive either web or site information for the site @url : " +
                    contentUri,
                exception
            );
        }
    }

    public async getSites(
        index: number = 0,
        limitPerPage: number = 4,
        maxResult: number,
        queryFilter: string,
        includeCommunicationSite: boolean,
        includeTeamSite: boolean,
        frequentSitesOnTop: boolean,
        maxNumberOfFrequentSites: number = 10,
        excludedSites: IPropertyFieldSite[]
    ): Promise<ISitesResult> {
        if (!includeCommunicationSite && !includeTeamSite) {
            return { sites: [], totalRows: 0 };
        } else {
            let query = "contentclass=sts_site ";
            if (includeCommunicationSite && includeTeamSite) {
                query +=
                    "(WebTemplate:GROUP OR WebTemplate:SITEPAGEPUBLISHING) ";
                if (frequentSitesOnTop) {
                    query +=
                        " " +
                        (await this.buildFrequentSitesQuery(
                            queryFilter && queryFilter.length > 0
                                ? `${queryFilter}*`
                                : null,
                            true,
                            true,
                            maxNumberOfFrequentSites,
                            excludedSites
                        ));
                }
            } else if (includeTeamSite) {
                query += "WebTemplate:GROUP ";
                if (frequentSitesOnTop) {
                    query +=
                        " " +
                        (await this.buildFrequentSitesQuery(
                            queryFilter && queryFilter.length > 0
                                ? `${queryFilter}*`
                                : null,
                            true,
                            false,
                            maxNumberOfFrequentSites,
                            excludedSites
                        ));
                }
            } else if (includeCommunicationSite) {
                query += "WebTemplate:SITEPAGEPUBLISHING ";
                if (frequentSitesOnTop) {
                    query +=
                        " " +
                        (await this.buildFrequentSitesQuery(
                            queryFilter && queryFilter.length > 0
                                ? `${queryFilter}*`
                                : null,
                            false,
                            true,
                            maxNumberOfFrequentSites,
                            excludedSites
                        ));
                }
            }

            if (excludedSites && excludedSites.length > 0) {
                for (const excludedSite of excludedSites) {
                    query += ` -SiteId:"${excludedSite.id}"`;
                }
            }

            LoggerService.log(
                `[SiteService - getSites] search query : ${query}`
            );

            try {
                const results = await sp.search({
                    SelectProperties: [
                        "Path",
                        "Description",
                        "SiteLogo",
                        "Title",
                        "LastModifiedTime",
                        "SiteID",
                        "WebId",
                        "GroupId",
                        "Type",
                        "WebTemplate",
                    ],
                    Querytext: `${query}`,
                    SortList: [
                        {
                            Property: frequentSitesOnTop
                                ? "Rank"
                                : "LastModifiedTime",
                            Direction: SortDirection.Descending,
                        },
                    ],
                    RowsPerPage: limitPerPage,
                    StartRow: index * limitPerPage,
                    RowLimit:
                        maxResult &&
                        maxResult > 0 &&
                        (index + 1) * limitPerPage > maxResult
                            ? maxResult - index * limitPerPage
                            : limitPerPage,
                    TrimDuplicates: false,
                    SourceId: "8413cd39-2156-4e00-b54d-11efd9abdb89",
                });
                const sites: ISPSite[] = results.PrimarySearchResults.map(
                    (site): ISPSite => {
                        return {
                            id: null,
                            path: site.Path,
                            description: site.Description,
                            siteId: (site as any).SiteID,
                            groupId: (site as any).GroupId,
                            type:
                                site.WebTemplate === SharepointTypeSite.teamSite
                                    ? "GroupReference"
                                    : "SiteReference",
                            webId: (site as any).WebId,
                            title: site.Title,
                            modified: site.LastModifiedTime,
                            siteImageUrl: site.SiteLogo,
                            webTemplate: site.WebTemplate,
                        };
                    }
                );

                return {
                    sites,
                    totalRows: maxResult
                        ? results.TotalRows > maxResult
                            ? maxResult
                            : results.TotalRows
                        : results.TotalRows,
                };
            } catch (e) {
                LoggerService.log("Error getTeamsSite ", e);
                return { sites: [], totalRows: 0 };
            }
        }
    }

    // public async getSiteRecentActivities(site: ISPSite) {
    //   const url = `${site.path}/_api/sphomeservice/context?$expand=Token`;
    //   const Token = await TokenService.getInstance().getToken(url);

    //   const recentActivitiesUrl = `${Token.resource}/api/v1/activities?count=3`;
    //   const payload = [
    //     { WebId: site.webId, IndexId: 0, ExchangeId: "", Source: "Users", SiteId: site.siteId, Type: site.type, GroupeId: site.groupId },
    //   ];

    //   const result = await axios.post(recentActivitiesUrl, payload, {
    //     headers: {
    //       authorization: `Bearer ${Token.access_token}`,
    //       accept: "*/*",
    //       "sphome-apicontext": `{"PortalUrl":"${site.path}"}`,
    //       "content-type": "application/json",
    //       "odata-version": "3.0",
    //       "sphome-clienttype": "PagesWeb",
    //       farmLabel: this.context.pageContext.legacyPageContext.farmLabel,
    //     },
    //   });
    //   return result.data.Activities;
    // }

    public async getWebInformation(url: string) {
        const cachedData = CachingService.getLocalStorage(
            url + "Web",
            this.context.pageContext.site.absoluteUrl
        );
        if (cachedData) {
            return cachedData;
        } else {
            const webInfo = await Web(url).get();
            CachingService.putLocalStorage(
                url + "Web",
                webInfo,
                this.context.pageContext.site.absoluteUrl
            );
            return webInfo;
        }
    }

    public async getSiteInformation(url: string) {
        const cachedData = CachingService.getLocalStorage(
            url + "Site",
            this.context.pageContext.site.absoluteUrl
        );
        if (cachedData) {
            return cachedData;
        } else {
            const siteInfo = await Site(url).get();
            CachingService.putLocalStorage(
                url + "Site",
                siteInfo,
                this.context.pageContext.site.absoluteUrl
            );
            return siteInfo;
        }
    }

    public async getCommunicationFollowedSites(
        index: number = 0,
        limitPerPage: number = 4,
        queryFilter: string,
        includeCommunicationSite: boolean,
        includeTeamSite: boolean
    ): Promise<ISitesResult> {
        const followedSites: ISPSite[] = await this.getFollowedSites();
        const sites = [];

        for (const site of followedSites) {
            if (includeCommunicationSite && includeTeamSite) {
                sites.push(site);
            } else if (includeTeamSite) {
                if (site.webTemplate === SharepointTypeSite.teamSite) {
                    sites.push(site);
                }
            } else if (includeCommunicationSite) {
                if (site.webTemplate === SharepointTypeSite.communicationSite) {
                    sites.push(site);
                }
            }
        }

        const returnSites = sites.slice(
            index * limitPerPage,
            index * limitPerPage + limitPerPage
        );
        LoggerService.log(
            "[SiteService - getCommunicationFollowedSites] returned sites",
            returnSites
        );

        return { sites: returnSites, totalRows: sites.length };
    }

    public async getFrequentCommunicationSites(
        top: number,
        force: boolean = false
    ): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.RecentCommunicationSites,
            null
        );

        if (cachedData && !force) {
            return top ? cachedData.slice(0, top) : cachedData;
        } else {
            const allFrequentSites = await this.getFrequentSites(null);
            const allTeamSites = await this.getAllCommunicationSites();
            const returnSites: ISPSite[] = [];

            for (const frequenteSite of allFrequentSites) {
                const foundSite = _.find(
                    allTeamSites,
                    (site) => site.id === frequenteSite.id
                );

                if (foundSite) {
                    returnSites.push(frequenteSite);
                }
            }

            CachingService.putLocalStorage(
                CachingConstants.RecentCommunicationSites,
                returnSites,
                null,
                CachingConstants.TTL.OneHourTTL
            );
            return top ? returnSites.slice(0, top) : returnSites;
        }
    }

    public async getFrequentTeamSites(
        top: number,
        force: boolean = false
    ): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.RecentTeamSites,
            null
        );

        if (cachedData && !force) {
            return top ? cachedData.slice(0, top) : cachedData;
        } else {
            const allFrequentSites = await this.getFrequentSites(null, null);
            const allTeamSites = await this.getAllTeamSites();
            const returnSites: ISPSite[] = [];

            for (const frequenteSite of allFrequentSites) {
                const foundSite = _.find(
                    allTeamSites,
                    (site) => site.id === frequenteSite.id
                );

                if (foundSite) {
                    returnSites.push(frequenteSite);
                }
            }

            CachingService.putLocalStorage(
                CachingConstants.RecentTeamSites,
                returnSites,
                null,
                CachingConstants.TTL.OneHourTTL
            );
            return top ? returnSites.slice(0, top) : returnSites;
        }
    }

    public async getFrequentSites(
        top: number = 20,
        force: boolean = false
    ): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.RecentSites,
            null
        );

        if (cachedData && !force) {
            if (cachedData.length) {
                return top ? cachedData.slice(0, top) : cachedData;
            } else {
                return [];
            }
        } else {
            const returnSites: ISPSite[] = [];
            const httpCli = await this.context.msGraphClientFactory.getClient(
                "3"
            );
            const frequentSites = await httpCli
                .api("/me/insights/used")
                .filter("ResourceVisualization/Type eq 'spsite'")
                .orderby("lastUsed/lastAccessedDateTime desc")
                .top(top)
                .get();

            if (
                frequentSites &&
                frequentSites.value &&
                frequentSites.value.length > 0
            ) {
                for (const frequentSite of frequentSites.value) {
                    returnSites.push({
                        id: frequentSite.resourceReference.id,
                        title: frequentSite.resourceVisualization.title,
                        description: null,
                        path: frequentSite.resourceReference.webUrl,
                        modified: frequentSite.lastUsed.lastModifiedDateTime,
                        siteImageUrl: null,
                        webTemplate: null,
                        siteId: frequentSite.resourceReference.id.split(",")[1],
                        webId: frequentSite.resourceReference.id.split(",")[2],
                    });
                }

                CachingService.putLocalStorage(
                    CachingConstants.RecentSites,
                    returnSites,
                    null,
                    CachingConstants.TTL.DefaultTTL
                );

                if (returnSites && returnSites.length > 0) {
                    return top ? returnSites.slice(0, top) : returnSites;
                } else {
                    return [];
                }
            } else {
                LoggerService.logError("Could not find any recent site");
                return [];
            }
        }
    }

    public async getAllTeamSites(force: boolean = false): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.AllTeamSites,
            null
        );

        if (cachedData && !force) {
            return cachedData;
        } else {
            const returnSites = await this.getAllSiteOfTemplate("GROUP");
            CachingService.putLocalStorage(
                CachingConstants.AllTeamSites,
                returnSites,
                null,
                CachingConstants.TTL.OneHourTTL
            );
            return returnSites;
        }
    }

    public async getAllCommunicationSites(
        force: boolean = false
    ): Promise<ISPSite[]> {
        const cachedData: ISPSite[] = CachingService.getLocalStorage(
            CachingConstants.AllCommunicationSites,
            null
        );

        if (cachedData && !force) {
            return cachedData;
        } else {
            const returnSites = await this.getAllSiteOfTemplate(
                "SITEPAGEPUBLISHING"
            );
            CachingService.putLocalStorage(
                CachingConstants.AllCommunicationSites,
                returnSites,
                null,
                CachingConstants.TTL.OneHourTTL
            );
            return returnSites;
        }
    }

    public async getFollowedSiteIds(
        top: number = 10,
        excludedSites: string[] = [],
        forceRefresh: boolean = false
    ): Promise<string[]> {
        const followedSites: ISPSite[] = await this.getFollowedSites(
            top,
            forceRefresh
        );
        let followedSiteIds: string[] = [];

        if (followedSites && followedSites.length > 0) {
            followedSiteIds = followedSites.map((site, idx: number) => {
                if (!_.find(excludedSites, site.path)) {
                    return site.siteId;
                }
            });
        }

        followedSiteIds = followedSiteIds.slice(0, top);

        return followedSiteIds;
    }

    public async getFollowedSiteQuery(
        top: number = 10,
        excludedSites: string[] = [],
        forceRefresh: boolean = false,
        forceSiteOrder: boolean = false,
        initialQuery: string = "-fksl"
    ): Promise<string> {
        const followedSites: ISPSite[] = await this.getFollowedSites(
            top,
            forceRefresh
        );
        let followedSiteIds: string[] = [];

        if (followedSites && followedSites.length > 0) {
            followedSiteIds = followedSites.map((site, idx: number) => {
                if (!_.find(excludedSites, site.path)) {
                    return `SiteId:${site.siteId}`;
                }
            });
        }

        followedSiteIds = followedSiteIds.slice(0, top);
        let returnQuery: string = "";
        if (!forceSiteOrder) {
            returnQuery = followedSiteIds.join(" OR ");
        } else {
            // 1. preparing opening parenthesis for multiple XRANK
            for (let i = 0; i <= followedSites.length - 1; i++) {
                returnQuery += "(";
            }

            let toprank = 10 + followedSites.length;
            for (const site of followedSites) {
                returnQuery +=
                    " " +
                    initialQuery +
                    " XRANK(cb=" +
                    toprank +
                    ') SiteId:"' +
                    site.siteId +
                    '")';
                toprank = toprank - 1;
            }
        }

        return returnQuery;
    }

    public getXRankQuery(
        values: string[],
        initialQuery: string = "-fksl"
    ): string {
        let returnQuery: string = `(${values
            .map((val) => `${val}`)
            .join(" OR ")}) `;
        // 1. preparing opening parenthesis for multiple XRANK
        for (let i = 0; i <= values.length - 1; i++) {
            returnQuery += "(";
        }

        let toprank = 10 + values.length;
        for (const val of values) {
            returnQuery +=
                " " + initialQuery + " XRANK(cb=" + toprank + ") " + val + ")";
            toprank = toprank - 1;
        }
        return returnQuery;
    }

    public async getFrequentSiteIds(
        top: number = 10,
        excludedSites: string[] = [],
        forceRefresh: boolean = false
    ): Promise<string[]> {
        const frequentSites: ISPSite[] = await this.getFrequentSites(
            top,
            forceRefresh
        );
        let frequentSiteIds: string[] = [];

        if (frequentSites && frequentSites.length > 0) {
            frequentSiteIds = frequentSites.map((site) => {
                if (!_.find(excludedSites, site.path)) {
                    return site.siteId;
                }
            });
        }

        frequentSiteIds = frequentSiteIds.slice(0, top);

        return frequentSiteIds;
    }

    public async getFrequentSiteQuery(
        top: number = 10,
        excludedSites: string[] = [],
        forceRefresh: boolean = false,
        forceSiteOrder: boolean = false,
        initialQuery: string = "-fksl"
    ): Promise<string> {
        const frequentSites: ISPSite[] = await this.getFrequentSites(
            top,
            forceRefresh
        );
        let frequentSiteUrl: string[] = [];

        if (frequentSites && frequentSites.length > 0) {
            frequentSiteUrl = frequentSites.map((site) => {
                if (!_.find(excludedSites, site.path)) {
                    return "Path:" + site.path;
                }
            });
        }

        frequentSiteUrl = frequentSiteUrl.slice(0, top);
        const returnQuery = frequentSiteUrl.join(" OR ");

        return returnQuery;
    }

    private async getAllSiteOfTemplate(
        templateName: string
    ): Promise<ISPSite[]> {
        const returnSites: ISPSite[] = [];

        const searchQuery: ISearchQuery = {
            SelectProperties: [
                "Title",
                "Description",
                "Path",
                "NormSiteID",
                "LastModifiedTime",
                "SiteLogo",
                "SiteId",
            ],
            Querytext: `contentClass:STS_Site SiteTemplate:${templateName}`,
            RowLimit: 500,
            RowsPerPage: 500,
            TrimDuplicates: false,
        };

        const results = await sp.search(searchQuery);

        if (results.RowCount > 0) {
            for (const result of results.PrimarySearchResults) {
                returnSites.push({
                    title: result.Title,
                    description: result.Description,
                    path: result.Path,
                    id: result["NormSiteID"],
                    modified: result.LastModifiedTime,
                    siteImageUrl: result.SiteLogo,
                    webTemplate: result.WebTemplate,
                });
            }
        }

        return returnSites;
    }

    private async buildFrequentSitesQuery(
        initialQuery: string,
        includeTeamSites: boolean,
        includeCommunicationSites: boolean,
        maxNumberOfFrequentSites: number,
        excludedSites: IPropertyFieldSite[]
    ): Promise<string> {
        let query = "";
        initialQuery =
            initialQuery && initialQuery.length > 0 ? initialQuery : " -asdf ";

        let frequentSites: ISPSite[] = [];

        if (includeCommunicationSites && includeTeamSites) {
            frequentSites = await this.getFrequentSites(null);
        } else if (includeCommunicationSites && !includeTeamSites) {
            frequentSites = await this.getFrequentCommunicationSites(null);
        } else if (!includeCommunicationSites && includeTeamSites) {
            frequentSites = await this.getFrequentTeamSites(null);
        }

        if (frequentSites && frequentSites.length) {
            // 0. First we remove the excluded sites :
            if (excludedSites && excludedSites.length > 0) {
                const frequentSitesExcluded: ISPSite[] = [];

                for (const site of frequentSites) {
                    const isExcluded = _.find(
                        excludedSites,
                        (excludedSite) => excludedSite.id === site.id
                    );

                    if (!isExcluded) {
                        frequentSitesExcluded.push(site);
                    }
                }

                frequentSites = frequentSitesExcluded;
            }

            frequentSites = frequentSites.slice(
                0,
                maxNumberOfFrequentSites ? maxNumberOfFrequentSites : 10
            );

            // 1. preparing opening parenthesis for multiple XRANK
            for (let i = 0; i <= frequentSites.length - 1; i++) {
                query += "(";
            }

            let toprank = 10 + frequentSites.length;
            for (const site of frequentSites) {
                query +=
                    " " +
                    initialQuery +
                    " XRANK(cb=" +
                    toprank +
                    ') SiteId:"' +
                    site.id +
                    '")';
                toprank = toprank - 1;
            }
        }

        return query;
    }

    public async getInfoFromComSitesRepository(
        listServerAbsoluteUrl: string,
        fieldInternalName: string,
        queryTemplate?: string
    ): Promise<string[]> {
        const searchQuery: ISearchQuery = {
            Querytext: `Path:"${listServerAbsoluteUrl}" ${queryTemplate}`,
            RowLimit: 500,
            TrimDuplicates: false,
            SelectProperties: [fieldInternalName, "SiteUrlOWSTEXT"],
        };

        const result = await sp.search(searchQuery);

        return result.PrimarySearchResults.map(
            (r: any) => r[fieldInternalName]
        );
    }
}

export default SiteService;
