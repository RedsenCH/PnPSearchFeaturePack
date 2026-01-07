import * as _ from "lodash";

export const sanitize = (input, replacement) => {
    const illegalRe = /[\/\?<>\\:\*\|":]/g;
    const controlRe = /[\x00-\x1f\x80-\x9f]/g;
    const reservedRe = /^\.+$/;
    const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;

    const sanitized = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement);

    return _.truncate(sanitized, {
        length: 250,
        omission: "",
    });
};

/**
 * @abstract download file and save it on local computer
 * @param fileUrl url where to find the file to download
 * @param fileName name of file to save after the download
 */
export function download(fileUrl, fileName) {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.click();
}
