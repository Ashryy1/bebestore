export function generateReadableId(prefix: string = 'ID'): string {
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}-${random}`;
}

export const ADMIN_WHATSAPP = '201101925305'; // Central Admin Phone

export function formatWhatsAppNumber(phone: string): string {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, '');

    // If it starts with 01 (Egyptian mobile format), add 2 (country code)
    if (cleaned.startsWith('01') && cleaned.length === 11) {
        return '2' + cleaned;
    }

    // If it starts with 1 (Egyptian mobile format without zero), add 20
    if (cleaned.startsWith('1') && cleaned.length === 10) {
        return '20' + cleaned;
    }

    return cleaned;
}
