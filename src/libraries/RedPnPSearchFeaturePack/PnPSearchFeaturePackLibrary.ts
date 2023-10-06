import { IAdaptiveCardAction, 
         IComponentDefinition, 
         IDataSourceDefinition, 
         IExtensibilityLibrary, 
         ILayout, 
         ILayoutDefinition, 
         IQueryModifierDefinition, 
         ISuggestionProviderDefinition, 
         LayoutRenderType, 
         LayoutType} from "@pnp/modern-search-extensibility";
import LoggerService from "../../services/LoggerService/LoggerService";
import { NewsCardsLayout } from "./CustomLayouts/NewsCards/NewsCardsLayout";
import { FilterDateSliderWrapper } from "./CustomWebComponents/FilterDateSlider/FilterDateSliderWrapper";
import { FilterNumericSliderWrapper } from "./CustomWebComponents/FilterNumericSlider/FilterNumericSliderWrapper";
import { FilterYesNoWrapper } from "./CustomWebComponents/FilterYesNo/FilterYesNoWrapper";
import { PageBookmarkWrapper } from "./CustomWebComponents/PageBookmark/PageBookmarkWrapper";
import { PageCommentsWrapper } from "./CustomWebComponents/PageComments/PageCommentsWrapper";
import { PageDateWrapper } from "./CustomWebComponents/PageDate/PageDateWrapper";
import { PageLikeWrapper } from "./CustomWebComponents/PageLike/PageLikeWrapper";
import { PanelFilePreviewWrapper } from "./CustomWebComponents/PanelFilePreview/PanelFilePreviewWrapper";
import { ServiceKey } from "@microsoft/sp-core-library";
// import { FilterDateIntervalWebComponent } from "./CustomWebComponents/FilterCustomDateInterval/FilterDateIntervalComponent";
// import { FilterComboBoxWebComponent } from "./CustomWebComponents/FilterCustomCombobox/FilterComboBoxComponent";
import { FilterYesNoCheckboxWebComponent } from "./CustomWebComponents/FilterYesNoCheckBox/FilterYesNoCheckBoxComponent";

export class PnPSearchFeaturePackLibrary implements IExtensibilityLibrary {
  getCustomLayouts(): ILayoutDefinition[] {
    return [
      {
          name: 'News Cards Layout',
          iconName: 'News',
          key: 'REDNewsCardsLayout',
          type: LayoutType.Results,
          renderType: LayoutRenderType.Handlebars,
          templateContent: require('./CustomLayouts/NewsCards/newscards-layout.html'),
          serviceKey: ServiceKey.create<ILayout>('RED:NewsCardsLayout', NewsCardsLayout)
      }
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
              componentName: 'filter-yesnocheckbox',
              componentClass: FilterYesNoCheckboxWebComponent
            },
            {
              componentName: 'filter-dateslider',
              componentClass: FilterDateSliderWrapper
            },
            {
              componentName: 'filter-numericslider',
              componentClass: FilterNumericSliderWrapper
            },
            {
              componentName: 'filter-yesno',
              componentClass: FilterYesNoWrapper
            },
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
    handlebarsNamespace.registerHelper('math', (lvalueStr:string, operator:string, rvalueStr:string) => {
      const lvalue = parseFloat(lvalueStr);
      const rvalue = parseFloat(rvalueStr);
        
      return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
      }[operator];
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
    return [];
  }

  public name(): string {
    return 'PnPSearchFeaturePackLibrary';
  }
}
