export function generateReadableId(prefix: string = 'ID'): string {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${random}`;
}
