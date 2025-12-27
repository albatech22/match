
/**
 * Returns the local date string in YYYY-MM-DD format.
 * This avoids the common one-day shift issue with toISOString() when the local time is early morning.
 */
export function getLocalDateString(date?: Date | null): string {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
