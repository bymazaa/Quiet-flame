
'use client';

import {
    AlertCircle,
    Check,
    Loader2,
    MapPin,
    Search,
} from 'lucide-react';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

interface ShippingAddressInfo {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface ShippingErrors {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

interface ShippingAddressProps {
    value: ShippingAddressInfo;
    onChange: (
        value: ShippingAddressInfo,
    ) => void;
    errors?: ShippingErrors;
}

/*
 * =============================================================
 * Geoapify Types
 * =============================================================
 */

type GeoapifyProperties = {
    name?: string;

    formatted?: string;

    address_line1?: string;

    address_line2?: string;

    housenumber?: string;

    street?: string;

    city?: string;

    town?: string;

    village?: string;

    municipality?: string;

    state?: string;

    state_code?: string;

    postcode?: string;

    country?: string;

    country_code?: string;
};

type GeoapifyFeature = {
    type: 'Feature';

    properties: GeoapifyProperties;
};

type GeoapifyResponse = {
    type: 'FeatureCollection';

    features: GeoapifyFeature[];
};

/*
 * =============================================================
 * Input Style
 * =============================================================
 */

const inputClass = (error?: string) =>
    `w-full rounded-2xl border bg-[#fffaf6] px-4 py-3 text-sm text-[#3b2419] outline-none transition placeholder:text-gray-400 sm:text-base ${
        error
            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
            : 'border-orange-100 focus:border-orange-400 focus:ring-4 focus:ring-orange-100'
    }`;

/*
 * =============================================================
 * Component
 * =============================================================
 */

export function ShippingAddress({
    value,
    onChange,
    errors,
}: ShippingAddressProps) {
    /*
     * =========================================================
     * Suggestions
     * =========================================================
     */

    const [
        suggestions,
        setSuggestions,
    ] = useState<GeoapifyFeature[]>([]);

    /*
     * =========================================================
     * Loading
     * =========================================================
     */

    const [
        suggestionsLoading,
        setSuggestionsLoading,
    ] = useState(false);

    /*
     * =========================================================
     * Dropdown State
     * =========================================================
     */

    const [isOpen, setIsOpen] =
        useState(false);

    /*
     * =========================================================
     * Keyboard Highlight
     * =========================================================
     */

    const [
        highlightedIndex,
        setHighlightedIndex,
    ] = useState(-1);

    /*
     * =========================================================
     * Debounce Timer
     * =========================================================
     */

    const debounceRef =
        useRef<ReturnType<
            typeof setTimeout
        > | null>(null);

    /*
     * =========================================================
     * Abort Controller
     * =========================================================
     *
     * Cancel previous request when user types again.
     */

    const abortControllerRef =
        useRef<AbortController | null>(
            null,
        );

    /*
     * =========================================================
     * Skip Next Search
     * =========================================================
     *
     * When user selects a suggestion:
     *
     * address changes
     *       ↓
     * useEffect normally runs
     *       ↓
     * another API request
     *
     * We don't want that.
     *
     * This ref prevents the next autocomplete request.
     */

    const skipNextSearchRef =
        useRef(false);

    /*
     * =========================================================
     * Update Field
     * =========================================================
     */

    const updateField = (
        field: keyof ShippingAddressInfo,
        fieldValue: string,
    ) => {
        onChange({
            ...value,
            [field]: fieldValue,
        });
    };

    /*
     * =========================================================
     * Clear Suggestions
     * =========================================================
     */

    const clearSuggestions = () => {
        setSuggestions([]);

        setIsOpen(false);

        setHighlightedIndex(-1);
    };

    /*
     * =========================================================
     * Select Address
     * =========================================================
     */

    const handleSelectAddress = (
        feature: GeoapifyFeature,
    ) => {
        const properties =
            feature.properties;

        /*
         * Street address.
         *
         * Geoapify gives us address_line1
         * for values such as:
         *
         * 1600 Pennsylvania Ave NW
         */

        const selectedAddress =
            properties.address_line1 ||
            [
                properties.housenumber,
                properties.street,
            ]
                .filter(Boolean)
                .join(' ') ||
            properties.formatted ||
            '';

        /*
         * City.
         *
         * Depending on address,
         * Geoapify may use city, town,
         * village or municipality.
         */

        const selectedCity =
            properties.city ||
            properties.town ||
            properties.village ||
            properties.municipality ||
            '';

        /*
         * State.
         */

        const selectedState =
            properties.state ||
            '';

        /*
         * ZIP code.
         */

        const selectedPostalCode =
            properties.postcode ||
            '';

        /*
         * Country.
         */

        const selectedCountry =
            properties.country ||
            'United States';

        /*
         * Prevent the next useEffect from
         * making another autocomplete request.
         */

        skipNextSearchRef.current =
            true;

        /*
         * Cancel any old request.
         */

        abortControllerRef.current?.abort();

        /*
         * Clear debounce timer.
         */

        if (debounceRef.current) {
            clearTimeout(
                debounceRef.current,
            );
        }

        /*
         * Stop loading.
         */

        setSuggestionsLoading(false);

        /*
         * Update all form fields.
         */

        onChange({
            address:
                selectedAddress,

            city:
                selectedCity,

            state:
                selectedState,

            postalCode:
                selectedPostalCode,

            country:
                selectedCountry,
        });

        /*
         * Close dropdown.
         */

        clearSuggestions();
    };

    /*
     * =========================================================
     * Fetch Suggestions
     * =========================================================
     */

    const fetchSuggestions =
        async (
            query: string,
        ) => {
            /*
             * API key from environment.
             */

            const apiKey =
                process.env
                    .NEXT_PUBLIC_GEOAPIFY_API_KEY;

            /*
             * Missing key.
             */

            if (!apiKey) {
                console.error(
                    'Geoapify API key is missing. Add NEXT_PUBLIC_GEOAPIFY_API_KEY to .env.local',
                );

                setSuggestions([]);
                setSuggestionsLoading(
                    false,
                );
                setIsOpen(false);

                return;
            }

            /*
             * Cancel previous request.
             */

            abortControllerRef.current?.abort();

            /*
             * New controller.
             */

            const controller =
                new AbortController();

            abortControllerRef.current =
                controller;

            setSuggestionsLoading(
                true,
            );

            try {
                /*
                 * =================================================
                 * Geoapify Autocomplete Request
                 * =================================================
                 *
                 * USA only.
                 */

                const params =
                    new URLSearchParams({
                        text: query,

                        filter:
                            'countrycode:us',

                        limit: '5',

                        format: 'geojson',

                        lang: 'en',

                        apiKey,
                    });

                const url =
                    `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`;

                const response =
                    await fetch(url, {
                        method: 'GET',

                        signal:
                            controller.signal,
                    });

                /*
                 * Read response as text first.
                 *
                 * This lets us see Geoapify's actual
                 * error message when something goes wrong.
                 */

                const responseText =
                    await response.text();

                /*
                 * Request failed.
                 */

                if (!response.ok) {
                    console.error(
                        'Geoapify API Error:',
                        {
                            status:
                                response.status,

                            statusText:
                                response.statusText,

                            body:
                                responseText,
                        },
                    );

                    throw new Error(
                        `Geoapify request failed with status ${response.status}`,
                    );
                }

                /*
                 * Ignore cancelled request.
                 */

                if (
                    controller.signal
                        .aborted
                ) {
                    return;
                }

                /*
                 * Parse JSON.
                 */

                const data =
                    JSON.parse(
                        responseText,
                    ) as GeoapifyResponse;

                /*
                 * Store suggestions.
                 */

                const features =
                    data.features ?? [];

                setSuggestions(
                    features,
                );

                /*
                 * Open only when results exist.
                 */

                setIsOpen(
                    features.length > 0,
                );

                /*
                 * Reset keyboard highlight.
                 */

                setHighlightedIndex(
                    -1,
                );
            } catch (error) {
                /*
                 * AbortError is normal.
                 *
                 * It happens when user types
                 * a new query and the old request
                 * is cancelled.
                 */

                if (
                    error instanceof
                        DOMException &&
                    error.name ===
                        'AbortError'
                ) {
                    return;
                }

                /*
                 * Other errors.
                 */

                console.error(
                    'Geoapify autocomplete error:',
                    error,
                );

                setSuggestions([]);

                setIsOpen(false);
            } finally {
                /*
                 * Don't change loading state
                 * for cancelled request.
                 */

                if (
                    !controller.signal
                        .aborted
                ) {
                    setSuggestionsLoading(
                        false,
                    );
                }
            }
        };

    /*
     * =========================================================
     * Address Input Effect
     * =========================================================
     *
     * Runs when address changes.
     */

    useEffect(() => {
        const query =
            value.address.trim();

        /*
         * If this address was just selected
         * from suggestions, don't search again.
         */

        if (
            skipNextSearchRef.current
        ) {
            skipNextSearchRef.current =
                false;

            return;
        }

        /*
         * Less than 3 characters:
         * no API call.
         */

        if (query.length < 3) {
            abortControllerRef.current?.abort();

            if (debounceRef.current) {
                clearTimeout(
                    debounceRef.current,
                );
            }

            setSuggestions([]);

            setIsOpen(false);

            setSuggestionsLoading(
                false,
            );

            setHighlightedIndex(-1);

            return;
        }

        /*
         * Clear existing timer.
         */

        if (debounceRef.current) {
            clearTimeout(
                debounceRef.current,
            );
        }

        /*
         * Debounce.
         *
         * Wait 400ms after typing stops.
         */

        debounceRef.current =
            setTimeout(() => {
                void fetchSuggestions(
                    query,
                );
            }, 400);

        /*
         * Cleanup.
         */

        return () => {
            if (
                debounceRef.current
            ) {
                clearTimeout(
                    debounceRef.current,
                );
            }
        };
    }, [value.address]);

    /*
     * =========================================================
     * Component Cleanup
     * =========================================================
     */

    useEffect(() => {
        return () => {
            /*
             * Cancel debounce.
             */

            if (
                debounceRef.current
            ) {
                clearTimeout(
                    debounceRef.current,
                );
            }

            /*
             * Cancel request.
             */

            abortControllerRef.current?.abort();
        };
    }, []);

    /*
     * =========================================================
     * Address Input Change
     * =========================================================
     */

    const handleAddressChange = (
        fieldValue: string,
    ) => {
        /*
         * This is now manual typing,
         * so future search is allowed.
         */

        skipNextSearchRef.current =
            false;

        /*
         * Update address field.
         */

        updateField(
            'address',
            fieldValue,
        );

        /*
         * When input becomes short,
         * hide dropdown immediately.
         */

        if (
            fieldValue.trim()
                .length < 3
        ) {
            abortControllerRef.current?.abort();

            if (
                debounceRef.current
            ) {
                clearTimeout(
                    debounceRef.current,
                );
            }

            setSuggestions([]);

            setIsOpen(false);

            setSuggestionsLoading(
                false,
            );

            setHighlightedIndex(
                -1,
            );
        }
    };

    /*
     * =========================================================
     * Keyboard Navigation
     * =========================================================
     */

    const handleAddressKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        /*
         * No dropdown.
         */

        if (
            !isOpen ||
            suggestions.length ===
                0
        ) {
            return;
        }

        /*
         * Arrow Down
         */

        if (
            event.key ===
            'ArrowDown'
        ) {
            event.preventDefault();

            setHighlightedIndex(
                (current) => {
                    if (
                        current <
                        suggestions.length -
                            1
                    ) {
                        return (
                            current + 1
                        );
                    }

                    return 0;
                },
            );

            return;
        }

        /*
         * Arrow Up
         */

        if (
            event.key ===
            'ArrowUp'
        ) {
            event.preventDefault();

            setHighlightedIndex(
                (current) => {
                    if (
                        current > 0
                    ) {
                        return (
                            current - 1
                        );
                    }

                    return (
                        suggestions.length -
                        1
                    );
                },
            );

            return;
        }

        /*
         * Enter
         */

        if (
            event.key ===
            'Enter'
        ) {
            if (
                highlightedIndex >=
                    0 &&
                suggestions[
                    highlightedIndex
                ]
            ) {
                event.preventDefault();

                handleSelectAddress(
                    suggestions[
                        highlightedIndex
                    ],
                );
            }

            return;
        }

        /*
         * Escape
         */

        if (
            event.key ===
            'Escape'
        ) {
            event.preventDefault();

            clearSuggestions();
        }
    };

    /*
     * =========================================================
     * Suggestion Secondary Text
     * =========================================================
     */

    const getSuggestionSecondaryText =
        (
            feature: GeoapifyFeature,
        ) => {
            const properties =
                feature.properties;

            const parts = [
                properties.city ||
                    properties.town ||
                    properties.village ||
                    properties.municipality,

                properties.state,

                properties.postcode,
            ].filter(Boolean);

            return parts.join(
                ', ',
            );
        };

    /*
     * =========================================================
     * Render
     * =========================================================
     */

    return (
        <section className="w-full rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-gray-50 sm:p-6">

            {/* =================================================
                Header
            ================================================= */}

            <div className="mb-5 sm:mb-6">
                <h2 className="font-serif text-xl font-bold text-[#3b2419] sm:text-2xl">
                    Shipping Address
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500">
                    Start typing your address and select
                    a suggestion to fill the details
                    automatically.
                </p>
            </div>

            <div className="space-y-5">

                {/* =================================================
                    Street Address
                ================================================= */}

                <div>
                    <label
                        htmlFor="shipping-address"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Street Address
                    </label>

                    <div className="relative">

                        {/* Input icon */}

                        <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        {/* Input */}

                        <input
                            id="shipping-address"
                            type="text"
                            value={
                                value.address
                            }
                            onChange={(
                                event,
                            ) =>
                                handleAddressChange(
                                    event.target.value,
                                )
                            }
                            onFocus={() => {
                                if (
                                    suggestions.length >
                                    0
                                ) {
                                    setIsOpen(
                                        true,
                                    );
                                }
                            }}
                            onBlur={() => {
                                /*
                                 * Small delay allows
                                 * suggestion selection
                                 * to finish.
                                 */

                                setTimeout(
                                    () => {
                                        setIsOpen(
                                            false,
                                        );
                                    },
                                    150,
                                );
                            }}
                            onKeyDown={
                                handleAddressKeyDown
                            }
                            placeholder="Start typing your address..."
                            autoComplete="street-address"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={
                                isOpen
                            }
                            aria-controls="shipping-address-suggestions"
                            className={`${inputClass(
                                errors?.address,
                            )} pl-10 pr-11`}
                        />

                        {/* Search/loading */}

                        <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
                            {suggestionsLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                            ) : (
                                <Search className="h-4 w-4 text-gray-400" />
                            )}
                        </div>

                        {/* =================================================
                            Suggestions
                        ================================================= */}

                        {isOpen &&
                        suggestions.length >
                            0 ? (
                            <div
                                id="shipping-address-suggestions"
                                role="listbox"
                                className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl shadow-gray-200/50"
                            >

                                {/* Header */}

                                <div className="border-b border-orange-50 px-4 py-2.5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600">
                                        Address Suggestions
                                    </p>
                                </div>

                                {/* List */}

                                <div className="max-h-80 overflow-y-auto">

                                    {suggestions.map(
                                        (
                                            suggestion,
                                            index,
                                        ) => {
                                            const properties =
                                                suggestion.properties;

                                            /*
                                             * Primary address line.
                                             */

                                            const primary =
                                                properties.address_line1 ||
                                                properties.formatted ||
                                                properties.name ||
                                                'Address';

                                            /*
                                             * Secondary address information.
                                             */

                                            const secondary =
                                                getSuggestionSecondaryText(
                                                    suggestion,
                                                );

                                            /*
                                             * Keyboard selected.
                                             */

                                            const isHighlighted =
                                                highlightedIndex ===
                                                index;

                                            return (
                                                <button
                                                    key={`${properties.formatted ?? primary}-${index}`}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={
                                                        isHighlighted
                                                    }
                                                    onMouseDown={(
                                                        event,
                                                    ) => {
                                                        /*
                                                         * Prevent input
                                                         * blur before
                                                         * selection.
                                                         */

                                                        event.preventDefault();

                                                        handleSelectAddress(
                                                            suggestion,
                                                        );
                                                    }}
                                                    onMouseEnter={() =>
                                                        setHighlightedIndex(
                                                            index,
                                                        )
                                                    }
                                                    className={`flex w-full min-w-0 items-start gap-3 px-4 py-3 text-left transition ${
                                                        isHighlighted
                                                            ? 'bg-orange-50'
                                                            : 'hover:bg-orange-50/60'
                                                    }`}
                                                >

                                                    {/* Icon */}

                                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                                        <MapPin className="h-4 w-4" />
                                                    </div>

                                                    {/* Text */}

                                                    <div className="min-w-0 flex-1">

                                                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#3b2419]">
                                                            {
                                                                primary
                                                            }
                                                        </p>

                                                        {secondary ? (
                                                            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-gray-500">
                                                                {
                                                                    secondary
                                                                }
                                                            </p>
                                                        ) : null}

                                                    </div>

                                                    {/* Check */}

                                                    {isHighlighted ? (
                                                        <Check className="mt-1 h-4 w-4 shrink-0 text-orange-500" />
                                                    ) : null}

                                                </button>
                                            );
                                        },
                                    )}

                                </div>

                                {/* Attribution */}

                                <div className="border-t border-orange-50 bg-[#fffaf6] px-4 py-2">
                                    <p className="text-[10px] text-gray-400">
                                        Powered by
                                        Geoapify
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/* Address error */}

                    {errors?.address && (
                        <p
                            role="alert"
                            className="mt-1.5 text-xs leading-5 text-red-500"
                        >
                            {
                                errors.address
                            }
                        </p>
                    )}
                </div>

                {/* =================================================
                    City + State
                ================================================= */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {/* City */}

                    <div>
                        <label
                            htmlFor="shipping-city"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            City
                        </label>

                        <input
                            id="shipping-city"
                            type="text"
                            value={
                                value.city
                            }
                            onChange={(
                                event,
                            ) =>
                                updateField(
                                    'city',
                                    event.target.value,
                                )
                            }
                            placeholder="City"
                            autoComplete="address-level2"
                            className={inputClass(
                                errors?.city,
                            )}
                        />

                        {errors?.city && (
                            <p
                                role="alert"
                                className="mt-1.5 text-xs leading-5 text-red-500"
                            >
                                {
                                    errors.city
                                }
                            </p>
                        )}
                    </div>

                    {/* State */}

                    <div>
                        <label
                            htmlFor="shipping-state"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            State
                        </label>

                        <input
                            id="shipping-state"
                            type="text"
                            value={
                                value.state
                            }
                            onChange={(
                                event,
                            ) =>
                                updateField(
                                    'state',
                                    event.target.value,
                                )
                            }
                            placeholder="State"
                            autoComplete="address-level1"
                            className={inputClass(
                                errors?.state,
                            )}
                        />

                        {errors?.state && (
                            <p
                                role="alert"
                                className="mt-1.5 text-xs leading-5 text-red-500"
                            >
                                {
                                    errors.state
                                }
                            </p>
                        )}
                    </div>
                </div>

                {/* =================================================
                    ZIP + Country
                ================================================= */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {/* ZIP */}

                    <div>
                        <label
                            htmlFor="shipping-postal-code"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            ZIP Code
                        </label>

                        <input
                            id="shipping-postal-code"
                            type="text"
                            value={
                                value.postalCode
                            }
                            onChange={(
                                event,
                            ) =>
                                updateField(
                                    'postalCode',
                                    event.target.value,
                                )
                            }
                            placeholder="ZIP code"
                            autoComplete="postal-code"
                            inputMode="numeric"
                            className={inputClass(
                                errors?.postalCode,
                            )}
                        />

                        {errors?.postalCode && (
                            <p
                                role="alert"
                                className="mt-1.5 text-xs leading-5 text-red-500"
                            >
                                {
                                    errors.postalCode
                                }
                            </p>
                        )}
                    </div>

                    {/* Country */}

                    <div>
                        <label
                            htmlFor="shipping-country"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Country
                        </label>

                        <input
                            id="shipping-country"
                            type="text"
                            value={
                                value.country ||
                                'United States'
                            }
                            onChange={(
                                event,
                            ) =>
                                updateField(
                                    'country',
                                    event.target.value,
                                )
                            }
                            placeholder="Country"
                            autoComplete="country-name"
                            className={inputClass(
                                errors?.country,
                            )}
                        />

                        {errors?.country && (
                            <p
                                role="alert"
                                className="mt-1.5 text-xs leading-5 text-red-500"
                            >
                                {
                                    errors.country
                                }
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* =====================================================
                Helper
            ===================================================== */}

            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-orange-100 bg-orange-50/60 px-3.5 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />

                <p className="text-xs leading-5 text-gray-500">
                    Start typing at least 3 characters
                    to see USA address suggestions.
                    You can edit any field manually.
                </p>
            </div>

            {/* =====================================================
                Optional API Error Indicator
            ===================================================== */}

            {/*
             * We intentionally don't show API errors to the
             * customer because autocomplete is optional.
             *
             * Manual address entry can continue working.
             *
             * The exact Geoapify error is logged in the
             * browser console for development.
             */}

        </section>
    );
}
