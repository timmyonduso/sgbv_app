import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Clock, FileCheck, FileSearch, FileClock } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink
} from '@/components/ui/pagination';
import { type BreadcrumbItem } from '@/types';

// Define types based on your models
interface Status {
    id: number;
    name: string;
}

interface CaseStatus {
    id: number;
    name: string;
}

interface Case {
    id: number;
    status: CaseStatus;
}

interface Incident {
    id: number;
    description: string;
    location: string;
    created_at: string;
    status: Status;
    case?: Case;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    incidents: {
        data: Incident[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Incidents',
        href: '/incidents',
    },
];

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

// Helper function to get status badge color
const getStatusColor = (statusName: string) => {
    switch (statusName.toLowerCase()) {
        case 'reported':
            return 'bg-purple-100 text-purple-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'under investigation':
            return 'bg-blue-100 text-blue-800';
        case 'verified':
            return 'bg-indigo-100 text-indigo-800';
        case 'resolved':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Helper function to get case status icon
const getCaseStatusIcon = (incident: Incident) => {
    if (!incident.case) {
        return <Clock className="h-5 w-5 text-yellow-500"  />;
    }

    const statusName = incident.case.status.name.toLowerCase();

    if (['resolved', 'closed'].includes(statusName)) {
        return <FileCheck className="h-5 w-5 text-green-500"  />;
    } else if (['open', 'in progress'].includes(statusName)) {
        return <FileSearch className="h-5 w-5 text-blue-500"  />;
    } else {
        return <FileClock className="h-5 w-5 text-purple-500"  />;
    }
};

export default function Index({ incidents }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Reported Incidents" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <HeadingSmall
                            title="My Reported Incidents"
                            description="View and manage incidents you have reported"
                        />
                        <Button asChild>
                            <Link href={route('incidents.create')}>Report New Incident</Link>
                        </Button>
                    </div>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Incident History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {incidents.data.length > 0 ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date Reported</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Case Status</TableHead>
                                                    <TableHead className="w-16"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {incidents.data.map((incident) => (
                                                    <TableRow key={incident.id}>
                                                        <TableCell className="font-medium">
                                                            {formatDate(incident.created_at)}
                                                        </TableCell>
                                                        <TableCell className="max-w-xs truncate">
                                                            {incident.location}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={getStatusColor(incident.status.name)}
                                                                variant="success"
                                                            >
                                                                {incident.status.name}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {getCaseStatusIcon(incident)}
                                                                <span>
                                                                    {incident.case
                                                                        ? incident.case.status.name
                                                                        : 'Awaiting Assignment'}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                asChild
                                                                className="flex items-center"
                                                            >
                                                                <Link href={route('incidents.show', incident.id)}>
                                                                    <span className="sr-only">View details</span>
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {incidents.last_page > 1 && (
                                        <div className="mt-6 flex justify-center">
                                            <Pagination>
                                                <PaginationContent>
                                                    {incidents.links.map((link, i) => (
                                                        <PaginationItem key={i}>
                                                            {link.url ? (
                                                                <PaginationLink
                                                                    href={link.url}
                                                                    isActive={link.active}
                                                                    aria-label={link.label}
                                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                                />
                                                            ) : (
                                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                            )}
                                                        </PaginationItem>
                                                    ))}
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-neutral-600">You haven't reported any incidents yet.</p>
                                    <Button className="mt-4" asChild>
                                        <Link href={route('incidents.create')}>Report an Incident</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
