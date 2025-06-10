// File: components/dashboard/roles/SurvivorDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, FileText, Calendar, Phone } from 'lucide-react';
import MetricCard from '@/components/Dashboard/shared/MetricCard';

// Type definitions based on your Laravel models
// interface Status {
//     id: number;
//     name: string;
// }

interface CaseType {
    id: number;
    incident_id: number;
    assigned_to: number;
    status_id: number;
    status: string;
    title: string;
    progress?: number;
    updated_at: string;
    resolution_notes?: string;
    created_at: string;
    // Add other case properties as needed
}

interface IncidentType {
    id: number;
    survivor_id: number;
    status_id: number;
    status: string;
    description: string;
    location?: string;
    location_address?: string;
    latitude?: number;
    longitude?: number;
    contact_info?: string;
    tracking_code?: string;
    created_at: string;
    updated_at: string;
    has_case: boolean;
    // Add other incident properties as needed
}

interface CaseworkerType {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface SurvivorDashboardProps {
    userCases?: CaseType[];
    assignedCaseworker?: CaseworkerType;
    recentIncidents: IncidentType[];
    currentUserId: number; // Add this prop
}

export default function SurvivorDashboard({
                                              userCases = [],
                                              assignedCaseworker,
                                              recentIncidents,
                                              currentUserId,
                                          }: SurvivorDashboardProps) {
    const myIncidents = recentIncidents.filter(incident => incident.survivor_id === currentUserId);
    const activeCase = userCases.find(c => c.status === 'Open' || c.status === 'In Progress');

    return (
        <>
            {/* Survivor Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="My Cases"
                    value={userCases.length}
                    icon={FileText}
                    color="blue"
                    subtitle={activeCase ? `Active: ${activeCase.status}` : 'No active cases'}
                />
                <MetricCard
                    title="My Incidents"
                    value={myIncidents.length}
                    icon={FileText}
                    color="amber"
                    subtitle="Total reported"
                />
                <MetricCard
                    title="Last Update"
                    value="2 days ago"
                    icon={Calendar}
                    color="green"
                    subtitle="Case progress"
                />
            </div>

            {/* Survivor-specific widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Case Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Case Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeCase ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium">{activeCase.title}</h3>
                                    <p className="text-sm text-muted-foreground">Case #{activeCase.id}</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${activeCase.progress || 30}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Status: <span className="font-medium">{activeCase.status}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Last updated: {activeCase.updated_at}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No active case</p>
                        )}
                    </CardContent>
                </Card>

                {/* Assigned Caseworker */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            My Caseworker
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {assignedCaseworker ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium">{assignedCaseworker.name}</h3>
                                    <p className="text-sm text-muted-foreground">{assignedCaseworker.email}</p>
                                </div>
                                {assignedCaseworker.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{assignedCaseworker.phone}</span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                                        Send Message
                                    </button>
                                    <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                        Schedule Meeting
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No caseworker assigned</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* My Incidents */}
            <Card>
                <CardHeader>
                    <CardTitle>My Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4">ID</th>
                                <th className="text-left py-3 px-4">Description</th>
                                <th className="text-left py-3 px-4">Status</th>
                                <th className="text-left py-3 px-4">Date</th>
                                <th className="text-left py-3 px-4">Has Case</th>
                            </tr>
                            </thead>
                            <tbody>
                            {myIncidents.map((incident) => (
                                <tr key={incident.id} className="border-b hover:bg-muted/50">
                                    <td className="py-3 px-4">{incident.id}</td>
                                    <td className="py-3 px-4 max-w-xs truncate">{incident.description}</td>
                                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {incident.status}
                      </span>
                                    </td>
                                    <td className="py-3 px-4">{incident.created_at}</td>
                                    <td className="py-3 px-4">
                                        {incident.has_case ? '✓' : '✗'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {myIncidents.length === 0 && (
                            <p className="text-center py-8 text-muted-foreground">No incidents reported</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
