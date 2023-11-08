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
            ShowAuthor: string;
            CardsPerLine: string;
            TitleMaxNumberOfLines: string;
            DescriptionMaxNumberOfLines: string;
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
        EventCardsLayout: {
            cardFieldTitle: string;
            manageCardsFieldBtn: string;
            readMore: string;
            LocationMaxNumberOfLines: string;
        };
    };
}

declare module "PnPSearchFeaturePackLibraryStrings" {
    const strings: IPnPSearchFeaturePackLibraryStrings;
    export = strings;
}
