import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    UserX,
    UserCheck,
    Key,
    Mail,
    Filter,
    Eye
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Admin Panel',
        href: '/admin',
    },
    {
        title: 'User Management',
        href: '/admin/users',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    lastLogin: string;
    createdAt: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Role {
    id: number;
    name: string;
    // other properties if they exist
}

interface UserManagementProps {
    users: PaginatedUsers;
    roles: Role[]; // Changed from string[] to Role[]
    stats: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        suspendedUsers: number;
    };
}

export default function UserManagement({ users, roles, stats }: UserManagementProps) {
    console.log('Users data:', users.data);
    console.log('Roles data:', roles);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Access the actual array of users from the paginated data
    const usersArray = users.data || [];

    const filteredUsers = usersArray.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Navigation function to go to individual user page
    const navigateToUser = (userId: number) => {
        router.visit(`/admin/users/${userId}`);
    };

    // Handle user row click
    const handleUserRowClick = (userId: number, event: React.MouseEvent) => {
        // Prevent navigation if clicking on action buttons
        if ((event.target as HTMLElement).closest('button')) {
            return;
        }
        navigateToUser(userId);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            manager: 'bg-blue-100 text-blue-800',
            caseworker: 'bg-green-100 text-green-800',
            viewer: 'bg-yellow-100 text-yellow-800',
        };

        return <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
            {role}
        </Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    User Management
                                </h1>
                                <p className="text-gray-600">
                                    Manage user accounts, roles, and permissions
                                </p>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New User
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                    <p className="text-sm font-medium text-gray-600">Active</p>
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
                                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                                    <p className="text-2xl font-bold text-gray-600">{stats.inactiveUsers}</p>
                                </div>
                                <UserX className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</p>
                                </div>
                                <UserX className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                >
                                    <option value="all" className="text-white">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name} className="text-black">
                                            {role.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-600">User</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Role</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Last Login</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Created</th>
                                    <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={(e) => handleUserRowClick(user.id, e)}
                                    >
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-600">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="p-3">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {user.lastLogin}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {user.createdAt}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigateToUser(user.id);
                                                    }}
                                                    title="View User"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Edit User"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Reset Password"
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Send Email"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No users found matching your criteria.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {((users.current_page - 1) * users.per_page) + 1} to {Math.min(users.current_page * users.per_page, users.total)} of {users.total} results
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={users.current_page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={users.current_page === users.last_page}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bulk Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="text-blue-600">
                                <Mail className="h-4 w-4 mr-2" />
                                Send Welcome Email
                            </Button>
                            <Button variant="outline" className="text-green-600">
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate Selected
                            </Button>
                            <Button variant="outline" className="text-yellow-600">
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend Selected
                            </Button>
                            <Button variant="outline" className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
