import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeft,
    MapPin,
    Calendar,
    FileText,
    UserCircle,
    MessageCircle,
    Paperclip,
    Clock,
    AlertCircle
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type BreadcrumbItem } from '@/types';
import GoogleMap from '@/components/GoogleMap';

// Define types based on your models
interface Status {
    id: number;
    name: string;
}

interface CaseStatus {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
}

interface Media {
    id: number;
    file_name: string;
    url: string;
    mime_type: string;
}

interface Comment {
    id: number;
    user: User;
    body: string;
    created_at: string;
    updated_at: string;
}

interface Case {
    id: number;
    reference_number: string;
    status: CaseStatus;
    assigned_to?: User;
    created_at: string;
    updated_at: string;
}

interface Incident {
    id: number;
    description: string;
    location: string;
    location_address?: string;
    latitude?: number;
    longitude?: number;
    incident_date: string;
    created_at: string;
    updated_at: string;
    status: Status;
    reported_by?: User;
    user?: User;
    case?: Case;
    media: Media[];
    comments: Comment[];
}

interface Props {
    incident: Incident;
    googleMapsApiKey: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(date);
};

// Helper function to get status badge color
const getStatusColor = (statusName: string) => {
    if (!statusName) return 'bg-gray-100 text-gray-800';

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

// Helper function to get case status badge color
const getCaseStatusColor = (statusName: string) => {
    if (!statusName) return 'bg-gray-100 text-gray-800';

    switch (statusName.toLowerCase()) {
        case 'open':
            return 'bg-blue-100 text-blue-800';
        case 'in progress':
            return 'bg-indigo-100 text-indigo-800';
        case 'under review':
            return 'bg-purple-100 text-purple-800';
        case 'resolved':
            return 'bg-green-100 text-green-800';
        case 'closed':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

// Helper function to get user initials for avatar
const getUserInitials = (name: string) => {
    if (!name) return 'U';

    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();
};

// Helper function to determine if media is an image
const isImage = (mimeType: string) => {
    if (!mimeType) return false;
    return mimeType.startsWith('image/');
};

// Helper function to get reporter information
const getReporter = (incident: Incident) => {
    // Try different possible field names for the reporter
    return incident.reported_by || incident.user || null;
};

export default function Show({ incident, googleMapsApiKey }: Props) {
    // Define breadcrumbs for navigation
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Incidents',
            href: '/incidents',
        },
        {
            title: `Incident #${incident.id}`,
            href: `/incidents/${incident.id}`,
        }
    ];

    // State for comments section
    const [commentBody, setCommentBody] = useState('');

    // Helper function to handle comment submission
    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implementation would depend on your backend setup
        console.log('Submitting comment:', commentBody);
        // Reset the input after submission
        setCommentBody('');
    };

    // Get the reporter (handling potential undefined values)
    const reporter = getReporter(incident);

    // Ensure media array exists
    const media = incident.media || [];

    // Ensure comments array exists
    const comments = incident.comments || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Incident #${incident.id} Details`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mr-4"
                        >
                            <Link href={route('incidents.index')}>
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Back to incidents
                            </Link>
                        </Button>
                        <HeadingSmall
                            title={`Incident #${incident.id}`}
                            description="View incident details and case status"
                        />
                    </div>

                    {/* Incident status */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            {incident.status && (
                                <Badge
                                    className={getStatusColor(incident.status.name)}
                                    variant="success"
                                >
                                    Incident Status: {incident.status.name}
                                </Badge>
                            )}

                            {incident.case?.status && (
                                <Badge
                                    className={getCaseStatusColor(incident.case.status.name)}
                                    variant="success"
                                >
                                    Case Status: {incident.case.status.name}
                                </Badge>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Request Update
                            </Button>
                        </div>
                    </div>

                    {/* Incident details card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Incident Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Incident metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-neutral-500">Date Reported</div>
                                        <div>{formatDate(incident.created_at)}</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Calendar className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-neutral-500">Incident Date</div>
                                        <div>{formatDate(incident.incident_date)}</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                    <div className="w-full">
                                        <div className="text-sm font-medium text-neutral-500">Location</div>
                                        <div>{incident.location || 'Not specified'}</div>

                                        {/* Add the map component if we have coordinates */}
                                        {incident.latitude && incident.longitude &&
                                            !isNaN(incident.latitude) && !isNaN(incident.longitude) && (
                                                <div className="mt-3">
                                                    <GoogleMap
                                                        latitude={Number(incident.latitude)}
                                                        longitude={Number(incident.longitude)}
                                                        apiKey={googleMapsApiKey}
                                                        height="200px"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                </div>
                                {reporter && (
                                    <div className="flex items-start">
                                        <UserCircle className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-neutral-500">Reported By</div>
                                            <div>{reporter.name}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            {/* Incident description */}
                            <div>
                                <h3 className="font-medium mb-2 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-neutral-500" />
                                    Description
                                </h3>
                                <div className="text-neutral-200 whitespace-pre-wrap">
                                    {incident.description || 'No description provided.'}
                                </div>
                            </div>

                            {/* Attached media */}
                            {media.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-medium mb-3 flex items-center">
                                            <Paperclip className="h-5 w-5 mr-2 text-neutral-500" />
                                            Attached Files ({media.length})
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {media.map((item) => (
                                                <a
                                                    key={item.id}
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block group"
                                                >
                                                    {isImage(item.mime_type) ? (
                                                        <div className="aspect-square rounded-md border overflow-hidden bg-neutral-100">
                                                            <img
                                                                src={item.url}
                                                                alt={item.file_name}
                                                                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="aspect-square rounded-md border flex items-center justify-center bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                                                            <FileText className="h-8 w-8 text-neutral-500" />
                                                        </div>
                                                    )}
                                                    <div className="mt-1 text-xs truncate">{item.file_name}</div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Case information if exists */}
                    {incident.case && (
                        <Card className="mt-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Case Information</CardTitle>
                                <Badge variant="success">
                                    Ref: {incident.case.reference_number}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <Clock className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-medium text-neutral-500">Case Opened</div>
                                            <div>{formatDate(incident.case.created_at)}</div>
                                        </div>
                                    </div>
                                    {incident.case.assigned_to && (
                                        <div className="flex items-start">
                                            <UserCircle className="h-5 w-5 text-neutral-500 mr-2 mt-0.5" />
                                            <div>
                                                <div className="text-sm font-medium text-neutral-500">Assigned To</div>
                                                <div>{incident.case.assigned_to.name}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Comments section */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <MessageCircle className="h-5 w-5 mr-2" />
                                Comments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <Avatar className="h-8 w-8">
                                            {comment.user?.avatar_url && (
                                                <AvatarImage src={comment.user.avatar_url} alt={comment.user.name} />
                                            )}
                                            <AvatarFallback>{getUserInitials(comment.user?.name || '')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{comment.user?.name || 'Unknown User'}</div>
                                                <div className="text-xs text-neutral-500">{formatDate(comment.created_at)}</div>
                                            </div>
                                            <div className="mt-1 text-neutral-800">{comment.body}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-neutral-500">
                                    No comments yet.
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <form onSubmit={handleCommentSubmit} className="w-full">
                                <div className="flex items-start space-x-3 w-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>ME</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                        <textarea
                                            value={commentBody}
                                            onChange={(e) => setCommentBody(e.target.value)}
                                            placeholder="Add a comment..."
                                            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            rows={3}
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" size="sm" disabled={!commentBody.trim()}>
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
