export default interface ISPSite {
  id: string;
  siteId?: string;
  webId?: string;
  groupId?: string;
  type?: string;
  isTeamsLinked?: boolean;
  title: string;
  description: string;
  path: string;
  modified: Date;
  siteImageUrl: string;
  webTemplate: string;
  associatedTeamsUrl?: string;
}

export enum SharepointTypeSite {
  communicationSite = "SITEPAGEPUBLISHING",
  teamSite = "GROUP",
}
