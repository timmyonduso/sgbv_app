// File: components/dashboard/roles/LawEnforcementDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import MetricCard from './shared/MetricCard';
import RecentIncidentsTable from '@/components/Dashboard/shared/RecentIncidentsTable';

interface Incident {
    id: number;
    status: string;
    // Add other incident properties as needed
    [key: string]: any; // For any additional dynamic properties
}

interface Metrics {
    avg_response_time: number;
    // Add other metric properties as needed
    [key: string]: any; // For any additional dynamic properties
}

interface LawEnforcementDashboardProps {
    investigationIncidents?: Incident[];
    recentIncidents: Incident[];
    metrics: Metrics;
}

export default function LawEnforcementDashboard({
                                                    investigationIncidents = [],
                                                    recentIncidents,
                                                    metrics
                                                }: LawEnforcementDashboardProps) {
    const underInvestigation = recentIncidents.filter(i => i.status === 'Under Investigation');
    const resolved = recentIncidents.filter(i => i.status === 'Resolved');

    return (
        <>
            {/* Law Enforcement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Under Investigation"
                    value={underInvestigation.length}
                    icon={Shield}
                    color="blue"
                    subtitle="Active investigations"
                />
                <MetricCard
                    title="Recently Resolved"
                    value={resolved.length}
                    icon={CheckCircle}
                    color="green"
                    subtitle="This month"
                />
                <MetricCard
                    title="Pending Review"
                    value={recentIncidents.filter(i => i.status === 'Pending').length}
                    icon={AlertTriangle}
                    color="amber"
                    subtitle="Awaiting action"
                />
                <MetricCard
                    title="Avg Resolution"
                    value={`${metrics.avg_response_time} days`}
                    icon={Clock}
                    color="purple"
                    subtitle="Investigation time"
                />
            </div>

            {/* Law Enforcement widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Investigation Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Investigation Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Active Investigations</span>
                                <span className="font-semibold text-blue-600">{underInvestigation.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Pending Evidence</span>
                                <span className="font-semibold text-amber-600">3</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Ready for Review</span>
                                <span className="font-semibold text-green-600">2</span>
                            </div>
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
                                Update Investigation
                            </button>
                            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                Request Evidence
                            </button>
                            <button className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                Generate Report
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Investigation Incidents */}
            <RecentIncidentsTable
                incidents={underInvestigation}
                title="Under Investigation"
            />

            {/* Recently Resolved */}
            <RecentIncidentsTable
                incidents={resolved.slice(0, 5)}
                title="Recently Resolved Cases"
            />
        </>
    );
}
