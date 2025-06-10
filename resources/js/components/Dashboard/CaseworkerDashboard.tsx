// File: components/dashboard/roles/CaseworkerDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder, Clock, AlertTriangle } from 'lucide-react';
import MetricCard from '@/components/Dashboard/shared/MetricCard';
import RecentIncidentsTable from '@/components/Dashboard/shared/RecentIncidentsTable';
import PersonalWorkloadChart from '@/components/Dashboard/shared/PersonalWorkloadChart';
import {
    type PersonalWorkload,
    type CaseItem,
    type Incident
} from '@/components/Dashboard/DashboardLayout';

interface CaseworkerDashboardProps {
    personalWorkload?: PersonalWorkload;
    recentIncidents: Incident[];
    userCases?: CaseItem[];
}

export default function CaseworkerDashboard({
                                                personalWorkload = {
                                                    open_cases: 0,
                                                    closed_cases: 0,
                                                    pending_incidents: 0,
                                                    avg_response_time: 0
                                                },
                                                recentIncidents,
                                                userCases = []
                                            }: CaseworkerDashboardProps) {
    return (
        <>
            {/* Caseworker Personal Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="My Open Cases"
                    value={personalWorkload.open_cases}
                    icon={Folder}
                    color="blue"
                    subtitle="Active assignments"
                />
                <MetricCard
                    title="Cases Closed"
                    value={personalWorkload.closed_cases}
                    icon={Folder}
                    color="green"
                    subtitle="This month"
                />
                <MetricCard
                    title="Pending Incidents"
                    value={personalWorkload.pending_incidents}
                    icon={AlertTriangle}
                    color="amber"
                    subtitle="Awaiting review"
                />
                <MetricCard
                    title="My Response Time"
                    value={`${personalWorkload.avg_response_time} days`}
                    icon={Clock}
                    color="purple"
                    subtitle="Average"
                />
            </div>

            {/* Caseworker-specific widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Personal Workload */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Workload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PersonalWorkloadChart data={personalWorkload} />
                    </CardContent>
                </Card>

                {/* Priority Cases */}
                <Card>
                    <CardHeader>
                        <CardTitle>Priority Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-black">
                            {userCases.filter(c => c.priority === 'high').slice(0, 3).map((case_item, index) => (
                                <div key={case_item.id || index} className="flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded">
                                    <div>
                                        <span className="text-sm font-medium">{case_item.title}</span>
                                        <p className="text-xs text-muted-foreground">{case_item.survivor_name}</p>
                                    </div>
                                    <span className="text-xs text-red-600 font-medium">HIGH</span>
                                </div>
                            ))}
                            {userCases.filter(c => c.priority === 'high').length === 0 && (
                                <p className="text-sm text-muted-foreground">No high priority cases</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                                <a href="/cases">View Cases</a>
                            </button>

                            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                <a href="/chat">Consult Support</a>
                            </button>
                            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                <a href="/cases">Generate Report</a>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Incidents - filtered for caseworker */}
            <RecentIncidentsTable
                incidents={recentIncidents.filter(i => i.assigned_caseworker_id === 1)} // Current user ID
                title="My Recent Incidents"
            />
        </>
    );
}
