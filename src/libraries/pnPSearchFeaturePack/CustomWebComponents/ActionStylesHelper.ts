import { IButtonStyles } from "@microsoft/office-ui-fabric-react-bundle";

export default class ActionStylesHelper {
    public static getActionButtonStyles(color:string): IButtonStyles {
        const actionButtonStyles: IButtonStyles = {
            root: {
              color: "#262B3A",
              height: "auto",
            },
            icon: {
              color,
            },
            iconHovered: {
              color,
            },
            rootHovered: {
              color,
            }
          };

        return actionButtonStyles;
    }
}