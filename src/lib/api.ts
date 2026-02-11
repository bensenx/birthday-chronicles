import eventsData from '@/data/events.json';
import summaryData from '@/data/events-summary.json';

export interface EventItem {
    emoji: string;
    year: string;
    title: string;
    content: string;
}

export interface DayEntry {
    id: string; // "01_01"
    date: string; // "01-01"
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

// Lightweight summary for home page (~50KB instead of 1.7MB)
export const getAllDaysSummary = (): DaySummary[] => {
    return summaryData as DaySummary[];
};

// Full data - only used on day detail pages
export const getAllDays = (): DayEntry[] => {
    return eventsData as DayEntry[];
};

export const getDayById = (id: string): DayEntry | undefined => {
    return (eventsData as DayEntry[]).find(d => d.id === id);
};
