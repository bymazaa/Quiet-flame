import { Types } from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { Product, type ProductDB } from '@/models/Product';
import {
    productInputSchema,
    productListQuerySchema,
    setProductActiveSchema,
} from '@/lib/validation/product.schema';
import { objectIdSchema } from '@/lib/validation/common.schema';
import { escapeRegex, getPagination, getTotalPages } from '@/lib/utils';
import {
    ok,
    fail,
    validationFail,
    handleError,
    type ActionResult,
} from '@/lib/action-result';

const ADMIN_PAGE_SIZE = 10;

export interface ProductDTO {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice: number | null;
    currency: string;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type LeanProduct = ProductDB & { _id: Types.ObjectId };

function toDTO(doc: LeanProduct): ProductDTO {
    return {
        id: doc._id.toString(),
        name: doc.name,
        slug: doc.slug,
        description: doc.description ?? '',
        price: doc.price,
        compareAtPrice: doc.compareAtPrice ?? null,
        currency: doc.currency,
        images: doc.images ?? [],
        isActive: doc.isActive,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
    };
}

/** true if the error is a MongoDB duplicate-key error (E11000) */
function isDuplicateKeyError(error: unknown): boolean {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: number }).code === 11000
    );
}

/* ------------------------------------------------------------------ */
/* Public reads                                                       */
/* ------------------------------------------------------------------ */

/** /products page: only active, non-deleted products. */
export async function getActiveProducts(): Promise<ProductDTO[]> {
    await connectDB();

    const products = await Product.find({
        isActive: true,
        deletedAt: null,
    })
        .sort({ createdAt: -1 })
        .lean<LeanProduct[]>();

    return products.map(toDTO);
}

/** /products/[slug] page. Returns null if not found, inactive, or deleted. */
export async function getProductBySlug(
    slug: string,
): Promise<ProductDTO | null> {
    await connectDB();

    const product = await Product.findOne({
        slug: slug.toLowerCase(),
        isActive: true,
        deletedAt: null,
    }).lean<LeanProduct | null>();

    return product ? toDTO(product) : null;
}

/* ------------------------------------------------------------------ */
/* Admin reads                                                        */
/* ------------------------------------------------------------------ */

export interface PaginatedProducts {
    products: ProductDTO[];
    total: number;
    page: number;
    totalPages: number;
}

/** /admin/products table: all non-deleted products (active + inactive), searchable, paginated. */
export async function getAdminProducts(
    query: unknown,
): Promise<ActionResult<PaginatedProducts>> {
    const parsed = productListQuerySchema.safeParse(query);

    if (!parsed.success) {
        return validationFail(parsed.error);
    }

    try {
        await connectDB();

        const { page, search } = parsed.data;

        const filter: Record<string, unknown> = {
            deletedAt: null,
        };

        if (search) {
            filter.name = {
                $regex: escapeRegex(search),
                $options: 'i',
            };
        }

        const { skip, limit } = getPagination(
            page,
            ADMIN_PAGE_SIZE,
        );

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean<LeanProduct[]>(),

            Product.countDocuments(filter),
        ]);

        return ok(undefined, {
            products: products.map(toDTO),
            total,
            page,
            totalPages: getTotalPages(total, ADMIN_PAGE_SIZE),
        });
    } catch (error) {
        return handleError(error);
    }
}

/** /admin/products/[id]/edit: prefill the form. */
export async function getProductById(
    id: string,
): Promise<ProductDTO | null> {
    const parsedId = objectIdSchema.safeParse(id);

    if (!parsedId.success) {
        return null;
    }

    await connectDB();

    const product = await Product.findOne({
        _id: parsedId.data,
        deletedAt: null,
    }).lean<LeanProduct | null>();

    return product ? toDTO(product) : null;
}

/* ------------------------------------------------------------------ */
/* Admin writes                                                       */
/* ------------------------------------------------------------------ */

/** /admin/products/new */
export async function createProduct(
    data: unknown,
): Promise<ActionResult<ProductDTO>> {
    const parsed = productInputSchema.safeParse(data);

    if (!parsed.success) {
        return validationFail(parsed.error);
    }

    try {
        await connectDB();

        const product = await Product.create({
            ...parsed.data,
            deletedAt: null,
        });

        return ok(
            'Product created successfully.',
            toDTO(product.toObject() as LeanProduct),
        );
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return fail(
                'A product with this slug already exists.',
                {
                    slug: ['This slug is already in use'],
                },
            );
        }

        return handleError(error);
    }
}

/** /admin/products/[id]/edit */
export async function updateProduct(
    id: string,
    data: unknown,
): Promise<ActionResult<ProductDTO>> {
    const parsedId = objectIdSchema.safeParse(id);

    if (!parsedId.success) {
        return fail('Invalid product.');
    }

    const parsed = productInputSchema.safeParse(data);

    if (!parsed.success) {
        return validationFail(parsed.error);
    }

    try {
        await connectDB();

        const product = await Product.findOneAndUpdate(
            {
                _id: parsedId.data,
                deletedAt: null,
            },
            {
                $set: parsed.data,
            },
            {
                returnDocument: 'after',
                runValidators: true,
            },
        ).lean<LeanProduct | null>();

        if (!product) {
            return fail('Product not found.');
        }

        return ok(
            'Product updated successfully.',
            toDTO(product),
        );
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            return fail(
                'A product with this slug already exists.',
                {
                    slug: ['This slug is already in use'],
                },
            );
        }

        return handleError(error);
    }
}

/** Activate / deactivate toggle in the admin product table. */
export async function setProductActive(
    id: string,
    isActive: boolean,
): Promise<ActionResult> {
    const parsed = setProductActiveSchema.safeParse({
        id,
        isActive,
    });

    if (!parsed.success) {
        return validationFail(parsed.error);
    }

    try {
        await connectDB();

        const result = await Product.updateOne(
            {
                _id: parsed.data.id,
                deletedAt: null,
            },
            {
                $set: {
                    isActive: parsed.data.isActive,
                },
            },
        );

        if (result.matchedCount === 0) {
            return fail('Product not found.');
        }

        return ok(
            parsed.data.isActive
                ? 'Product activated.'
                : 'Product deactivated.',
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * Soft delete: marks the product as deleted and inactive instead of removing
 * it, so historical orders (which store a snapshot) are never affected.
 */
export async function softDeleteProduct(
    id: string,
): Promise<ActionResult> {
    const parsedId = objectIdSchema.safeParse(id);

    if (!parsedId.success) {
        return validationFail(parsedId.error);
    }

    try {
        await connectDB();

        const result = await Product.updateOne(
            {
                _id: parsedId.data,
                deletedAt: null,
            },
            {
                $set: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            },
        );

        if (result.matchedCount === 0) {
            return fail('Product not found.');
        }

        return ok('Product deleted successfully.');
    } catch (error) {
        return handleError(error);
    }
}

/* ------------------------------------------------------------------ */
/* Internal helper - used by order.service.ts only                    */
/* ------------------------------------------------------------------ */

/**
 * Fetch multiple products by id for cart validation / order creation.
 * Returns raw (lean) documents, not DTOs, and is NOT exposed to the client
 * directly. Invalid or missing ids are silently skipped.
 */
export async function getManyByIds(
    ids: string[],
): Promise<LeanProduct[]> {
    const validIds = ids.filter(
        (id) => objectIdSchema.safeParse(id).success,
    );

    if (validIds.length === 0) {
        return [];
    }

    await connectDB();

    return Product.find({
        _id: {
            $in: validIds,
        },
        deletedAt: null,
    }).lean<LeanProduct[]>();
}