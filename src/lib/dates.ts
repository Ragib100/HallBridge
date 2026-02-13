function getBDDateString(offsetDays = 0): string {
    const bd = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );

    bd.setDate(bd.getDate() + offsetDays);

    const y = bd.getFullYear();
    const m = String(bd.getMonth() + 1).padStart(2, "0");
    const d = String(bd.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

export function getCurrentDateBD(): string {
    return getBDDateString(0);
}

export function getPreviousDateBD(): string {
    return getBDDateString(-1);
}

export function getNextDateBD(): string {
    return getBDDateString(1);
}

export function formatDateBD(date: Date | string): string {
    if (typeof date === "string") return date;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}

export function getDayFromDateBD(date: string): string {
    const [y, m, d] = date.split("-");

    const bdDate = new Date(`${y}-${m}-${d}T00:00:00+06:00`);

    return bdDate.toLocaleDateString("en-US", { weekday: "long" });
}

export function getBDDate(): Date {
    return new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
}

export function getBDTime(): string {
    const bd = getBDDate();

    const hour = String(bd.getHours()).padStart(2, "0");
    const min = String(bd.getMinutes()).padStart(2, "0");
    const sec = String(bd.getSeconds()).padStart(2, "0");

    return `${hour}:${min}:${sec}`;
}

/**
 * Get Bangladesh date with offset in days
 * @param daysOffset Number of days to offset (can be negative)
 * @returns Date object in BD timezone with time set to 00:00:00
 */
export function getBDDateWithOffset(daysOffset: number): Date {
    const bd = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
    bd.setDate(bd.getDate() + daysOffset);
    bd.setHours(0, 0, 0, 0);
    return bd;
}

/**
 * Get Bangladesh date/time with offset in hours
 * @param hoursOffset Number of hours to offset (can be negative)
 * @returns Date object in BD timezone with specified hour offset
 */
export function getBDDateTimeWithOffset(hoursOffset: number): Date {
    const bd = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );
    bd.setHours(bd.getHours() + hoursOffset);
    return bd;
}