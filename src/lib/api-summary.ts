import summaryData from '@/data/events-summary.json';
import { DaySummary } from './types';

export const getAllDaysSummary = (): DaySummary[] => {
    return summaryData as DaySummary[];
};
