import eventsData from '@/data/events.json';

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

export const getAllDays = (): DayEntry[] => {
    return eventsData as DayEntry[];
};

export const getDayById = (id: string): DayEntry | undefined => {
    return (eventsData as DayEntry[]).find(d => d.id === id);
};
