import {
    ArrowRight,
    CheckCircle2,
    Cloud,
    Code2,
    Database,
    ExternalLink,
    Globe2,
    Image as ImageIcon,
    KeyRound,
    LockKeyhole,
    Mail,
    MapPinned,
    MessageCircle,
    Package,
    Rocket,
    Server,
    Settings,
    ShieldCheck,
    ShoppingBag,
    Store,
    Truck,
    UserRound,
} from 'lucide-react';
import { BsGithub } from 'react-icons/bs';

type Service = {
    name: string;
    purpose: string;
    loginRequirement: string;
    projectUrl: string;
    loginUrl: string;
    status?: 'Required' | 'Optional';
    note?: string;
    icon: React.ReactNode;
};

const services: Service[] = [
    {
        name: 'GitHub',
        purpose:
            'Source code repository, version control, branches, commits, and collaboration.',
        loginRequirement:
            'Client needs a GitHub account with access to the project repository. Keep 2FA/passkey enabled.',
        projectUrl: 'YOUR_GITHUB_REPOSITORY_URL',
        loginUrl: 'YOUR_GITHUB_LOGIN_URL',
        status: 'Required',
        note:
            'Repository ownership should ultimately be under the client or client-owned GitHub organization.',
        icon: <BsGithub className="h-5 w-5" />,
    },
    {
        name: 'Vercel',
        purpose:
            'Production deployment, hosting, environment variables, domains, deployments, and logs.',
        loginRequirement:
            'Client needs a Vercel account and access to the project. Team/project access is preferred over password sharing.',
        projectUrl: 'YOUR_VERCEL_PROJECT_URL',
        loginUrl: 'YOUR_VERCEL_LOGIN_URL',
        status: 'Required',
        note:
            'The production project and billing should be transferred to the client-owned Vercel account/team.',
        icon: <Cloud className="h-5 w-5" />,
    },
    {
        name: 'MongoDB Atlas',
        purpose:
            'Production database, collections, database users, backups, network access, and database management.',
        loginRequirement:
            'Client needs a MongoDB Atlas account with access to the production organization/project.',
        projectUrl: 'YOUR_MONGODB_ATLAS_PROJECT_URL',
        loginUrl: 'YOUR_MONGODB_ATLAS_LOGIN_URL',
        status: 'Required',
        note:
            'Never place the MongoDB connection string inside frontend code. Store it as a server-side environment variable.',
        icon: <Database className="h-5 w-5" />,
    },
    {
        name: 'Geoapify',
        purpose:
            'USA address autocomplete and geocoding functionality used during checkout.',
        loginRequirement:
            'Client needs a Geoapify account with access to the project and API key.',
        projectUrl: 'YOUR_GEOAPIFY_PROJECT_URL',
        loginUrl: 'YOUR_GEOAPIFY_LOGIN_URL',
        status: 'Required',
        note:
            'The API key should be stored in the appropriate environment variable and never exposed as private documentation.',
        icon: <MapPinned className="h-5 w-5" />,
    },
   
];

const technologies = [
    {
        name: 'Next.js',
        description:
            'Full-stack React framework for the storefront, admin panel, server rendering and routing.',
    },
    {
        name: 'TypeScript',
        description:
            'Type-safe development across frontend, backend and business logic.',
    },
    {
        name: 'MongoDB',
        description:
            'Database used for products, orders, admin data and store settings.',
    },
    {
        name: 'Mongoose',
        description:
            'MongoDB ODM used for schemas, validation and database operations.',
    },
    {
        name: 'Tailwind CSS',
        description:
            'Responsive and utility-first styling system.',
    },
    {
        name: 'Zod',
        description:
            'Runtime validation for product, order, authentication and form data.',
    },
    {
        name: 'Zustand',
        description:
            'Client-side state management where required, such as cart state.',
    },
    {
        name: 'Server Actions',
        description:
            'Secure server-side mutations for admin and ecommerce operations.',
    },
    {
        name: 'Sonner',
        description:
            'User-friendly success and error notifications.',
    },
    {
        name: 'Geoapify',
        description:
            'USA address autocomplete and geocoding.',
    },
];

const features = [
    {
        title: 'Customer Storefront',
        items: [
            'Responsive ecommerce storefront',
            'Product listing',
            'Product detail pages',
            'Product search/browsing experience',
            'Mobile-friendly layout',
        ],
        icon: <Store className="h-5 w-5" />,
    },
    {
        title: 'Shopping & Checkout',
        items: [
            'Cart management',
            'Quantity controls',
            'Checkout flow',
            'Customer contact information',
            'USA shipping address autocomplete',
            'Order creation',
        ],
        icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
        title: 'Order System',
        items: [
            'Unique order numbers',
            'Order confirmation',
            'Order status management',
            'Payment status management',
            'Order item snapshots',
            'Shipping information',
        ],
        icon: <Package className="h-5 w-5" />,
    },
    {
        title: 'Admin Dashboard',
        items: [
            'Admin authentication',
            'Dashboard statistics',
            'Product management',
            'Create/edit products',
            'Activate/deactivate products',
            'Soft delete products',
            'Order management',
            'Store settings',
        ],
        icon: <Settings className="h-5 w-5" />,
    },
    {
        title: 'Business Tools',
        items: [
            'Printable order invoice',
            'Store information management',
            'Social media links',
            'Shipping cost configuration',
            'Customer information management',
            'Local browser date/time display',
        ],
        icon: <Truck className="h-5 w-5" />,
    },
    {
        title: 'Performance & SEO',
        items: [
            'Responsive design',
            'Server-side data fetching',
            'Route-based revalidation',
            'SEO metadata',
            'Canonical URLs',
            'Open Graph metadata',
        ],
        icon: <Rocket className="h-5 w-5" />,
    },
];

const accessChecklist = [
    'Client-owned GitHub repository or GitHub organization',
    'Client-owned Vercel account/team',
    'Client-owned MongoDB Atlas organization/project',
    'Geoapify account/project access',
    'Domain registrar/DNS access',
    'Cloudinary access if used',
    'Live chat account access if enabled',
    'Production environment variables',
    'Admin login credentials',
    '2FA/recovery method for all important accounts',
];

const environmentVariables = [
    {
        name: 'MONGODB_URI',
        purpose: 'Production MongoDB connection string',
        visibility: 'Server only',
    },
    {
        name: 'NEXT_PUBLIC_GEOAPIFY_API_KEY',
        purpose: 'Geoapify address autocomplete',
        visibility: 'Client-side',
    },
    {
        name: 'Other production secrets',
        purpose:
            'Any additional integration/API credentials configured for the deployment',
        visibility: 'Server only',
    },
];

function ExternalLinkButton({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    const isPlaceholder =
        !href ||
        href.startsWith('YOUR_');

    if (isPlaceholder) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-700">
                <ExternalLink className="h-3.5 w-3.5" />

                Add URL
            </span>
        );
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-orange-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition hover:border-orange-200 hover:bg-orange-50"
        >
            {label}

            <ExternalLink className="h-3.5 w-3.5" />
        </a>
    );
}

function SectionTitle({
    icon,
    eyebrow,
    title,
    description,
}: {
    icon: React.ReactNode;
    eyebrow: string;
    title: string;
    description: string;
}) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-orange-600">
                {icon}

                {eyebrow}
            </div>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-chocolate sm:text-3xl">
                {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-chocolate-soft">
                {description}
            </p>
        </div>
    );
}

export default function ProjectHandoverPage() {
    return (
        <main className="min-h-screen bg-[#fff8f2] text-chocolate">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
                {/* =====================================================
                    Hero
                ===================================================== */}

                <section className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                    <div className="relative p-6 sm:p-8 lg:p-10">
                        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-100/50 blur-3xl" />

                        <div className="relative max-w-4xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">
                                <ShieldCheck className="h-3.5 w-3.5" />

                                Project Handover
                            </div>

                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-chocolate sm:text-4xl lg:text-5xl">
                                Ecommerce Website
                                <span className="block text-orange-600">
                                    Technology & Access Guide
                                </span>
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-6 text-chocolate-soft sm:text-base">
                                This document contains the main
                                features, technologies, third-party
                                services, account requirements and
                                handover information needed to
                                manage and maintain the website
                                after development.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-orange-100 bg-[#fffaf6] p-4">
                                    <p className="text-xs text-chocolate-muted">
                                        Application
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        Custom Ecommerce
                                    </p>
                                </div>

                                <div className="rounded-xl border border-orange-100 bg-[#fffaf6] p-4">
                                    <p className="text-xs text-chocolate-muted">
                                        Frontend
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        Next.js + TypeScript
                                    </p>
                                </div>

                                <div className="rounded-xl border border-orange-100 bg-[#fffaf6] p-4">
                                    <p className="text-xs text-chocolate-muted">
                                        Database
                                    </p>

                                    <p className="mt-1 text-sm font-semibold">
                                        MongoDB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    Features
                ===================================================== */}

                <section className="mt-8">
                    <SectionTitle
                        icon={
                            <ShoppingBag className="h-4 w-4" />
                        }
                        eyebrow="01 · Features"
                        title="What the website includes"
                        description="The main customer-facing, ecommerce and administration capabilities included in the application."
                    />

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={feature.title}
                                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-sm font-semibold text-chocolate">
                                        {feature.title}
                                    </h3>
                                </div>

                                <div className="mt-4 space-y-2.5">
                                    {feature.items.map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="flex items-start gap-2 text-sm leading-5 text-chocolate-soft"
                                            >
                                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                                                <span>
                                                    {item}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* =====================================================
                    Technologies
                ===================================================== */}

                <section className="mt-12">
                    <SectionTitle
                        icon={
                            <Code2 className="h-4 w-4" />
                        }
                        eyebrow="02 · Technology"
                        title="Technology stack"
                        description="Modern technologies used to build and operate the ecommerce application."
                    />

                    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                        <div className="grid divide-y divide-orange-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
                            {technologies.map((technology) => (
                                <div
                                    key={technology.name}
                                    className="p-5"
                                >
                                    <h3 className="text-sm font-semibold text-chocolate">
                                        {technology.name}
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-chocolate-soft">
                                        {
                                            technology.description
                                        }
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    Accounts
                ===================================================== */}

                <section className="mt-12">
                    <SectionTitle
                        icon={
                            <KeyRound className="h-4 w-4" />
                        }
                        eyebrow="03 · Accounts"
                        title="Accounts & third-party services"
                        description="These services may be required to deploy, operate or maintain the website. Replace every placeholder with the actual project-specific URL before sharing this document."
                    />

                    <div className="space-y-4">
                        {services.map((service) => (
                            <article
                                key={service.name}
                                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex min-w-0 gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                                            {service.icon}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-base font-semibold text-chocolate">
                                                    {
                                                        service.name
                                                    }
                                                </h3>

                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                                        service.status ===
                                                        'Required'
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {
                                                        service.status
                                                    }
                                                </span>
                                            </div>

                                            <p className="mt-2 max-w-3xl text-sm leading-6 text-chocolate-soft">
                                                {
                                                    service.purpose
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                                        <ExternalLinkButton
                                            href={
                                                service.projectUrl
                                            }
                                            label="Project"
                                        />

                                        <ExternalLinkButton
                                            href={
                                                service.loginUrl
                                            }
                                            label="Login"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-4 border-t border-orange-100 pt-5 md:grid-cols-2">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                                            <UserRound className="h-3.5 w-3.5" />

                                            Login requirement
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-chocolate-soft">
                                            {
                                                service.loginRequirement
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-chocolate-muted">
                                            <ShieldCheck className="h-3.5 w-3.5" />

                                            Important note
                                        </div>

                                        <p className="mt-2 text-sm leading-6 text-chocolate-soft">
                                            {
                                                service.note
                                            }
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* =====================================================
                    Required access
                ===================================================== */}

                <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={
                                <LockKeyhole className="h-4 w-4" />
                            }
                            eyebrow="04 · Handover"
                            title="Access required from the client"
                            description="For long-term ownership, these accounts and access methods should be controlled by the client."
                        />

                        <div className="space-y-3">
                            {accessChecklist.map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3 rounded-xl bg-[#fffaf6] px-4 py-3"
                                    >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                                        <span className="text-sm leading-5 text-chocolate-soft">
                                            {item}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                        <SectionTitle
                            icon={
                                <Server className="h-4 w-4" />
                            }
                            eyebrow="05 · Environment"
                            title="Environment variables"
                            description="Production configuration should be transferred securely. Do not send secrets through the website or public documentation."
                        />

                        <div className="space-y-3">
                            {environmentVariables.map(
                                (variable) => (
                                    <div
                                        key={variable.name}
                                        className="rounded-xl border border-orange-100 bg-[#fffaf6] p-4"
                                    >
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <code className="text-xs font-semibold text-chocolate">
                                                {
                                                    variable.name
                                                }
                                            </code>

                                            <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                                                {
                                                    variable.visibility
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-chocolate-soft">
                                            {
                                                variable.purpose
                                            }
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs font-semibold text-amber-800">
                                Security
                            </p>

                            <p className="mt-1 text-xs leading-5 text-amber-700">
                                Never share passwords, database
                                credentials or private API keys
                                inside this handover page.
                                Transfer access through the
                                provider&apos;s team/invite system
                                whenever possible.
                            </p>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    Login process
                ===================================================== */}

                <section className="mt-12">
                    <SectionTitle
                        icon={
                            <UserRound className="h-4 w-4" />
                        }
                        eyebrow="06 · Login process"
                        title="How account access works"
                        description="The client should use their own account and security methods rather than receiving shared passwords."
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                step: '01',
                                title: 'Create / use account',
                                text: 'Create the account using the client-owned business email or approved login provider.',
                            },
                            {
                                step: '02',
                                title: 'Accept invitation',
                                text: 'Accept repository, deployment or service invitations sent to the client account.',
                            },
                            {
                                step: '03',
                                title: 'Enable security',
                                text: 'Enable 2FA, passkey or the strongest available account security option.',
                            },
                            {
                                step: '04',
                                title: 'Store recovery access',
                                text: 'Keep recovery codes and backup methods in a secure password manager.',
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                            >
                                <span className="text-xs font-bold tracking-[0.14em] text-orange-600">
                                    {item.step}
                                </span>

                                <h3 className="mt-3 text-sm font-semibold text-chocolate">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-xs leading-5 text-chocolate-soft">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* =====================================================
                    Deployment / ownership
                ===================================================== */}

                <section className="mt-12 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
                    <SectionTitle
                        icon={
                            <Globe2 className="h-4 w-4" />
                        }
                        eyebrow="07 · Ownership"
                        title="Recommended final ownership setup"
                        description="For a clean long-term handover, the client should control the production infrastructure."
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: (
                                    <BsGithub  className="h-5 w-5" />
                                ),
                                title: 'Code',
                                text: 'Client-owned GitHub repository or organization.',
                            },
                            {
                                icon: (
                                    <Cloud className="h-5 w-5" />
                                ),
                                title: 'Hosting',
                                text: 'Client-owned Vercel project/team and billing.',
                            },
                            {
                                icon: (
                                    <Database className="h-5 w-5" />
                                ),
                                title: 'Database',
                                text: 'Client-owned MongoDB Atlas project and billing.',
                            },
                            {
                                icon: (
                                    <Globe2 className="h-5 w-5" />
                                ),
                                title: 'Domain',
                                text: 'Client-owned domain registrar and DNS account.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-xl border border-orange-100 bg-[#fffaf6] p-4"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600">
                                    {item.icon}
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-chocolate">
                                    {item.title}
                                </h3>

                                <p className="mt-1.5 text-xs leading-5 text-chocolate-soft">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* =====================================================
                    Support
                ===================================================== */}

                <section className="mt-8 overflow-hidden rounded-2xl border border-orange-100 bg-[#fffaf6] shadow-sm">
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600">
                                    <Mail className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-chocolate">
                                        Post-launch support
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-sm leading-6 text-chocolate-soft">
                                        1 month of free support is
                                        included for bugs or issues
                                        related to the delivered
                                        features.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                                <p className="text-xs font-semibold text-emerald-700">
                                    Included
                                </p>

                                <p className="mt-0.5 text-sm font-semibold text-emerald-800">
                                    1 Month Free Support
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =====================================================
                    Footer
                ===================================================== */}

              
            </div>
        </main>
    );
}