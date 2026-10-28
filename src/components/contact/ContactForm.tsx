'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    contactSchema,
    type ContactFormValues,
    inquiryKinds,
    sectorOptions,
} from '@/lib/contactSchema';
import { Send } from 'lucide-react';
export function ContactForm() {
    const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            company: '',
            email: '',
            country: '',
            sector: 'Industry',
            inquiryType: 'Strategic partnership',
            message: '',
            website: '',
        },
    });
    const submit = handleSubmit(async (data) => {
        setState(null);
        try {
            const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '/api/contact.php';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = (await response.json()) as { success?: boolean; message?: string };
            if (!response.ok || !result.success)
                throw new Error(result.message || 'The message could not be sent.');
            setState({
                ok: true,
                message: 'Your enquiry has been sent. Thank you for contacting us.',
            });
            reset();
        } catch (e) {
            setState({
                ok: false,
                message: e instanceof Error ? e.message : 'Unable to send your enquiry.',
            });
        }
    });
    return (
        <form className="sv-contact-form" onSubmit={submit} noValidate>
            <div className="sv-form-row">
                <label>
                    Full name
                    <input
                        {...register('name')}
                        autoComplete="name"
                        placeholder="Your full name"
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && <small role="alert">{errors.name.message}</small>}
                </label>
                <label>
                    Business email
                    <input
                        {...register('email')}
                        type="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <small role="alert">{errors.email.message}</small>}
                </label>
            </div>
            <div className="sv-form-row">
                <label>
                    Organisation
                    <input
                        {...register('company')}
                        autoComplete="organization"
                        placeholder="Company / institution"
                        aria-invalid={!!errors.company}
                    />
                    {errors.company && <small role="alert">{errors.company.message}</small>}
                </label>
                <label>
                    Country
                    <input
                        {...register('country')}
                        autoComplete="country-name"
                        placeholder="Country"
                        aria-invalid={!!errors.country}
                    />
                    {errors.country && <small role="alert">{errors.country.message}</small>}
                </label>
            </div>
            <div className="sv-form-row">
                <label>
                    Sector of interest
                    <select {...register('sector')}>
                        {sectorOptions.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </select>
                    {errors.sector && <small role="alert">{errors.sector.message}</small>}
                </label>
                <label>
                    Enquiry type
                    <select {...register('inquiryType')}>
                        {inquiryKinds.map((x) => (
                            <option key={x}>{x}</option>
                        ))}
                    </select>
                    {errors.inquiryType && <small role="alert">{errors.inquiryType.message}</small>}
                </label>
            </div>
            <label>
                How can we help?
                <textarea
                    rows={6}
                    {...register('message')}
                    placeholder="Tell us about the opportunity or proposal"
                    aria-invalid={!!errors.message}
                />
                {errors.message && <small role="alert">{errors.message.message}</small>}
            </label>
            <label className="sv-honeypot" aria-hidden="true" tabIndex={-1}>
                Website
                <input {...register('website')} autoComplete="off" tabIndex={-1} />
            </label>
            <label className="sv-form-consent">
                <input type="checkbox" {...register('consent')} />I agree to be contacted about my
                enquiry. {errors.consent && <small role="alert">{errors.consent.message}</small>}
            </label>
            {state && (
                <div
                    role="status"
                    className={`sv-form-message ${state.ok ? 'is-success' : 'is-error'}`}
                >
                    {state.message}
                </div>
            )}
            <button className="sv-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending enquiry…' : 'Send enquiry'}
                <Send size={17} />
            </button>
        </form>
    );
}
