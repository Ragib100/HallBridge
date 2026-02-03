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
