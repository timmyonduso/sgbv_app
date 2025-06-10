// File: components/dashboard/shared/RecentIncidentsTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface RecentIncidentsTableProps {
    incidents: any[];
    title?: string;
}

const getStatusColor = (status: string) => {
    if (status === 'Reported') return 'bg-purple-100 text-purple-800';
    if (status === 'Pending') return 'bg-amber-100 text-amber-800';
    if (status === 'Under Investigation') return 'bg-blue-100 text-blue-800';
    if (status === 'Resolved') return 'bg-green-100 text-green-800';
    if (status === 'Closed') return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
    if (status === 'Resolved') return <CheckCircle className="h-4 w-4" />;
    if (status === 'Pending') return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
};

export default function RecentIncidentsTable({
                                                 incidents,
                                                 title = 'Recent Incidents'
                                             }: RecentIncidentsTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4">ID</th>
                            <th className="text-left py-3 px-4">Title</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Date Reported</th>
                            <th className="text-left py-3 px-4">Severity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {incidents.map((incident) => (
                            <tr key={incident.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">{incident.id}</td>
                                <td className="py-3 px-4 max-w-xs truncate">{incident.title}</td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(incident.status)}
                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`}>
                        {incident.status}
                      </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">{new Date(incident.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        incident.severity === 'High' ? 'bg-red-100 text-red-800' :
                            incident.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                    }`}>
                      {incident.severity}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {incidents.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No incidents found
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
