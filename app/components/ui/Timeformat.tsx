'use client';

import { useEffect, useState } from 'react';

interface LocalDateTimeProps {
    date: Date | string;
}

export function LocalDateTime({
    date,
}: LocalDateTimeProps) {
    const [formatted, setFormatted] =
        useState('');

    useEffect(() => {
        const timeZone =
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone;

        setFormatted(
            new Intl.DateTimeFormat('en-US', {
                timeZone,
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            }).format(new Date(date)),
        );
    }, [date]);

    return (
        <span>
            {formatted || '—'}
        </span>
    );
}