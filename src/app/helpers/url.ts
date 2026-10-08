/**
 * Returns true when the value is an absolute http, https or ftp url with a host
 */
export function isUrl(value: string): boolean {
    if (typeof value !== 'string') {
        return false;
    }
    try {
        const url = new URL(value.trim());
        return ['http:', 'https:', 'ftp:'].includes(url.protocol) && url.hostname.length > 0;
    } catch {
        return false;
    }
}
