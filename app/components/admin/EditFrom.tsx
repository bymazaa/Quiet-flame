'use client';

import {
    useMemo,
    useState,
    useTransition,
} from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import {
    productInputSchema,
    type ProductInput,
} from '@/lib/validation/product.schema';

import { updateProductAction } from '@/app/admin/(dashboard)/products/[id]/edit/action';
import { ProductDTO } from '@/services/product.service';

type Props = {
    product: ProductDTO;
};

type FormState = {
    name: string;
    description: string;
    price: string;
    compareAtPrice: string;
    currency: string;
    images: string[];
    isActive: boolean;
};

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export default function EditProductForm({
    product,
}: Props) {
    const router = useRouter();

    const [isPending, startTransition] =
        useTransition();

    const [form, setForm] =
        useState<FormState>({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            compareAtPrice:
                product.compareAtPrice?.toString() ?? '',
            currency: product.currency,
            images:
                product.images.length > 0
                    ? product.images
                    : [''],
            isActive: product.isActive,
        });

    const [errors, setErrors] = useState<
        Record<string, string[]>
    >({});

    const generatedSlug = useMemo(
        () => createSlug(form.name),
        [form.name],
    );

    const discount = useMemo(() => {
        const price = Number(form.price);

        const originalPrice = Number(
            form.compareAtPrice,
        );

        if (
            !price ||
            !originalPrice ||
            originalPrice <= price
        ) {
            return null;
        }

        return Math.round(
            ((originalPrice - price) /
                originalPrice) *
                100,
        );
    }, [
        form.price,
        form.compareAtPrice,
    ]);

    const savings = useMemo(() => {
        const price = Number(form.price);

        const originalPrice = Number(
            form.compareAtPrice,
        );

        if (
            !price ||
            !originalPrice ||
            originalPrice <= price
        ) {
            return null;
        }

        return originalPrice - price;
    }, [
        form.price,
        form.compareAtPrice,
    ]);

    const updateField = <
        K extends keyof FormState,
    >(
        field: K,
        value: FormState[K],
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => {
            const next = { ...prev };

            delete next[field];

            return next;
        });
    };

    const updateImage = (
        index: number,
        value: string,
    ) => {
        setForm((prev) => {
            const images = [...prev.images];

            images[index] = value;

            return {
                ...prev,
                images,
            };
        });

        setErrors((prev) => {
            const next = { ...prev };

            delete next.images;

            return next;
        });
    };

    const addImage = () => {
        if (form.images.length >= 8) return;

        setForm((prev) => ({
            ...prev,
            images: [
                ...prev.images,
                '',
            ],
        }));
    };

    const removeImage = (
        index: number,
    ) => {
        if (form.images.length === 1) return;

        setForm((prev) => ({
            ...prev,
            images: prev.images.filter(
                (_, imageIndex) =>
                    imageIndex !== index,
            ),
        }));
    };

    const getFieldError = (
        field: string,
    ) => {
        return errors[field]?.[0];
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setErrors({});

        const payload: ProductInput = {
            name: form.name.trim(),

            slug: generatedSlug,

            description:
                form.description.trim(),

            price: Number(form.price),

            compareAtPrice:
                form.compareAtPrice.trim() === ''
                    ? null
                    : Number(
                          form.compareAtPrice,
                      ),

            currency:
                form.currency
                    .trim()
                    .toUpperCase(),

            images: form.images
                .map((image) =>
                    image.trim(),
                )
                .filter(Boolean),

            isActive: form.isActive,
        };

        const parsed =
            productInputSchema.safeParse(
                payload,
            );

        if (!parsed.success) {
            setErrors(
                parsed.error.flatten()
                    .fieldErrors,
            );

            toast.error(
                'Please fix the highlighted fields.',
            );

            return;
        }

        startTransition(async () => {
            const result =
                await updateProductAction(
                    product.id,
                    parsed.data,
                );

            if (result.success) {
                toast.success(
                    result.message,
                );

                router.push(
                    '/admin/products',
                );

                router.refresh();

                return;
            }

            toast.error(result.error);

            if (result.fieldErrors) {
                setErrors(
                    result.fieldErrors,
                );
            }
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 shadow-2xl shadow-gray-50">
                        Product Management
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Edit Product
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        Update your product information,
                        pricing and images.
                    </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-2xl shadow-gray-50">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Product Status
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${
                                form.isActive
                                    ? 'bg-emerald-500'
                                    : 'bg-gray-300'
                            }`}
                        />

                        <span className="text-sm font-bold text-gray-800">
                            {form.isActive
                                ? 'Active'
                                : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                {/* Left */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                        <div className="mb-7">
                            <h2 className="text-lg font-bold text-gray-900">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the main information
                                about your product.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Product Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={form.name}
                                    onChange={(e) =>
                                        updateField(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    disabled={isPending}
                                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-2xl shadow-gray-50 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-gray-50"
                                />

                                {getFieldError(
                                    'name',
                                ) && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {getFieldError(
                                            'name',
                                        )}
                                    </p>
                                )}
                            </div>

                            {/* Slug */}
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        URL Slug
                                    </label>

                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                                        Auto generated
                                    </span>
                                </div>

                                <div className="flex overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-50">
                                    <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-gray-400">
                                        /products/
                                    </div>

                                    <div className="min-w-0 flex-1 px-4 py-3.5 text-sm font-medium text-gray-700">
                                        {generatedSlug}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Description
                                    </label>

                                    <span className="text-xs text-gray-400">
                                        {
                                            form.description
                                                .length
                                        }
                                        /5000
                                    </span>
                                </div>

                                <textarea
                                    id="description"
                                    rows={6}
                                    value={
                                        form.description
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    disabled={isPending}
                                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-2xl shadow-gray-50 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-gray-50"
                                />

                                {getFieldError(
                                    'description',
                                ) && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {getFieldError(
                                            'description',
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                        <div className="mb-7">
                            <h2 className="text-lg font-bold text-gray-900">
                                Pricing
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update selling price and
                                original price.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Selling Price */}
                            <div className="rounded-3xl border border-orange-200 bg-orange-50/70 p-5 shadow-2xl shadow-gray-50">
                                <div className="mb-5 flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                                            Selling Price
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Current price
                                        </p>
                                    </div>

                                    <span className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow-2xl shadow-gray-50">
                                        {form.currency}
                                    </span>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                                        $
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) =>
                                            updateField(
                                                'price',
                                                e.target.value,
                                            )
                                        }
                                        disabled={isPending}
                                        className="w-full rounded-2xl border border-orange-200 bg-white py-4 pl-9 pr-4 text-xl font-bold text-gray-900 shadow-2xl shadow-gray-50 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Original Price */}
                            <div className="rounded-3xl border border-gray-200 bg-gray-50/70 p-5 shadow-2xl shadow-gray-50">
                                <div className="mb-5 flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                            Original Price
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Before discount
                                        </p>
                                    </div>

                                    <span className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-gray-500 shadow-2xl shadow-gray-50">
                                        Optional
                                    </span>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                                        $
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            form.compareAtPrice
                                        }
                                        onChange={(e) =>
                                            updateField(
                                                'compareAtPrice',
                                                e.target.value,
                                            )
                                        }
                                        disabled={isPending}
                                        className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-9 pr-4 text-xl font-bold text-gray-900 shadow-2xl shadow-gray-50 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-gray-50"
                                    />
                                </div>

                                {getFieldError(
                                    'compareAtPrice',
                                ) && (
                                    <p className="mt-2 text-xs font-medium text-red-500">
                                        {getFieldError(
                                            'compareAtPrice',
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        {discount !== null &&
                            savings !== null && (
                                <div className="mt-5 flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-2xl shadow-gray-50 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                                                {discount}% OFF
                                            </span>

                                            <span className="text-sm font-semibold text-emerald-700">
                                                Special Discount
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-emerald-700">
                                            Customers save{' '}
                                            <span className="font-bold">
                                                $
                                                {savings.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-xs text-gray-400">
                                            Original
                                        </p>

                                        <p className="text-sm font-medium text-gray-500 line-through">
                                            $
                                            {Number(
                                                form.compareAtPrice,
                                            ).toFixed(2)}
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-gray-900">
                                            $
                                            {Number(
                                                form.price,
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            )}
                    </section>

                    {/* Images */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                        <div className="mb-7 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Product Images
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update product image URLs.
                                </p>
                            </div>

                            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 shadow-2xl shadow-gray-50">
                                {form.images.length}/8
                            </span>
                        </div>

                        <div className="space-y-3">
                            {form.images.map(
                                (image, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-sm font-bold text-orange-500 shadow-2xl shadow-gray-50">
                                            {index + 1}
                                        </div>

                                        <input
                                            type="url"
                                            value={image}
                                            onChange={(e) =>
                                                updateImage(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            disabled={isPending}
                                            className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 shadow-2xl shadow-gray-50 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 disabled:bg-gray-50"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(
                                                    index,
                                                )
                                            }
                                            disabled={
                                                form.images
                                                    .length ===
                                                    1 ||
                                                isPending
                                            }
                                            className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ),
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={addImage}
                            disabled={
                                form.images.length >= 8 ||
                                isPending
                            }
                            className="mt-5 rounded-xl border border-dashed border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-600 shadow-2xl shadow-gray-50 transition hover:bg-orange-100 disabled:opacity-40"
                        >
                            + Add another image
                        </button>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                    {/* Preview */}
                    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-gray-50">
                        <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50 p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                                Product Preview
                            </p>

                            <div className="mt-5 overflow-hidden rounded-3xl bg-white p-4 shadow-2xl shadow-gray-50">
                                <div className="flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                                    {form.images[0] ? (
                                        <img
                                            src={form.images[0]}
                                            alt={form.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            Product image
                                        </span>
                                    )}
                                </div>

                                <div className="pt-5">
                                    <h3 className="line-clamp-2 text-base font-bold text-gray-900">
                                        {form.name}
                                    </h3>

                                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-400">
                                        {form.description}
                                    </p>

                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-xl font-bold text-gray-900">
                                            $
                                            {Number(
                                                form.price,
                                            ).toFixed(2)}
                                        </span>

                                        {form.compareAtPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                $
                                                {Number(
                                                    form.compareAtPrice,
                                                ).toFixed(2)}
                                            </span>
                                        )}

                                        {discount !== null && (
                                            <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                                -{discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Visibility */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">
                            Publish Settings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Control product visibility.
                        </p>

                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gray-50 p-4 shadow-2xl shadow-gray-50">
                            <div>
                                <p className="text-sm font-bold text-gray-800">
                                    Product visibility
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {form.isActive
                                        ? 'Visible to customers'
                                        : 'Hidden from customers'}
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() =>
                                    updateField(
                                        'isActive',
                                        !form.isActive,
                                    )
                                }
                                className={`relative h-7 w-12 rounded-full shadow-2xl shadow-gray-50 ${
                                    form.isActive
                                        ? 'bg-orange-500'
                                        : 'bg-gray-300'
                                }`}
                            >
                                <span
                                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                        form.isActive
                                            ? 'left-6'
                                            : 'left-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </section>

                    {/* URL */}
                    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-2xl shadow-gray-50">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Product URL
                        </p>

                        <div className="mt-3 rounded-2xl bg-gray-50 p-4 shadow-2xl shadow-gray-50">
                            <p className="break-all text-sm font-medium leading-6 text-gray-600">
                                /products/
                                <span className="font-bold text-gray-900">
                                    {generatedSlug}
                                </span>
                            </p>
                        </div>
                    </section>
                </aside>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-gray-50 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                        router.push('/admin/products')
                    }
                    className="rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-2xl shadow-gray-50 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-2xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-2xl shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending
                        ? 'Updating Product...'
                        : 'Update Product'}
                </button>
            </div>
        </form>
    );
}