import type { ReactNode } from 'react';

export interface LegalSection {
    id: string;
    label: string;
}

export function LegalLayout({
    eyebrow,
    title,
    intro,
    updatedDate,
    sections,
    children,
}: {
    eyebrow: string;
    title: string;
    intro: string;
    updatedDate: string;
    sections: LegalSection[];
    children: ReactNode;
}) {
    return (
        <div className="bg-[#FFF8F0]">
            {/* Header */}
            <header className="border-b border-[#EADBCB] px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="font-serif text-sm italic text-[#B0703A]">{eyebrow}</p>
                    <h1 className="mt-3 font-serif text-4xl text-[#3B2314] sm:text-5xl">{title}</h1>
                    <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-[#6B4A35]">
                        {intro}
                    </p>
                    <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#B0703A]">
                        Last updated {updatedDate}
                    </p>
                </div>
            </header>

            {/* Body */}
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-14 md:grid-cols-[200px_1fr] md:gap-16 md:py-20">
                {/* In-page nav */}
                <nav aria-label="Sections" className="hidden md:block">
                    <div className="sticky top-8 space-y-1 border-l border-[#EADBCB] pl-5">
                        {sections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="block py-1 text-[13px] leading-snug text-[#6B4A35] transition-colors hover:text-[#E8751A]"
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>
                </nav>

                {/* Content */}
                <div className="min-w-0 space-y-12">{children}</div>
            </div>
        </div>
    );
}

export function LegalSection({
    id,
    heading,
    children,
}: {
    id: string;
    heading: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="scroll-mt-8">
            <h2 className="font-serif text-2xl text-[#3B2314]">{heading}</h2>
            <div className="prose-legal mt-4 space-y-4 text-[15px] leading-relaxed text-[#4A3626]">
                {children}
            </div>
        </section>
    );
}
