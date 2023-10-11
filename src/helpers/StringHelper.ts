export class StringHelper {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    public static escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }

    public static _bytesToHex(bytes) {
        return Array.from(bytes, (byte: any) =>
            (byte as any).toString(16).padStart(2, "0")
        ).join("");
    }

    public static _stringToUTF8Bytes(string: string): Uint8Array {
        return new TextEncoder().encode(string);
    }

    public static format(string: string, args: string[]): string {
        return string.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    }

    public static isNullOrEmpty(value: string): boolean {
        return value === null || value === undefined || value.length === 0;
    }
}
