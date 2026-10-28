import { z } from 'zod';
export const inquiryKinds = [
    'Strategic partnership',
    'Project proposal',
    'General enquiry',
] as const;
export const sectorOptions = ['Industry', 'Commerce', 'Technology', 'Other'] as const;
export const contactSchema = z.object({
    name: z.string().trim().min(2, 'Enter your full name.').max(100),
    company: z.string().trim().min(2, 'Enter your organisation.').max(150),
    email: z.email('Enter a valid business email.').max(254),
    country: z.string().trim().min(2).max(100),
    sector: z.enum(sectorOptions),
    inquiryType: z.enum(inquiryKinds),
    message: z.string().trim().min(15, 'Please provide at least 15 characters.').max(5000),
    website: z.string().max(200), // honeypot: must remain empty
    consent: z.literal(true, { error: 'Consent is required.' }),
});
export type ContactFormValues = z.infer<typeof contactSchema>;
