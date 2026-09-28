'use client';

import { useEffect, useState } from 'react';

interface LocalDateProps {
    date: string | Date;
}

export function LocalDate({
    date,
}: LocalDateProps) {
    const [formattedDate, setFormattedDate] =
        useState('');

    useEffect(() => {
        const value = new Date(date);

        if (Number.isNaN(value.getTime())) {
            setFormattedDate('—');
            return;
        }

        setFormattedDate(
            value.toLocaleDateString(
                undefined,
                {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                },
            ),
        );
    }, [date]);

    return (
        <time
            dateTime={
                new Date(date).toISOString()
            }
            className="whitespace-nowrap text-sm font-medium text-chocolate-soft"
        >
            {formattedDate || '—'}
        </time>
    );
}