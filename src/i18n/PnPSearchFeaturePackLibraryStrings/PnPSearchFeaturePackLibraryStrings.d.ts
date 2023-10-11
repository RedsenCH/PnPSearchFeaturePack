declare interface IPnPSearchFeaturePackLibraryStrings {
    Common: {
        Yes: string;
        No: string;
    };
    CustomFilterComponents: {
        YesNoCheckboxComponent: {};
    };
    CustomComponents: {
        PageLikeComponent: {
            Like: string;
            Liked: string;
        };
        BookmarkComponent: {
            SaveForLater: string;
            SavedForLater: string;
        };
    };
    CustomLayouts: {
        Common: {
            ShowParentSite: string;
            EnabledLabel: string;
            DisabledLabel: string;
            seeAllLabel: string;
            seeAllLink: string;
            HeaderLabel: string;
            HeaderTokensLabel: string;
            AlignSeeAllOnHeader: string;
            OpenEventsInNewTab: string;
        };
        NewsCardsLayout: {
            cardFieldTitle: string;
            manageCardsFieldBtn: string;
            readMore: string;
        };
        SiteCardsLayout: {
            cardFieldTitle: string;
            manageCardsFieldBtn: string;
            readMore: string;
        };
    };
}

declare module "PnPSearchFeaturePackLibraryStrings" {
    const strings: IPnPSearchFeaturePackLibraryStrings;
    export = strings;
}
