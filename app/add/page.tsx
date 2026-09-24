'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, ReactNode } from 'react';

const DEBOUNCE_MS = 500;
const MIN_CHARS = 4;

export type AddressFields = {
    street: string;
    apt: string;
    city: string;
    county: string;
    state: string;
    zip: string;
};

type FieldKey = keyof AddressFields;

type NominatimPlace = {
    place_id: number;
    display_name: string;
    address?: Record<string, string>;
};

type Status = 'idle' | 'loading' | 'empty' | 'error';

type Props = {
    onChange?: (fields: AddressFields) => void;
};

const EMPTY_FIELDS: AddressFields = {
    street: '',
    apt: '',
    city: '',
    county: '',
    state: '',
    zip: '',
};

const REQUIRED_MESSAGES: Partial<Record<FieldKey, string>> = {
    street: 'Enter your street address',
    city: 'Enter your city',
    state: 'Enter your state',
    zip: 'Enter your ZIP code',
};

function validate(key: FieldKey, value: string): string {
    const v = value.trim();
    if (!v) return REQUIRED_MESSAGES[key] ?? '';
    if (key === 'zip' && !/^\d{5}(-\d{4})?$/.test(v)) {
        return 'Use a 5-digit ZIP code, like 94103';
    }
    return '';
}

function parsePlace(place: NominatimPlace) {
    const a = place.address ?? {};
    const street = [a.house_number, a.road].filter(Boolean).join(' ');
    const city = a.city || a.town || a.village || a.hamlet || '';
    const state = a.state || '';
    const zip = a.postcode || '';
    const secondary = [city, [state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return {
        street,
        city,
        county: a.county || '',
        state,
        zip,
        primary: street || place.display_name.split(',')[0],
        secondary: secondary || place.display_name,
    };
}

const inputBase =
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-stone-900 placeholder-stone-400 outline-none transition sm:text-sm focus:ring-2';
const inputOk = 'border-stone-300 focus:border-amber-600 focus:ring-amber-600/25';
const inputBad = 'border-red-500 focus:border-red-500 focus:ring-red-500/25';

/* ---------- small pieces ---------- */

function PinIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="mt-0.5 h-4 w-4 shrink-0 text-stone-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
        >
            <path d="M10 18s6-5.2 6-9.5A6 6 0 0 0 4 8.5C4 12.8 10 18 10 18Z" />
            <circle cx="10" cy="8.5" r="2" />
        </svg>
    );
}

function Spinner() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 text-amber-700 motion-safe:animate-spin"
            fill="none"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="3"
            />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function TextField({
    id,
    label,
    optional,
    error,
    children,
}: {
    id: string;
    label: string;
    optional?: boolean;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-stone-700"
            >
                <span>{label}</span>
                {optional && <span className="text-xs font-normal text-stone-400">Optional</span>}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

/* ---------- main component ---------- */

export default function CheckoutAddressForm({ onChange }: Props) {
    const [fields, setFields] = useState<AddressFields>(EMPTY_FIELDS);
    const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
    const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
    const [status, setStatus] = useState<Status>('idle');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            abortRef.current?.abort();
        };
    }, []);

    function commit(next: AddressFields) {
        setFields(next);
        onChange?.(next);
    }

    async function runSearch(value: string) {
        abortRef.current?.abort();
        if (value.trim().length < MIN_CHARS) {
            setSuggestions([]);
            setStatus('idle');
            setOpen(false);
            return;
        }
        const controller = new AbortController();
        abortRef.current = controller;
        setStatus('loading');
        setOpen(true);
        try {
            const params = new URLSearchParams({
                q: value,
                countrycodes: 'us',
                addressdetails: '1',
                format: 'json',
                limit: '5',
                'accept-language': 'en',
            });
            const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
                signal: controller.signal,
            });
            if (!res.ok) throw new Error('Search failed');
            const data: NominatimPlace[] = await res.json();
            setSuggestions(data);
            setActive(-1);
            setStatus(data.length ? 'idle' : 'empty');
        } catch (err) {
            if ((err as Error).name === 'AbortError') return;
            setSuggestions([]);
            setStatus('error');
        }
    }

    function handleStreetChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        commit({ ...fields, street: value });
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(value), DEBOUNCE_MS);
    }

    function handleSelect(place: NominatimPlace) {
        const p = parsePlace(place);
        commit({
            ...fields,
            street: p.street || p.primary,
            city: p.city,
            county: p.county,
            state: p.state,
            zip: p.zip,
        });
        setTouched((t) => ({ ...t, street: true, city: true, state: true, zip: true }));
        setSuggestions([]);
        setStatus('idle');
        setOpen(false);
        setActive(-1);
    }

    function handleStreetKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (!open || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Enter' && active >= 0) {
            e.preventDefault();
            handleSelect(suggestions[active]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    }

    function clearStreet() {
        abortRef.current?.abort();
        commit({ ...fields, street: '' });
        setSuggestions([]);
        setStatus('idle');
        setOpen(false);
    }

    const markTouched = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));
    const errorFor = (key: FieldKey) => (touched[key] ? validate(key, fields[key]) : '');

    function fieldProps(key: FieldKey) {
        const error = errorFor(key);
        return {
            id: key,
            value: fields[key],
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
                commit({ ...fields, [key]: e.target.value }),
            onBlur: () => markTouched(key),
            'aria-invalid': error ? true : undefined,
            'aria-describedby': error ? `${key}-error` : undefined,
            className: `${inputBase} ${error ? inputBad : inputOk}`,
        };
    }

    const streetError = errorFor('street');
    const showDropdown = open && (status !== 'idle' || suggestions.length > 0);

    return (
        <fieldset className="w-full max-w-md space-y-5">
            <legend className="mb-1 text-lg font-semibold text-stone-900">Delivery address</legend>

            {/* Street search */}
            <div className="relative" ref={wrapperRef}>
                <TextField id="street" label="Street address" error={streetError}>
                    <div className="relative">
                        <input
                            id="street"
                            type="text"
                            role="combobox"
                            aria-expanded={showDropdown}
                            aria-controls={listId}
                            aria-autocomplete="list"
                            aria-activedescendant={
                                active >= 0 ? `${listId}-opt-${active}` : undefined
                            }
                            aria-invalid={streetError ? true : undefined}
                            aria-describedby={streetError ? 'street-error' : undefined}
                            value={fields.street}
                            onChange={handleStreetChange}
                            onKeyDown={handleStreetKeyDown}
                            onFocus={() => suggestions.length > 0 && setOpen(true)}
                            onBlur={() => markTouched('street')}
                            placeholder="Start typing to find your address"
                            autoComplete="off"
                            className={`${inputBase} pr-10 ${streetError ? inputBad : inputOk}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {status === 'loading' ? (
                                <Spinner />
                            ) : (
                                fields.street && (
                                    <button
                                        type="button"
                                        onClick={clearStreet}
                                        aria-label="Clear street address"
                                        className="rounded p-0.5 text-stone-400 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-amber-600"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            viewBox="0 0 20 20"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        >
                                            <path d="M5 5l10 10M15 5L5 15" />
                                        </svg>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </TextField>

                {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
                        <ul id={listId} role="listbox" aria-label="Address suggestions">
                            {suggestions.map((s, i) => {
                                const p = parsePlace(s);
                                return (
                                    <li
                                        key={s.place_id}
                                        id={`${listId}-opt-${i}`}
                                        role="option"
                                        aria-selected={i === active}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelect(s)}
                                        onMouseEnter={() => setActive(i)}
                                        className={`flex cursor-pointer gap-2.5 px-3.5 py-2.5 ${
                                            i === active ? 'bg-amber-50' : ''
                                        }`}
                                    >
                                        <PinIcon />
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-stone-900">
                                                {p.primary}
                                            </span>
                                            <span className="block truncate text-xs text-stone-500">
                                                {p.secondary}
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        {status === 'loading' && suggestions.length === 0 && (
                            <p className="px-3.5 py-3 text-sm text-stone-500" role="status">
                                Looking up addresses…
                            </p>
                        )}
                        {status === 'empty' && (
                            <p className="px-3.5 py-3 text-sm text-stone-600" role="status">
                                No matches. Check the spelling, or fill in the fields below.
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="px-3.5 py-3 text-sm text-red-600" role="alert">
                                Address search isn’t working right now. Fill in the fields below
                                instead.
                            </p>
                        )}
                        <p className="border-t border-stone-100 bg-stone-50 px-3.5 py-1.5 text-[11px] text-stone-400">
                            Suggestions by OpenStreetMap
                        </p>
                    </div>
                )}
            </div>

            <TextField id="apt" label="Apartment, suite, etc." optional>
                <input {...fieldProps('apt')} type="text" autoComplete="address-line2" />
            </TextField>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
                <TextField id="city" label="City" error={errorFor('city')}>
                    <input {...fieldProps('city')} type="text" autoComplete="address-level2" />
                </TextField>
                <TextField id="county" label="County" optional>
                    <input {...fieldProps('county')} type="text" />
                </TextField>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
                <TextField id="state" label="State" error={errorFor('state')}>
                    <input {...fieldProps('state')} type="text" autoComplete="address-level1" />
                </TextField>
                <TextField id="zip" label="ZIP code" error={errorFor('zip')}>
                    <input
                        {...fieldProps('zip')}
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="postal-code"
                    />
                </TextField>
            </div>
        </fieldset>
    );
}
