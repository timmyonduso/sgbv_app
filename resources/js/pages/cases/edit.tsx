import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';

interface Status {
    id: number;
    name: string;
}

interface Caseworker {
    id: number;
    name: string;
}

interface Case {
    id: number;
    incident_id: number;
    status_id: number;
    assigned_to: number | null;
    created_at: string;
    updated_at: string;
    incident: {
        id: number;
        title: string;
        survivor: {
            id: number;
            name: string;
        };
    };
}

interface PageProps {
    case: Case;
    statuses: Status[];
    caseworkers: Caseworker[];
}

export default function Edit() {
    const { props } = usePage();
    const caseData = props.case as Case;
    const statuses = props.statuses as Status[];
    const caseworkers = props.caseworkers as Caseworker[];

    const { data, setData, errors, put, processing, recentlySuccessful } = useForm({
        status_id: caseData.status_id || '',
        assigned_to: caseData.assigned_to || '',
    });

    const updateCase: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('cases.update', caseData.id), {
            preserveScroll: true,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Cases',
            href: '/cases',
        },
        {
            title: `Case #${caseData.id}`,
            href: `/cases/${caseData.id}`,
        },
        {
            title: 'Edit',
            href: `/cases/${caseData.id}/edit`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Case #${caseData.id}`} />

            <div className="space-y-6">
                <HeadingSmall
                    title={`Edit Case #${caseData.id}`}
                    description={`Edit case details for incident: ${caseData.incident.title}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Case Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={updateCase} className="space-y-6">
                            {/* Status Selection */}
                            <div className="grid gap-2">
                                <Label htmlFor="status_id">Case Status</Label>
                                <Select
                                    value={data.status_id.toString()}
                                    onValueChange={(value) => setData('status_id', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {status.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status_id} />
                            </div>

                            {/* Caseworker Assignment */}
                            <div className="grid gap-2">
                                <Label htmlFor="assigned_to">Assigned Caseworker</Label>
                                <Select
                                    value={data.assigned_to?.toString() || ''}
                                    onValueChange={(value) => setData('assigned_to', value === 'none' ? '' : value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select caseworker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Unassigned</SelectItem>
                                        {caseworkers.map((caseworker) => (
                                            <SelectItem key={caseworker.id} value={caseworker.id.toString()}>
                                                {caseworker.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.assigned_to} />
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update Case
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
