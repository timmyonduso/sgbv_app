import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar, FileText, MapPin, Shield, Clock } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';

interface Case {
    id: number;
    status: {
        id: number;
        name: string;
        color: string;
    };
    updates?: {
        id: number;
        message: string;
        created_at: string;
        updated_by: {
            name: string;
        };
    }[];
}

interface Props {
    incident: {
        id: number;
        description: string;
        location: string;
        location_address: string;
        latitude: string;
        longitude: string;
        created_at: string;
        tracking_code: string;
        status: {
            id: number;
            name: string;
            color: string;
        };
        case?: Case;
    };
    googleMapsApiKey: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Anonymous Report Status',
        href: '/track-incident',
    },
];

export default function AnonymousStatus({ incident, googleMapsApiKey }: Props) {
    const formattedDate = (dateString: string) => {
        return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
    };

    const statusColor = (status: string) => {
        if (status.includes('Pending') || status.includes('Reported') || status.includes('Anonymous')) {
            return 'bg-yellow-100 text-yellow-800';
        } else if (status.includes('In Progress') || status.includes('Assigned')) {
            return 'bg-blue-100 text-blue-800';
        } else if (status.includes('Closed') || status.includes('Resolved')) {
            return 'bg-green-100 text-green-800';
        } else {
            return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anonymous Report Status" />

            <div className="max-w-3xl mx-auto py-6">
                <HeadingSmall
                    title="Anonymous Report Status"
                    description="Current status and details about your anonymous report."
                />

                <div className="bg-neutral-500 border border-neutral-200 rounded-md p-4 flex items-center space-x-3 mt-6">
                    <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Tracking Code:</span> {incident.tracking_code}
                    </div>
                </div>

                <Card className="mt-4">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-medium">Report Status</CardTitle>
                            <Badge className={statusColor(incident.status.name)}>
                                {incident.status.name.replace('Incident: ', '')}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-neutral-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-neutral-700">Date Reported</h3>
                                    <p className="text-neutral-600">{formattedDate(incident.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-neutral-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-neutral-700">Location</h3>
                                    <p className="text-neutral-600">{incident.location_address || incident.location}</p>

                                    {googleMapsApiKey && incident.latitude && incident.longitude && (
                                        <div className="mt-2 w-full h-48 rounded-md overflow-hidden border border-neutral-200">
                                            <iframe
                                                title="Incident Location"
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${incident.latitude},${incident.longitude}&zoom=15`}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <FileText className="h-5 w-5 text-neutral-500 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-neutral-700">Description</h3>
                                    <p className="text-neutral-600 whitespace-pre-line">{incident.description}</p>
                                </div>
                            </div>

                            {incident.case && (
                                <div className="flex items-start space-x-3">
                                    <Clock className="h-5 w-5 text-neutral-500 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-neutral-700">Case Status</h3>
                                        <Badge className={statusColor(incident.case.status.name)}>
                                            {incident.case.status.name}
                                        </Badge>

                                        {incident.case.updates && incident.case.updates.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-neutral-700 mb-2">Recent Updates</h4>
                                                <div className="space-y-3">
                                                    {incident.case.updates.map((update) => (
                                                        <div key={update.id} className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-xs text-neutral-500">
                                                                    {formattedDate(update.created_at)}
                                                                </span>
                                                                <span className="text-xs font-medium text-neutral-600">
                                                                    by {update.updated_by.name}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-neutral-700">{update.message}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start space-x-3 mt-6">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="text-sm text-yellow-700">
                        <p>Please bookmark this page or save your tracking code to check for updates later.</p>
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = route('incidents.track')}
                    >
                        Check Another Report
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
