export class DomPurifyHelper {
    /**
     * Allows custom attributes
     * @param attr the attribute name
     * @param data the DOMPurify data
     */
    public static allowCustomAttributesHook(attr: string, data: any) {
        if (data && data.attrName) {
            if (data.attrName.indexOf("on") === 0) return;
            data.allowedAttributes[data.attrName] = true;
            data.forceKeepAttr = true;
        }
    }

    /**
     * Allows custom components (ex: <my-component>)
     * @param node the HTML node
     * @param data the DOMPurify data
     */
    public static allowCustomComponentsHook(node: any, data: any) {
        if (
            node.nodeName &&
            node.nodeName.match(/^\w+(-\w+)+$/) &&
            !data.allowedTags[data.tagName]
        ) {
            data.allowedTags[data.tagName] = true;
        }
    }
}
