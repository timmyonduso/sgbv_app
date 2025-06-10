import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Key,
    Mail,
    ChevronLeft,
    Users,
    Shield,
    ClipboardList,
    AlertTriangle,
    Clock,
    Plus
} from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface Case {
    id: number;
    title: string;
    status: string;
}

interface Incident {
    id: number;
    title: string;
    severity: string;
}

interface CaseUpdate {
    id: number;
    content: string;
    created_at: string;
}

interface UserDetailProps {
    user: {
        id: number;
        name: string;
        email: string;
        email_verified_at: string | null;
        status: 'active' | 'inactive' | 'suspended';
        last_login_at: string | null;
        created_at: string;
        updated_at: string;
        roles: Role[];
        assignedCases: Case[];
        incidents: Incident[];
        caseUpdates: CaseUpdate[];
    };
    roles: Role[];
}

export default function UserDetail({ user, roles }: UserDetailProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');

    // Form for editing user
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    // Form for deleting user
    const { delete: deleteUser, processing: deleting } = useForm();

    // Form for assigning role
    const { data: roleData, setData: setRoleData, post: assignRole, processing: assigningRole, errors: roleErrors } = useForm({
        role_id: '',
    });

    const handleEdit = () => {
        put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                setEditDialogOpen(false);
                reset('password', 'password_confirmation');
            },
        });
    };

    const handleDelete = () => {
        deleteUser(`/admin/users/${user.id}`, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
        });
    };

    const handleAssignRole = () => {
        if (!selectedRoleId) return;

        setRoleData('role_id', selectedRoleId);

        assignRole(`/admin/users/${user.id}/roles`, {
            onSuccess: () => {
                setSelectedRoleId('');
                setRoleData('role_id', '');
            },
            onError: (errors) => {
                console.error('Role assignment failed:', errors);
            }
        });
    };


    const getStatusBadge = () => {
        switch (user.status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800',
            manager: 'bg-blue-100 text-blue-800',
            caseworker: 'bg-green-100 text-green-800',
            viewer: 'bg-yellow-100 text-yellow-800',
        };

        return (
            <Badge className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
                {role}
            </Badge>
        );
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Get available roles (roles user doesn't already have)
    const availableRoles = roles.filter(role =>
        !user.roles.some(userRole => userRole.id === role.id)
    );

    return (
        <AppLayout>
            <Head title={`User Details - ${user.name}`} />

            <div className="flex flex-col gap-6 p-4">
                {/* Header with back button */}
                <div className="flex items-center justify-between">
                    <Link href="/admin/users" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Users
                    </Link>
                    <div className="flex gap-2">
                        {/* Edit Dialog */}
                        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                    <DialogDescription>
                                        Make changes to the user's information here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">
                                            Name
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full"
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="email" className="text-right">
                                            Email
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full"
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password" className="text-right">
                                            Password
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Leave blank to keep current password"
                                                className="w-full"
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="password_confirmation" className="text-right">
                                            Confirm
                                        </Label>
                                        <div className="col-span-3">
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleEdit}
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Delete Alert Dialog */}
                        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user account for{' '}
                                        <strong>{user.name}</strong> and remove all associated data.
                                        {user.assignedCases.length > 0 && (
                                            <span className="block mt-2 text-red-600">
                                                Warning: This user has {user.assignedCases.length} assigned case(s).
                                                Deletion may be prevented if there are active cases.
                                            </span>
                                        )}
                                        {user.incidents.length > 0 && (
                                            <span className="block mt-1 text-red-600">
                                                Warning: This user has {user.incidents.length} reported incident(s).
                                            </span>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {deleting ? 'Deleting...' : 'Delete User'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* User Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">{user.name}</h3>
                                <p className="text-gray-600">{user.email}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Status:</span>
                                    {getStatusBadge()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Roles:</span>
                                    <div className="flex gap-2 flex-wrap">
                                        {user.roles.map(role => (
                                            <div key={role.id}>
                                                {getRoleBadge(role.name)}
                                            </div>
                                        ))}
                                        {user.roles.length === 0 && (
                                            <span className="text-sm text-gray-500">No roles assigned</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium">Last Login:</span> {formatDate(user.last_login_at)}
                                </div>
                                <div>
                                    <span className="font-medium">Member Since:</span> {formatDate(user.created_at)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">Quick Actions</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Button variant="outline" size="sm">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Key className="h-4 w-4 mr-2" />
                                        Reset Password
                                    </Button>
                                    {user.status === 'active' ? (
                                        <Button variant="outline" size="sm">
                                            <UserX className="h-4 w-4 mr-2" />
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm">
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Activate
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium">Assign Role</h4>
                                {availableRoles.length > 0 ? (
                                    <div className="flex gap-2 mt-2">
                                        <select
                                            value={selectedRoleId}
                                            onChange={(e) => {
                                                setSelectedRoleId(e.target.value);
                                                setRoleData('role_id', e.target.value);
                                            }}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" className="text-black">Select a role</option>
                                            {availableRoles.map(role => (
                                                <option key={role.id} value={role.id} className="text-black">
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            size="sm"
                                            onClick={handleAssignRole}
                                            disabled={!selectedRoleId || assigningRole}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            {assigningRole ? 'Assigning...' : 'Assign'}
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-2">All available roles have been assigned to this user.</p>
                                )}
                                {roleErrors.role_id && (
                                    <p className="text-sm text-red-600 mt-1">{roleErrors.role_id}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* User Activity Sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Assigned Cases */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Assigned Cases ({user.assignedCases.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.assignedCases.length > 0 ? (
                                <ul className="space-y-2">
                                    {user.assignedCases.slice(0, 5).map(caseItem => (
                                        <li key={caseItem.id} className="border-b pb-2 last:border-0">
                                            <div className="font-medium">{caseItem.title}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {caseItem.status}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No assigned cases</p>
                            )}
                            {user.assignedCases.length > 5 && (
                                <Button variant="link" size="sm" className="mt-2 px-0">
                                    View all cases
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reported Incidents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Reported Incidents ({user.incidents.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.incidents.length > 0 ? (
                                <ul className="space-y-2">
                                    {user.incidents.slice(0, 5).map(incident => (
                                        <li key={incident.id} className="border-b pb-2 last:border-0">
                                            <div className="font-medium">{incident.title}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {incident.severity}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No reported incidents</p>
                            )}
                            {user.incidents.length > 5 && (
                                <Button variant="link" size="sm" className="mt-2 px-0">
                                    View all incidents
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Case Updates */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recent Updates ({user.caseUpdates.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.caseUpdates.length > 0 ? (
                                <ul className="space-y-2">
                                    {user.caseUpdates.slice(0, 5).map(update => (
                                        <li key={update.id} className="border-b pb-2 last:border-0">
                                            <div className="text-sm line-clamp-2">{update.content}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatDate(update.created_at)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-sm">No case updates</p>
                            )}
                            {user.caseUpdates.length > 5 && (
                                <Button variant="link" size="sm" className="mt-2 px-0">
                                    View all updates
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Permissions Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Permissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.roles.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {user.roles.map(role => (
                                    <div key={role.id} className="border rounded-md p-4">
                                        <h4 className="font-medium mb-2">{role.name} Permissions</h4>
                                        <ul className="space-y-1 text-sm">
                                            <li>View cases</li>
                                            <li>Create cases</li>
                                            {role.name === 'admin' && <li>Manage users</li>}
                                            {role.name === 'admin' && <li>System configuration</li>}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No roles assigned. Assign a role to view permissions.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
