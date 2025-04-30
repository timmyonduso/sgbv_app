import { Head, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Update {
    id: number;
    case_id: number;
    updated_by: number;
    update_notes: string;
    created_at: string;
    updated_at: string;
    updatedBy: {
        id: number;
        name: string;
    };
}

interface Case {
    id: number;
    incident_id: number;
    status_id: number;
    assigned_to: number;
    created_at: string;
    updated_at: string;
    incident: {
        id: number;
        title: string;
        description: string;
        date: string;
        survivor: {
            id: number;
            name: string;
            email: string;
        };
    };
    status: {
        id: number;
        name: string;
    };
    assignedTo: {
        id: number;
        name: string;
    } | null;
    updates: Update[];
}

interface PageProps {
    case: Case;
}

export default function Show() {
    // Use the correct type assertion approach for Inertia
    const { props } = usePage();
    const caseData = props.case as Case;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Cases',
            href: '/cases',
        },
        {
            title: `Case #${caseData.id}`,
            href: `/cases/${caseData.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Case #${caseData.id} - ${caseData.incident.title}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title={`Case #${caseData.id}: ${caseData.incident.title}`}
                        description={`Opened on ${new Date(caseData.created_at).toLocaleDateString()}`}
                    />

                    <div className="flex gap-2">
                        {/*<Button variant="outline" asChild>*/}
                        {/*    <a href={`/cases/${caseData.id}/edit`}>Edit Case</a>*/}
                        {/*</Button>*/}
                        <Button asChild>
                            <a href={`/cases/${caseData.id}/update`}>Add Update</a>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Case Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Case Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge>{caseData.status.name}</Badge>
                                {caseData.assignedTo && (
                                    <Badge variant="success">Assigned to: {caseData.assignedTo.name}</Badge>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500">Incident Title</h3>
                                    <p className="text-base">{caseData.incident.title}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500">Incident Description</h3>
                                    <p className="text-base">{caseData.incident.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-neutral-500">Incident Date</h3>
                                    <p className="text-base">{new Date(caseData.incident.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Survivor Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Survivor Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500">Name</h3>
                                <p className="text-base">{caseData.incident.survivor.name}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-neutral-500">Email</h3>
                                <p className="text-base">{caseData.incident.survivor.email}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Case Updates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Case Updates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {caseData.updates && caseData.updates.length > 0 ? (
                            <div className="space-y-6">
                                {caseData.updates.map((update, index) => (
                                    <div key={update.id} className="space-y-2">
                                        {index > 0 && <Separator className="my-4" />}
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">{update.updatedBy?.name}</p>
                                                <p className="text-sm text-neutral-500">
                                                    {new Date(update.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-base">{update.update_notes}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500">No updates have been added to this case yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
