// File: components/dashboard/roles/AdminDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, AlertTriangle, Folder, Clock, Shield, FileText, Activity } from 'lucide-react';
import MetricCard from '@/components/Dashboard/shared/MetricCard';
import StatusChart from './shared/StatusChart';
import WorkloadChart from '@/components/Dashboard/shared/WorkloadChart';
import {
    type BaseMetrics,
    type WorkloadData,
    type StatusDistribution,
    type PendingApproval,
    type SystemLog
} from '@/components/Dashboard/DashboardLayout';

interface AdminDashboardProps {
    metrics: BaseMetrics;
    caseWorkload: WorkloadData[];
    incidentStatusDistribution: StatusDistribution[];
    caseStatusDistribution: StatusDistribution[];
    pendingApprovals?: PendingApproval[];
    systemLogs?: SystemLog[];
}

export default function AdminDashboard({
                                           metrics,
                                           caseWorkload,
                                           incidentStatusDistribution,
                                           caseStatusDistribution,
                                           pendingApprovals = [],
                                           systemLogs = []
                                       }: AdminDashboardProps) {
    return (
        <>
            {/* Admin Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Incidents"
                    value={metrics.total_incidents}
                    icon={AlertTriangle}
                    color="amber"
                    subtitle={`${metrics.pending_incidents} pending`}
                />
                <MetricCard
                    title="Total Cases"
                    value={metrics.total_cases}
                    icon={Folder}
                    color="blue"
                    subtitle={`${metrics.open_cases} open`}
                />
                <MetricCard
                    title="Active Users"
                    value={metrics.caseworker_count + metrics.survivor_count}
                    icon={Users}
                    color="green"
                    subtitle={`${metrics.caseworker_count} caseworkers`}
                />
                <MetricCard
                    title="Avg Response Time"
                    value={`${metrics.avg_response_time} days`}
                    icon={Clock}
                    color="purple"
                    subtitle="System-wide average"
                />
            </div>

            {/* Admin-specific widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* User Management Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Caseworkers</span>
                                <span className="font-semibold">{metrics.caseworker_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Survivors</span>
                                <span className="font-semibold">{metrics.survivor_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Law Enforcement</span>
                                <span className="font-semibold">12</span>
                            </div>
                            <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                                Manage Users
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Approvals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Pending Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingApprovals.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No pending approvals</p>
                            ) : (
                                pendingApprovals.slice(0, 3).map((approval) => (
                                    <div key={approval.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                        <span className="text-sm font-medium">{approval.title}</span>
                                        <span className="text-xs text-muted-foreground">{approval.date}</span>
                                    </div>
                                ))
                            )}
                            <button className="w-full mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                View All Requests
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* System Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            System Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Cases created today</span>
                                <span className="font-semibold text-green-600">8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Incidents reported</span>
                                <span className="font-semibold text-amber-600">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Active sessions</span>
                                <span className="font-semibold text-blue-600">24</span>
                            </div>
                            <button className="w-full mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80">
                                View System Logs
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <StatusChart
                    title="Case Status Distribution"
                    data={caseStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                />
                <StatusChart
                    title="Incident Status Distribution"
                    data={incidentStatusDistribution}
                    dataKey="count"
                    nameKey="status"
                />
            </div>

            {/* Workload Chart */}
            <WorkloadChart data={caseWorkload} />
        </>
    );
}
