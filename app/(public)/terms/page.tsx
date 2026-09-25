import { LegalLayout, LegalSection } from '@/app/components/legal/LegalLayout';
import { LAST_UPDATED, SITE_CONTACT } from '@/lib/site-contact';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: `Terms & Conditions | ${SITE_CONTACT.brandName}`,
    description: `The terms that apply when you order from ${SITE_CONTACT.brandName}.`,
    alternates: { canonical: '/terms' },
};

const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'payment', label: 'Payment' },
    { id: 'shipping', label: 'Shipping & delivery' },
    { id: 'cancellations', label: 'Cancellations & changes' },
    { id: 'product-care', label: 'Product & candle care' },
    { id: 'website-use', label: 'Use of this website' },
    { id: 'liability', label: 'Liability' },
    { id: 'changes', label: 'Changes to these terms' },
    { id: 'contact', label: 'Contact us' },
];

export default function TermsPage() {
    return (
        <LegalLayout
            eyebrow="Please read before ordering"
            title="Terms & Conditions"
            intro={`These terms govern your use of the ${SITE_CONTACT.brandName} website and any order you place with us.`}
            updatedDate={LAST_UPDATED}
            sections={sections}
        >
            <LegalSection id="overview" heading="Overview">
                <p>
                    By placing an order on this website, you agree to the terms below. If you do not
                    agree with any part of these terms, please do not place an order.
                </p>
            </LegalSection>

            <LegalSection id="orders" heading="Orders">
                <p>
                    You do not need to create an account to order. To place an order, you provide
                    your name, email, phone number and delivery address, review your order, and
                    confirm it. Once submitted, we verify the order on our end (including the
                    product and price) before it is confirmed.
                </p>
                <p>
                    We reserve the right to cancel any order, including after confirmation, if a
                    product listing contained an error, if we suspect fraud, or if we are otherwise
                    unable to fulfil it. If this happens and payment was already collected, you will
                    receive a full refund.
                </p>
            </LegalSection>

            <LegalSection id="pricing" heading="Pricing">
                <p>
                    All prices are shown in US Dollars (USD) and are calculated on our server at the
                    time of order, based on the current listed price of each product. Any discounted
                    or &ldquo;original&rdquo; price shown is for comparison only.
                </p>
                <p>
                    While we try to keep pricing accurate, occasional errors may occur. If a pricing
                    error is discovered before your order is confirmed, we will contact you before
                    proceeding.
                </p>
            </LegalSection>

            <LegalSection id="payment" heading="Payment">
                <p>
                    At this time, orders are placed without online payment collection at checkout;
                    payment is arranged separately as agreed with you. Where online payment is
                    available (for example, through PayPal), your payment is processed securely by
                    that provider, and we only receive confirmation of payment status, not your full
                    payment details.
                </p>
            </LegalSection>

            <LegalSection id="shipping" heading="Shipping & delivery">
                <p>
                    We currently ship within the United States. Delivery times are estimates and are
                    not guaranteed. Any shipping cost applicable to your order is shown during
                    checkout before you place your order.
                </p>
            </LegalSection>

            <LegalSection id="cancellations" heading="Cancellations & changes">
                <p>
                    If you need to cancel or change an order, contact us as soon as possible. We can
                    usually accommodate changes while an order is still &ldquo;Pending&rdquo;, but
                    cannot guarantee changes once an order has been confirmed for delivery.
                </p>
            </LegalSection>

            <LegalSection id="product-care" heading="Product & candle care">
                <p>
                    Our candles are handcrafted and should be burned within sight, away from drafts,
                    flammable objects, children and pets. Trim the wick to about 1/4 inch before
                    each burn, and avoid burning for more than a few hours at a time. We are not
                    responsible for damage or injury resulting from improper use.
                </p>
            </LegalSection>

            <LegalSection id="website-use" heading="Use of this website">
                <p>
                    You agree to use this website only for lawful purposes, and not to attempt to
                    disrupt its normal operation, access data you are not authorized to access, or
                    submit false information when placing an order.
                </p>
            </LegalSection>

            <LegalSection id="liability" heading="Liability">
                <p>
                    To the fullest extent permitted by law, {SITE_CONTACT.brandName} is not liable
                    for any indirect or consequential loss arising from the use of this website or
                    the purchase of our products. Nothing in these terms limits any right you have
                    under applicable consumer protection law that cannot be excluded.
                </p>
            </LegalSection>

            <LegalSection id="changes" heading="Changes to these terms">
                <p>
                    We may update these terms from time to time. The &ldquo;Last updated&rdquo; date
                    at the top of this page reflects the latest revision. Continuing to use the
                    website after changes are posted means you accept the updated terms.
                </p>
            </LegalSection>

            <LegalSection id="contact" heading="Contact us">
                <p>Questions about these terms? Reach us at:</p>
                <ul className="list-none space-y-1 pl-0">
                    <li>
                        <span className="text-[#B0703A]">Email: </span>
                        <a
                            href={`mailto:${SITE_CONTACT.email}`}
                            className="text-[#E8751A] underline underline-offset-2"
                        >
                            {SITE_CONTACT.email}
                        </a>
                    </li>
                    <li>
                        <span className="text-[#B0703A]">Phone: </span>
                        <a href={`tel:${SITE_CONTACT.phone}`} className="text-[#4A3626]">
                            {SITE_CONTACT.phone}
                        </a>
                    </li>
                    <li>
                        <span className="text-[#B0703A]">Address: </span>
                        {SITE_CONTACT.address}
                    </li>
                </ul>
                <p className="pt-2 text-sm text-[#6B4A35]">
                    See also our{' '}
                    <Link
                        href="/privacy-policy"
                        className="text-[#E8751A] underline underline-offset-2"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </LegalSection>
        </LegalLayout>
    );
}
