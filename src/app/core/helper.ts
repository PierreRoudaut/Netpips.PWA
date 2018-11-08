export function pluralize(str: string, count: number) {
    if (count > 1) {
        return count + ' ' + str + 's';
    }
    return 1 + ' ' + str;
}
