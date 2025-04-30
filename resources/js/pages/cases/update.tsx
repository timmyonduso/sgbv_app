import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Case {
    id: number;
    incident_id: number;
    incident: {
        id: number;
        title: string;
    };
}

interface PageProps {
    case: Case;
}

export default function AddUpdate() {
    const { props } = usePage();
    const caseData = props.case as Case;

    const { data, setData, errors, post, processing } = useForm({
        update_notes: '',
    });

    const submitUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('cases.add-update', caseData.id), {
            onSuccess: () => {
                // Redirect is handled by the controller
            },
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
            title: 'Add Update',
            href: `/cases/${caseData.id}/update`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Add Update - Case #${caseData.id}`} />

            <div className="space-y-6">
                <HeadingSmall
                    title={`Add Update to Case #${caseData.id}`}
                    description={`Update information for incident: ${caseData.incident.title}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Case Update</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitUpdate} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="update_notes">Update Notes</Label>
                                <textarea
                                    id="update_notes"
                                    value={data.update_notes}
                                    onChange={(e) => setData('update_notes', e.target.value)}
                                    placeholder="Enter details about this case update..."
                                    rows={6}
                                    className="resize-y"
                                />
                                <InputError message={errors.update_notes} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Submit Update
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
