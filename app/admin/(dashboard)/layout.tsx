export default function AdminLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`h-full antialiased`}>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
