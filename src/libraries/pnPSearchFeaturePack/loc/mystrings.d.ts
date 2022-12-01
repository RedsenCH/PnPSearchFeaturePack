declare interface IPnPSearchFeaturePackLibraryStrings {
  CustomComponents: {
    PageLikeComponent: {
      Like: string;
      Liked: string;
    },
    BookmarkComponent: {
      SaveForLater: string;
      SavedForLater: string;
    }
  },
  CustomLayouts: {
    NewsCardsLayout: {
      cardFieldTitle: string;
      manageCardsFieldBtn: string;
      readMore: string;
    }
  }
}

declare module 'PnPSearchFeaturePackLibraryStrings' {
  const strings: IPnPSearchFeaturePackLibraryStrings;
  export = strings;
}
