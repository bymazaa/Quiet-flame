export function FormError({ message }: { message?: string | string[] }) {
    if (!message) return null;
    const text = Array.isArray(message) ? message[0] : message;
    if (!text) return null;

    return <p className="mt-1.5 text-[13px] text-status-cancelled">{text}</p>;
}
