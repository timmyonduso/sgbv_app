import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    HelpCircle,
    Send,
    Shield,
    Users,
    HeartHandshake
} from 'lucide-react';
import { FormEventHandler } from 'react';
import { Textarea } from '@headlessui/react';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    contact_type: 'general' | 'support' | 'partnership' | 'emergency';
}

interface FAQ {
    question: string;
    answer: string;
}

interface Props {
    faqs?: FAQ[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contact',
        href: '/contact',
    },
];

const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'support', label: 'Technical Support', icon: Shield },
    { value: 'partnership', label: 'Partnership Opportunity', icon: HeartHandshake },
    { value: 'emergency', label: 'Emergency Support', icon: Phone },
];

const defaultFAQs: FAQ[] = [
    {
        question: "How do I report a GBV incident?",
        answer: "You can report incidents through our secure online system or by contacting our 24/7 hotline. All reports are treated with strict confidentiality and handled by trained professionals."
    },
    {
        question: "Is my information kept confidential?",
        answer: "Yes, we maintain strict confidentiality protocols. All personal information is encrypted and access is limited to authorized personnel only. We comply with all data protection regulations."
    },
    {
        question: "What support services are available?",
        answer: "We provide comprehensive support including crisis counseling, legal assistance, medical referrals, shelter services, and ongoing case management. Our team works with you to develop a personalized safety plan."
    },
    {
        question: "How can I become a partner organization?",
        answer: "We welcome partnerships with organizations that share our mission. Please contact us through the partnership inquiry form or email us directly to discuss collaboration opportunities."
    },
    {
        question: "What are your response times?",
        answer: "Emergency situations receive immediate attention. General inquiries are typically responded to within 24-48 hours during business days. Technical support requests are handled within 1-2 business days."
    }
];

export default function Contact({ faqs = defaultFAQs }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        contact_type: 'general',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => {
                reset();
                // You might want to show a success message here
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contact Us" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We're here to help. Reach out to us for support, partnerships, or any questions about our GBV case management services.
                    </p>
                </div>

                {/* Contact Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Phone className="h-8 w-8 text-red-500 mb-3" />
                            <h3 className="font-semibold mb-2">Emergency Hotline</h3>
                            <p className="text-sm text-muted-foreground mb-2">24/7 Crisis Support</p>
                            <p className="font-medium text-red-600">1-800-GBV-HELP</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Mail className="h-8 w-8 text-blue-500 mb-3" />
                            <h3 className="font-semibold mb-2">Email Support</h3>
                            <p className="text-sm text-muted-foreground mb-2">General Inquiries</p>
                            <p className="font-medium text-blue-600">support@gbvmanagement.org</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <MapPin className="h-8 w-8 text-green-500 mb-3" />
                            <h3 className="font-semibold mb-2">Office Location</h3>
                            <p className="text-sm text-muted-foreground mb-2">Main Office</p>
                            <p className="font-medium text-green-600">123 Support Ave, City</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Clock className="h-8 w-8 text-purple-500 mb-3" />
                            <h3 className="font-semibold mb-2">Office Hours</h3>
                            <p className="text-sm text-muted-foreground mb-2">Mon - Fri</p>
                            <p className="font-medium text-purple-600">9:00 AM - 5:00 PM</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form and Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Send className="h-5 w-5" />
                                    Send us a Message
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Contact Type Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_type">Type of Inquiry</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {contactTypes.map((type) => {
                                                const Icon = type.icon;
                                                return (
                                                    <label
                                                        key={type.value}
                                                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                                                            data.contact_type === type.value
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            value={type.value}
                                                            checked={data.contact_type === type.value}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('contact_type', e.target.value as ContactForm['contact_type'])}
                                                            className="sr-only"
                                                        />
                                                        <Icon className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{type.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {errors.contact_type && (
                                            <p className="text-sm text-red-600">{errors.contact_type}</p>
                                        )}
                                    </div>

                                    {/* Name and Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Your full name"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="your.email@example.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="Brief description of your inquiry"
                                            className={errors.subject ? 'border-red-500' : ''}
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-red-600">{errors.subject}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Please provide details about your inquiry..."
                                            rows={6}
                                            className={errors.message ? 'border-red-500' : ''}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-red-600">{errors.message}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Confidential Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    All communications are treated with strict confidentiality.
                                    Our team is trained to handle sensitive information with care and professionalism.
                                </p>
                                <div className="space-y-2">
                                    <h4 className="font-medium">Emergency Support</h4>
                                    <p className="text-sm text-muted-foreground">
                                        If you're in immediate danger, please contact local emergency services
                                        or our 24/7 crisis hotline.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Partnership Opportunities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-3">
                                    We collaborate with organizations, NGOs, and government agencies
                                    to strengthen our support network.
                                </p>
                                <Button variant="outline" className="w-full">
                                    Learn About Partnerships
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
