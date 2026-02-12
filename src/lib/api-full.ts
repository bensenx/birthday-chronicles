import eventsData from '@/data/events.json';
import { EventItem, DayEntry } from './types';

export const getAllDays = (): DayEntry[] => {
    return eventsData as DayEntry[];
};

export const getDayById = (id: string): DayEntry | undefined => {
    return (eventsData as DayEntry[]).find(d => d.id === id);
};
