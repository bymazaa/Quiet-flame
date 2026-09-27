'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    productInputSchema,
    type ProductInput,
} from '@/lib/validation/product.schema';
import { createProductAction } from './action';


type FormState = {
    name: string;
    description: string;
    price: string;
    compareAtPrice: string;
    currency: string;
    images: string[];
    isActive: boolean;
};

const initialForm: FormState = {
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    currency: 'USD',
    images: [''],
    isActive: true,
};

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export default function ProductCreateForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const generatedSlug = useMemo(
        () => createSlug(form.name),
        [form.name],
    );

    const discount = useMemo(() => {
        const price = Number(form.price);
        const originalPrice = Number(form.compareAtPrice);

        if (
            !price ||
            !originalPrice ||
            originalPrice <= price
        ) {
            return null;
        }

        return Math.round(
            ((originalPrice - price) / originalPrice) * 100,
        );
    }, [form.price, form.compareAtPrice]);

    const savings = useMemo(() => {
        const price = Number(form.price);
        const originalPrice = Number(form.compareAtPrice);

        if (
            !price ||
            !originalPrice ||
            originalPrice <= price
        ) {
            return null;
        }

        return originalPrice - price;
    }, [form.price, form.compareAtPrice]);

    const updateField = <K extends keyof FormState>(
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

    const updateImage = (index: number, value: string) => {
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
            images: [...prev.images, ''],
        }));
    };

    const removeImage = (index: number) => {
        if (form.images.length === 1) return;

        setForm((prev) => ({
            ...prev,
            images: prev.images.filter(
                (_, imageIndex) => imageIndex !== index,
            ),
        }));
    };

    const getFieldError = (field: string) => {
        return errors[field]?.[0];
    };

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setErrors({});

        const payload: ProductInput = {
            name: form.name,
            slug: generatedSlug,
            description: form.description,
            price: Number(form.price),
            compareAtPrice:
                form.compareAtPrice.trim() === ''
                    ? null
                    : Number(form.compareAtPrice),
            currency: form.currency.toUpperCase(),
            images: form.images
                .map((image) => image.trim())
                .filter(Boolean),
            isActive: form.isActive,
        };

        const parsed = productInputSchema.safeParse(payload);

        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);

            toast.error('Please fix the highlighted fields.');
            return;
        }

        startTransition(async () => {
            const result = await createProductAction(parsed.data);

            if (result.success) {
                toast.success(result.message);

                router.push('/admin/products');
                router.refresh();

                return;
            }

            toast.error(result.error);

            if (result.fieldErrors) {
                setErrors(result.fieldErrors);
            }
        });
    };

    return (
        <div className="min-h-screen rounded-3xl bg-[#fff8f2] p-4 sm:p-6 lg:p-8">
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-6xl space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            Product Management
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Create Product
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Add product information, pricing and images to
                            publish a new item in your store.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-2xl shadow-gray-50">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Status
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                    form.isActive
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-300'
                                }`}
                            />

                            <span className="text-sm font-semibold text-slate-800">
                                {form.isActive
                                    ? 'Active'
                                    : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    {/* Left */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_8px_30px_rgba(120,53,15,0.05)]">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Basic Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Keep the product information clear and
                                    easy to understand.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
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
                                        placeholder="e.g. Premium Wireless Headphones"
                                        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white ${
                                            getFieldError('name')
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-slate-200 focus:border-orange-400'
                                        }`}
                                    />

                                    {getFieldError('name') && (
                                        <p className="mt-2 text-xs font-medium text-red-500">
                                            {getFieldError('name')}
                                        </p>
                                    )}
                                </div>

                                {/* Auto Slug */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            URL Slug
                                        </label>

                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                                            Auto generated
                                        </span>
                                    </div>

                                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                        <div className="flex items-center border-r border-slate-200 px-4 text-sm text-slate-400">
                                            /products/
                                        </div>

                                        <div className="min-w-0 flex-1 px-4 py-3.5 text-sm font-medium text-slate-700">
                                            {generatedSlug || 'product-slug'}
                                        </div>
                                    </div>

                                    {getFieldError('slug') && (
                                        <p className="mt-2 text-xs font-medium text-red-500">
                                            {getFieldError('slug')}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-semibold text-slate-700"
                                        >
                                            Description
                                        </label>

                                        <span className="text-xs text-slate-400">
                                            {form.description.length}/5000
                                        </span>
                                    </div>

                                    <textarea
                                        id="description"
                                        rows={6}
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Write a clear description about this product..."
                                        className={`w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white ${
                                            getFieldError('description')
                                                ? 'border-red-400 focus:border-red-500'
                                                : 'border-slate-200 focus:border-orange-400'
                                        }`}
                                    />

                                    {getFieldError('description') && (
                                        <p className="mt-2 text-xs font-medium text-red-500">
                                            {getFieldError('description')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Pricing */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_8px_30px_rgba(120,53,15,0.05)]">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Pricing
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Set the selling price and the original
                                    price customers can compare against.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* Current Price */}
                                <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                                                Selling Price
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Current price
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-orange-600 shadow-2xl shadow-gray-50">
                                            {form.currency}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                                            $
                                        </span>

                                        <input
                                            id="price"
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
                                            placeholder="0.00"
                                            className={`w-full rounded-xl border bg-white py-4 pl-9 pr-4 text-xl font-bold text-slate-900 outline-none ${
                                                getFieldError('price')
                                                    ? 'border-red-400'
                                                    : 'border-orange-200 focus:border-orange-400'
                                            }`}
                                        />
                                    </div>

                                    {getFieldError('price') && (
                                        <p className="mt-2 text-xs font-medium text-red-500">
                                            {getFieldError('price')}
                                        </p>
                                    )}
                                </div>

                                {/* Original Price */}
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                                Original Price
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Price before discount
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-slate-500 shadow-2xl shadow-gray-50">
                                            Optional
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                                            $
                                        </span>

                                        <input
                                            id="compareAtPrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.compareAtPrice}
                                            onChange={(e) =>
                                                updateField(
                                                    'compareAtPrice',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                            className={`w-full rounded-xl border bg-white py-4 pl-9 pr-4 text-xl font-bold text-slate-900 outline-none ${
                                                getFieldError(
                                                    'compareAtPrice',
                                                )
                                                    ? 'border-red-400'
                                                    : 'border-slate-200 focus:border-orange-400'
                                            }`}
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

                            {/* Discount Preview */}
                            {discount !== null && savings !== null && (
                                <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
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
                                            </span>{' '}
                                            on this product.
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-xs text-slate-400">
                                            Original
                                        </p>

                                        <p className="text-sm font-medium text-slate-500 line-through">
                                            $
                                            {Number(
                                                form.compareAtPrice,
                                            ).toFixed(2)}
                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-900">
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
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_8px_30px_rgba(120,53,15,0.05)]">
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Product Images
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add one or more image URLs for the
                                        product.
                                    </p>
                                </div>

                                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
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
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-500">
                                                {index + 1}
                                            </div>

                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) =>
                                                    updateImage(
                                                        index,
                                                        e.target
                                                            .value,
                                                    )
                                                }
                                                placeholder="https://example.com/product-image.jpg"
                                                className={`min-w-0 flex-1 rounded-xl border bg-slate-50 px-4 py-3 text-sm outline-none transition focus:bg-white ${
                                                    getFieldError(
                                                        'images',
                                                    )
                                                        ? 'border-red-400'
                                                        : 'border-slate-200 focus:border-orange-400'
                                                }`}
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
                                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>

                            {getFieldError('images') && (
                                <p className="mt-2 text-xs font-medium text-red-500">
                                    {getFieldError('images')}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={addImage}
                                disabled={
                                    form.images.length >= 8 ||
                                    isPending
                                }
                                className="mt-5 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                + Add another image
                            </button>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">
                        {/* Preview */}
                        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-[0_8px_30px_rgba(120,53,15,0.05)]">
                            <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50 p-6">
                                <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                                    Product Preview
                                </p>

                                <div className="mt-5 rounded-2xl bg-white p-5 shadow-2xl shadow-gray-50">
                                    <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                                        {form.images[0] ? (
                                            <img
                                                src={form.images[0]}
                                                alt="Product preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-400 shadow-2xl shadow-gray-50">
                                                    +
                                                </div>

                                                <p className="text-xs text-slate-400">
                                                    Product image
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="line-clamp-2 font-bold text-slate-900">
                                            {form.name ||
                                                'Your Product Name'}
                                        </h3>

                                        <div className="mt-3 flex items-end gap-2">
                                            <span className="text-xl font-bold text-slate-900">
                                                $
                                                {form.price
                                                    ? Number(
                                                          form.price,
                                                      ).toFixed(2)
                                                    : '0.00'}
                                            </span>

                                            {form.compareAtPrice && (
                                                <span className="text-sm text-slate-400 line-through">
                                                    $
                                                    {Number(
                                                        form.compareAtPrice,
                                                    ).toFixed(2)}
                                                </span>
                                            )}

                                            {discount !== null && (
                                                <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                                                    -{discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Publish Settings */}
                        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-[0_8px_30px_rgba(120,53,15,0.05)]">
                            <h2 className="font-bold text-slate-900">
                                Publish Settings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Control product visibility.
                            </p>

                            <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Product visibility
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
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
                                    className={`relative h-7 w-12 rounded-full transition ${
                                        form.isActive
                                            ? 'bg-orange-500'
                                            : 'bg-slate-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-2xl shadow-gray-50 transition ${
                                            form.isActive
                                                ? 'left-6'
                                                : 'left-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </section>
                    </aside>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex flex-col-reverse gap-3 p-4] sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                            router.push('/admin/products')
                        }
                        className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 cursor-pointer transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 cursor-pointer transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending
                            ? 'Creating Product...'
                            : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}