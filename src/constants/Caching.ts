export default class CachingConstants {
    public static TTL = {
        DefaultTTL: 300000, // 5 minutes
        QuarterTTL: 900000, // 15 minutes
        OneHourTTL: 3600000, // 1 hour
        LongTimeTTL: 86400000, // 24 hours
    };

    public static RecentSites: string = "RECENTSITES";
    public static RecentTeamSites: string = "RECENTTEAMSITES";
    public static RecentCommunicationSites: string = "RECENTCOMMUNICATIONSITES";

    public static SocialFollowedSites: string = "FOLLOWEDSITES";
    public static AllTeamSites: string = "ALLTEAMSITES";
    public static AllCommunicationSites: string = "ALLCOMMUNICATIONSITES";
}
