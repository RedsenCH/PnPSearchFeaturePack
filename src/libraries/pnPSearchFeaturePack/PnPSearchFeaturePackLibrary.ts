import { IAdaptiveCardAction, 
         IComponentDefinition, 
         IDataSourceDefinition, 
         IExtensibilityLibrary, 
         ILayoutDefinition, 
         IQueryModifierDefinition, 
         ISuggestionProviderDefinition } from "@pnp/modern-search-extensibility";
import LoggerService from "../../services/LoggerService/LoggerService";
import { PageBookmarkWrapper } from "./CustomWebComponents/PageBookmark/PageBookmarkWrapper";
import { PageCommentsWrapper } from "./CustomWebComponents/PageComments/PageCommentsWrapper";
import { PageDateWrapper } from "./CustomWebComponents/PageDate/PageDateWrapper";
import { PageLikeWrapper } from "./CustomWebComponents/PageLike/PageLikeWrapper";
import { PanelFilePreviewWrapper } from "./CustomWebComponents/PanelFilePreview/PanelFilePreviewWrapper";

export class PnPSearchFeaturePackLibrary implements IExtensibilityLibrary {
  getCustomLayouts(): ILayoutDefinition[] {
    return [];
  }
  getCustomWebComponents(): IComponentDefinition<any>[] {
    return [
            {
              componentName: 'panel-filepreview',
              componentClass: PanelFilePreviewWrapper
            },
            {
              componentName: 'page-bookmark',
              componentClass: PageBookmarkWrapper
            },
            {
              componentName: 'page-comments',
              componentClass: PageCommentsWrapper
            },
            {
              componentName: 'page-like',
              componentClass: PageLikeWrapper
            },
            {
              componentName: 'page-date',
              componentClass: PageDateWrapper
            }];
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
  registerHandlebarsCustomizations?(handlebarsNamespace: typeof Handlebars): void {
    LoggerService.log("registerHandlebarsCustomizations - Not yet implemented");
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
    return [];
  }

  public name(): string {
    return 'PnPSearchFeaturePackLibrary';
  }
}
