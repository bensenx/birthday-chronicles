import { getAllDays, getDayById } from '@/lib/api';
import { EventFocusView } from '@/components/EventFocusView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const days = getAllDays();
    return days.map((day) => ({
        id: day.id,
    }));
}

export default async function DayPage({ params }: PageProps) {
    const { id } = await params;
    const day = getDayById(id);

    if (!day) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950">
            <EventFocusView day={day} />
        </main>
    );
}
