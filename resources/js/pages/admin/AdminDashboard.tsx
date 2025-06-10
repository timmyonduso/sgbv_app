import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    Settings,
    Shield,
    Activity,
    UserCheck,
    AlertTriangle,
    TrendingUp,
    Database
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Admin Panel',
        href: '/admin',
    },
];

interface AdminDashboardProps {
    stats: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        totalCases: number;
        recentLogins: number;
        systemAlerts: number;
    };
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Panel" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Admin Panel
                                </h1>
                                <p className="text-gray-600">
                                    Manage users, system settings, and monitor platform health
                                </p>
                            </div>
                            <Shield className="h-12 w-12 text-indigo-600" />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Recent Logins</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.recentLogins}</p>
                                </div>
                                <Activity className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">System Alerts</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.systemAlerts}</p>
                                </div>
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Admin Functions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div>
                                    <CardTitle className="text-xl">User Management</CardTitle>
                                    <p className="text-sm text-gray-600">Manage user accounts, roles, and permissions</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Active Users</span>
                                    <span className="font-semibold text-green-600">{stats.activeUsers}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Inactive Users</span>
                                    <span className="font-semibold text-red-600">{stats.inactiveUsers}</span>
                                </div>
                                <div className="pt-2">
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        <a href="/admin/users">Manage Users</a>
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Settings className="h-8 w-8 text-green-600" />
                                <div>
                                    <CardTitle className="text-xl">System Settings</CardTitle>
                                    <p className="text-sm text-gray-600">Configure roles, permissions, and notifications</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Active Roles</span>
                                    <span className="font-semibold">5</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-sm text-gray-600">Notification Templates</span>
                                    <span className="font-semibold">12</span>
                                </div>
                                <div className="pt-2">
                                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                        System Settings
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Database className="h-6 w-6 text-indigo-600" />
                                <div className="text-left">
                                    <p className="font-medium">System Backup</p>
                                    <p className="text-sm text-gray-600">Create system backup</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                                <div className="text-left">
                                    <p className="font-medium">View Reports</p>
                                    <p className="text-sm text-gray-600">System usage reports</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                                <div className="text-left">
                                    <p className="font-medium">System Alerts</p>
                                    <p className="text-sm text-gray-600">View all alerts</p>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Recent Admin Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">New user registered</p>
                                    <p className="text-xs text-gray-600">john.doe@example.com - 2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <Settings className="h-5 w-5 text-green-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">System settings updated</p>
                                    <p className="text-xs text-gray-600">Notification templates modified - 4 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">System alert resolved</p>
                                    <p className="text-xs text-gray-600">Database connection issue - 6 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
