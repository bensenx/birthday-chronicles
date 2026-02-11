import summaryData from '@/data/events-summary.json';

export interface DaySummary {
    id: string;
    date: string;
    title: string;
    intro: string;
    eventCount: number;
}

export const getAllDaysSummary = (): DaySummary[] => {
    return summaryData as DaySummary[];
};
