import * as React from "react";
import {useState} from "react";
import { ActionButton, IconButton } from "office-ui-fabric-react/lib/Button";
import { IIconProps } from "office-ui-fabric-react/lib/Icon";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { IFilePreview } from "../../../../models/IFilePreview";
import { Stack } from "office-ui-fabric-react/lib/Stack";
import { Text, ITextStyles } from "office-ui-fabric-react/lib/Text";
import { FontSizes } from "office-ui-fabric-react/lib/Styling";

export interface IPanelFilePreviewComponentProps {
    url: string;
    panelPosition?: "left" | "right";
    iconSize?: number;
    fileTitle: string;
    filePath: string;
    panelType?: PanelType;
    isBlocking?: boolean;
}

const PanelFilePreviewComponent: React.FunctionComponent<IPanelFilePreviewComponentProps> = (props: IPanelFilePreviewComponentProps) : JSX.Element => {
    const iconPreview: IIconProps = { iconName: "DocumentSearch", styles: {root: {marginTop: 56, fontSize: props.iconSize || 32}} };
    const [selectedFile, setSelectedFile] = useState<IFilePreview>(null);

    const panelHeaderStyles = {padding: '0 24px'};
    const panelHeaderTitleStyles: ITextStyles = {root: {fontSize: FontSizes.size18, fontWeight: 600}};

    const unselectFile = (): void => {
        setSelectedFile(null);
    };

    return (
        <> { props.filePath && (
            <ActionButton
                iconProps={iconPreview}
                onClick={(event) => {
                    event.preventDefault();
                    setSelectedFile({title: props.fileTitle, path: props.filePath});
                }}
            />)}
            {selectedFile && <Panel
                styles={ {main: { left: props.panelPosition === "left" && "0px" }}}
                onRenderHeader={() =>
                    <Stack horizontal horizontalAlign={'space-between'} tokens={panelHeaderStyles}>
                        <Text styles={panelHeaderTitleStyles}>{selectedFile.title}</Text>
                        <IconButton iconProps={{iconName : 'ChromeClose'}} onClick={unselectFile} />
                    </Stack>
                }
                isOpen={selectedFile !== null}
                onDismiss={unselectFile}
                headerText="Questions of your community"
                closeButtonAriaLabel="Close"
                onRenderFooterContent={null}
                // Stretch panel content to fill the available height so the footer is positioned at the bottom of the page
                isFooterAtBottom={true}
                type={props.panelType !== null ? props.panelType : PanelType.medium}
                isBlocking={props.isBlocking}
                hasCloseButton={false}
            >
                {selectedFile?.path.length && <iframe src={selectedFile.path} width="100%" style={{height: "90vh", border: "none"}}></iframe>}
            </Panel>}
        </>
    );
};

export default PanelFilePreviewComponent;