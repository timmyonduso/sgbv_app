import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, MapPin, Shield } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import GoogleMapsAutocomplete from '@/components/GoogleMapsAutocompleteProps';
import { Switch } from '@/components/ui/switch';
import { useEffect } from 'react';

interface Props {
    googleMapsApiKey: string;
    authenticated: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report an Incident',
        href: '/incidents/create',
    },
];

export default function Create({ googleMapsApiKey, authenticated }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [trackingCode, setTrackingCode] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        description: '',
        location: '',
        location_address: '',
        latitude: '',
        longitude: '',
        contact_info: '',
    });

    // If user is not authenticated, show anonymous option by default
    useEffect(() => {
        if (!authenticated) {
            setIsAnonymous(true);
        }
    }, [authenticated]);

    const handleLocationChange = (value: string, placeData?: {
        address: string;
        latitude: number;
        longitude: number;
    }) => {
        setData({
            ...data,
            location: value,
            location_address: placeData?.address || value,
            latitude: placeData?.latitude?.toString() || '',
            longitude: placeData?.longitude?.toString() || '',
        });
    };

// The issue is in this part of your code
// Replace the existing handleSubmit function with this:

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (isAnonymous) {
            try {
                // Use Inertia's post method instead of fetch API
                post(route('incidents.store-anonymous'), {
                    preserveScroll: true,
                    onSuccess: (page: any) => {
                        // Check if tracking code is available in the response
                        if (page.props?.flash?.tracking_code) {
                            setTrackingCode(page.props.flash.tracking_code);
                        }
                        reset('description', 'location', 'location_address', 'latitude', 'longitude', 'contact_info');
                        setIsSubmitting(false);
                    },
                    onError: () => {
                        setIsSubmitting(false);
                    },
                });
            } catch {
                setIsSubmitting(false);
            }
        } else {
            // Regular authenticated submission
            post(route('incidents.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    reset('description', 'location', 'location_address', 'latitude', 'longitude');
                    setIsSubmitting(false);
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            });
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report an Incident" />

            <div className="max-w-3xl mx-auto py-6">
                <HeadingSmall
                    title="Report an Incident"
                    description="Please provide details about the incident you wish to report. All information is kept confidential."
                />

                {trackingCode ? (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <div className="bg-green-50 p-6 rounded-lg text-center">
                                <div className="flex justify-center mb-4">
                                    <Shield className="h-12 w-12 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-green-800 mb-2">Report Submitted Successfully</h2>
                                <p className="mb-4">Thank you for your report. Your safety and well-being are important.</p>

                                <div className="bg-white p-4 rounded border border-green-300 mb-4">
                                    <p className="font-bold mb-2">Your Tracking Code:</p>
                                    <p className="text-2xl font-mono text-center p-2 bg-gray-100 rounded">{trackingCode}</p>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded border border-yellow-300 mb-6">
                                    <p className="font-bold text-yellow-800">Important:</p>
                                    <p>Please save this tracking code in a safe place. You will need it to check the status of your report later.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    <Button
                                        onClick={() => setTrackingCode(null)}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Submit Another Report
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => window.location.href = route('incidents.track')}
                                    >
                                        Track Your Report
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Incident Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {authenticated && (
                                <div className="mb-6 flex items-center space-x-2">
                                    <Switch
                                        id="report-anonymously"
                                        checked={isAnonymous}
                                        onCheckedChange={setIsAnonymous}
                                    />
                                    <Label htmlFor="report-anonymously" className="text-sm cursor-pointer flex items-center">
                                        <Shield className="h-4 w-4 mr-1 text-blue-600" />
                                        Report Anonymously
                                    </Label>
                                    <div className="text-xs text-neutral-500 ml-1">
                                        (Your identity will not be linked to this report)
                                    </div>
                                </div>
                            )}

                            {!authenticated && (
                                <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <Shield className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-yellow-700 font-medium">You are making an anonymous report</p>
                                        <p className="text-yellow-600 mt-1">
                                            If you have an account, you can <Link href={route('login')} className="text-blue-600 underline">sign in</Link> to track your reports more easily.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-neutral-200 text-lg">
                                            Location <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                                                <MapPin size={18} />
                                            </div>
                                            <GoogleMapsAutocomplete
                                                id="location"
                                                value={data.location}
                                                onChange={handleLocationChange}
                                                placeholder="Search for a location or address"
                                                apiKey={googleMapsApiKey}
                                                className="pl-10 w-full"
                                                required
                                            />
                                        </div>
                                        {errors.location && <InputError message={errors.location} />}

                                        {data.latitude && data.longitude && (
                                            <div className="mt-2 p-2 bg-neutral-50 rounded-md border border-neutral-200">
                                                <div className="text-xs text-neutral-500">Selected coordinates:</div>
                                                <div className="text-sm font-mono text-neutral-500">
                                                    {data.latitude}, {data.longitude}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-neutral-200 text-lg">
                                            Description <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="text-sm text-neutral-500 mb-1">
                                            Please provide as much detail as you feel comfortable sharing.
                                        </div>
                                        <textarea
                                            id="description"
                                            placeholder="What happened? Include any details that might be relevant."
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full min-h-32 placeholder:text-neutral-700 text-sm"
                                            required
                                        />
                                        {errors.description && <InputError message={errors.description} />}
                                    </div>

                                    {isAnonymous && (
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_info" className="text-neutral-200 text-lg">
                                                Optional Contact Information <span className="text-neutral-500">(confidential)</span>
                                            </Label>
                                            <div className="text-sm text-neutral-500 mb-1">
                                                You may optionally provide a way for us to contact you. This information will remain strictly confidential.
                                            </div>
                                            <textarea
                                                id="contact_info"
                                                placeholder="Phone number, email, or other way to contact you if needed"
                                                value={data.contact_info}
                                                onChange={(e) => setData('contact_info', e.target.value)}
                                                className="w-full min-h-20"
                                            />
                                            {errors.contact_info && <InputError message={errors.contact_info} />}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <AlertCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        <p>{isAnonymous
                                            ? "Your anonymous report will be confidentially reviewed. You'll receive a tracking code to check status updates."
                                            : "Your report will be confidentially reviewed. A case worker will be assigned to your case within 24 hours."
                                        }</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="text-sm">
                                        <span className="text-red-500">*</span> Required fields
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            type="submit"
                                            disabled={processing || isSubmitting}
                                            className="px-6"
                                        >
                                            {isSubmitting ? 'Submitting...' : isAnonymous ? 'Submit Anonymous Report' : 'Submit Report'}
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600">Report submitted successfully</p>
                                        </Transition>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-500">
                        If this is an emergency situation, please contact local emergency services by dialing 911.
                    </p>
                </div>

                {!trackingCode && (
                    <div className="mt-4 text-center">
                        <Link
                            href={route('incidents.track')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Already submitted an anonymous report? Track its status here
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
