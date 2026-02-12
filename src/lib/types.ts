export interface EventItem {
    emoji: string;
    year: string;
    title: string;
    content: string;
}

export interface DayEntry {
    id: string;
    date: string;
    title: string;
    intro: string;
    events: EventItem[];
}

export interface DaySummary {
    id: string;
    date: string;
    title: string;
    intro: string;
    eventCount: number;
}
