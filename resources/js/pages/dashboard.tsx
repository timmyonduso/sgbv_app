import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Clock, AlertTriangle, CheckCircle, Folder, Users } from 'lucide-react';

// Types based on controller data structure
interface Metrics {
    total_incidents: number;
    total_cases: number;
    open_cases: number;
    pending_incidents: number;
    caseworker_count: number;
    survivor_count: number;
    avg_response_time: number;
}

interface Incident {
    id: number;
    survivor_name: string;
    description: string;
    location: string;
    status: string; // Now this will be without the "Incident: " prefix
    created_at: string;
    has_case: boolean;
}

interface CaseWorkload {
    caseworker_id: number;
    caseworker_name: string;
    open_cases: number;
    closed_cases: number;
    total_cases: number;
}

interface StatusDistribution {
    status: string; // Now this will be without the "Case: " or "Incident: " prefix
    count: number;
}

interface Props {
    metrics: Metrics;
    recentIncidents: Incident[];
    caseWorkload: CaseWorkload[];
    incidentStatusDistribution: StatusDistribution[];
    caseStatusDistribution: StatusDistribution[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Define colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Helper function to get status color
const getStatusColor = (status: string) => {
    // For incident statuses
    if (status === 'Reported') return 'bg-purple-100 text-purple-800';
    if (status === 'Pending') return 'bg-amber-100 text-amber-800';
    if (status === 'Under Investigation') return 'bg-blue-100 text-blue-800';
    if (status === 'Verified') return 'bg-sky-100 text-sky-800';
    if (status === 'Resolved') return 'bg-green-100 text-green-800';

    // For case statuses
    if (status === 'Open') return 'bg-indigo-100 text-indigo-800';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
    if (status === 'Pending Review') return 'bg-amber-100 text-amber-800';
    if (status === 'Pending External') return 'bg-orange-100 text-orange-800';
    if (status === 'Closed') return 'bg-slate-100 text-slate-800';

    // Default
    return 'bg-gray-100 text-gray-800';
};

export default function Dashboard({
                                      metrics,
                                      recentIncidents,
                                      caseWorkload,
                                      incidentStatusDistribution,
                                      caseStatusDistribution
                                  }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="h-10 w-10 text-amber-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                                    <h2 className="text-3xl font-bold">{metrics.total_incidents}</h2>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <p className="text-sm text-muted-foreground">Pending: {metrics.pending_incidents}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="flex items-center space-x-2">
                                <Folder className="h-10 w-10 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Cases</p>
                                    <h2 className="text-3xl font-bold">{metrics.total_cases}</h2>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <Folder className="h-5 w-5 text-blue-500" />
                                <p className="text-sm text-muted-foreground">Open: {metrics.open_cases}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-10 w-10 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                                    <h2 className="text-3xl font-bold">{metrics.avg_response_time} days</h2>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center space-x-2">
                                <Users className="h-5 w-5 text-indigo-500" />
                                <p className="text-sm text-muted-foreground">
                                    {metrics.caseworker_count} Caseworkers | {metrics.survivor_count} Survivors
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Case Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Case Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={caseStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {caseStatusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [`${value} cases`, props.payload.status]}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Incident Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Incident Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incidentStatusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="status"
                                    >
                                        {incidentStatusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [`${value} incidents`, props.payload.status]}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Caseworker Workload Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Caseworker Workload</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={caseWorkload}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="caseworker_name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={70}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="open_cases" name="Open Cases" fill="#0088FE" stackId="a" />
                                <Bar dataKey="closed_cases" name="Closed Cases" fill="#00C49F" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Incidents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Incidents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4">ID</th>
                                    <th className="text-left py-3 px-4">Survivor</th>
                                    <th className="text-left py-3 px-4">Description</th>
                                    <th className="text-left py-3 px-4">Location</th>
                                    <th className="text-left py-3 px-4">Status</th>
                                    <th className="text-left py-3 px-4">Date</th>
                                    <th className="text-left py-3 px-4">Has Case</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentIncidents.map((incident) => (
                                    <tr key={incident.id} className="border-b hover:bg-muted/50">
                                        <td className="py-3 px-4">{incident.id}</td>
                                        <td className="py-3 px-4">{incident.survivor_name}</td>
                                        <td className="py-3 px-4 max-w-xs truncate">{incident.description}</td>
                                        <td className="py-3 px-4">{incident.location}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`}>
                                                {incident.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">{incident.created_at}</td>
                                        <td className="py-3 px-4">
                                            {incident.has_case ?
                                                <CheckCircle className="h-5 w-5 text-green-500" /> :
                                                <div className="h-5 w-5 rounded-full bg-red-500"></div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
