import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Shield,
    Users,
    Bell,
    Mail,
    Key,
    Database,
    Globe,
    Edit,
    Plus,
    Trash2,
    Save,
    RefreshCw
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
        title: 'System Settings',
        href: '/admin/settings',
    },
];

interface Role {
    id: number;
    name: string;
    permissions: string[];
    userCount: number;
    isSystem: boolean;
}

interface NotificationTemplate {
    id: number;
    name: string;
    type: 'email' | 'sms' | 'in-app';
    subject: string;
    isActive: boolean;
}

interface SystemSettingsProps {
    roles: Role[];
    notificationTemplates: NotificationTemplate[];
    systemSettings: {
        siteName: string;
        siteUrl: string;
        adminEmail: string;
        sessionTimeout: number;
        maxLoginAttempts: number;
        passwordMinLength: number;
        requireTwoFactor: boolean;
        allowRegistration: boolean;
    };
}

export default function SystemSettings({ roles, notificationTemplates, systemSettings }: SystemSettingsProps) {
    const [activeTab, setActiveTab] = useState('roles');
    const [settings, setSettings] = useState(systemSettings);

    const handleSettingChange = (key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const availablePermissions = [
        'view_cases',
        'create_cases',
        'edit_cases',
        'delete_cases',
        'manage_users',
        'system_settings',
        'view_reports',
        'export_data',
        'admin_access'
    ];

    const tabs = [
        { id: 'roles', label: 'Roles & Permissions', icon: Users },
        { id: 'notifications', label: 'Notification Templates', icon: Bell },
        { id: 'security', label: 'Security Settings', icon: Shield },
        { id: 'general', label: 'General Settings', icon: Settings },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    System Settings
                                </h1>
                                <p className="text-gray-600">
                                    Configure system roles, permissions, and global settings
                                </p>
                            </div>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4 mr-2" />
                                Save All Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                    <CardContent className="p-0">
                        <div className="border-b">
                            <nav className="flex space-x-8 px-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Roles & Permissions Tab */}
                            {activeTab === 'roles' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Roles & Permissions</h3>
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add New Role
                                        </Button>
                                    </div>

                                    <div className="grid gap-4">
                                        {roles.map((role) => (
                                            <Card key={role.id} className="border-l-4 border-l-blue-500">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4 className="font-semibold text-lg">{role.name}</h4>
                                                                {role.isSystem && (
                                                                    <Badge className="bg-yellow-100 text-yellow-800">System Role</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{role.userCount} users assigned</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            {!role.isSystem && (
                                                                <Button variant="outline" size="sm" className="text-red-600">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {role.permissions.map((permission) => (
                                                                <Badge key={permission} variant="outline" className="text-xs">
                                                                    {permission.replace('_', ' ').toUpperCase()}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notification Templates Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Notification Templates</h3>
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Template
                                        </Button>
                                    </div>

                                    <div className="grid gap-4">
                                        {notificationTemplates.map((template) => (
                                            <Card key={template.id}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                {template.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                                                                {template.type === 'sms' && <Bell className="h-5 w-5 text-green-600" />}
                                                                {template.type === 'in-app' && <Bell className="h-5 w-5 text-purple-600" />}
                                                                <h4 className="font-semibold">{template.name}</h4>
                                                            </div>
                                                            <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                                {template.isActive ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="outline" size="sm" className="text-red-600">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-2">
                                                        <span className="font-medium">Subject:</span> {template.subject}
                                                    </p>
                                                    <Badge variant="outline" className="text-xs">
                                                        {template.type.toUpperCase()}
                                                    </Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Security Settings Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Security Settings</h3>

                                    <div className="grid gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Key className="h-5 w-5" />
                                                    Authentication Settings
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Session Timeout (minutes)
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            value={settings.sessionTimeout}
                                                            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Max Login Attempts
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            value={settings.maxLoginAttempts}
                                                            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Password Minimum Length
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            value={settings.passwordMinLength}
                                                            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <label className="font-medium text-gray-700">Require Two-Factor Authentication</label>
                                                            <p className="text-sm text-gray-600">Force all users to enable 2FA</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={settings.requireTwoFactor}
                                                                onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <label className="font-medium text-gray-700">Allow User Registration</label>
                                                            <p className="text-sm text-gray-600">Allow new users to register accounts</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={settings.allowRegistration}
                                                                onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* General Settings Tab */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">General Settings</h3>

                                    <div className="grid gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Globe className="h-5 w-5" />
                                                    Site Configuration
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Site Name
                                                    </label>
                                                    <Input
                                                        value={settings.siteName}
                                                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                                        placeholder="GBV Case Management System"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Site URL
                                                    </label>
                                                    <Input
                                                        value={settings.siteUrl}
                                                        onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                                                        placeholder="https://gbv.example.com"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Admin Email
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        value={settings.adminEmail}
                                                        onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                                                        placeholder="admin@example.com"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Database className="h-5 w-5" />
                                                    System Maintenance
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Button variant="outline" className="flex items-center gap-2">
                                                        <Database className="h-4 w-4" />
                                                        Backup Database
                                                    </Button>
                                                    <Button variant="outline" className="flex items-center gap-2">
                                                        <RefreshCw className="h-4 w-4" />
                                                        Clear Cache
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
