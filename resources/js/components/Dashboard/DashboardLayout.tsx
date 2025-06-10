// File: components/dashboard/DashboardLayout.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import CaseworkerDashboard from '@/components/Dashboard/CaseworkerDashboard';
import SurvivorDashboard from '@/components/Dashboard/SurvivorDashboard';
import LawEnforcementDashboard from '@/components/Dashboard/LawEnforcementDashboard';

// Exported Types
export interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ name: string }>;
}

export interface BaseMetrics {
    total_incidents: number;
    total_cases: number;
    open_cases: number;
    pending_incidents: number;
    caseworker_count: number;
    survivor_count: number;
    avg_response_time: number;
}

export interface CaseItem {
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
    priority: 'low' | 'medium' | 'high';
    survivor_name: string;
}

export interface Incident {
    id: number;
    survivor_id: number;
    assigned_caseworker_id: number;
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
}

export interface Caseworker {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface PersonalWorkload {
    open_cases: number;
    closed_cases: number;
    pending_incidents: number;
    avg_response_time: number;
}

export interface PendingApproval {
    id: number;
    title: string;
    date: string;
    type: string;
    requestor?: string;
}

export interface SystemLog {
    id: number;
    action: string;
    user_id: number;
    timestamp: string;
    details?: string;
}

export interface StatusDistribution {
    status: string;
    count: number;
    percentage?: number;
}

export interface WorkloadData {
    caseworker_id: number;
    caseworker_name: string;
    open_cases: number;
    closed_cases: number;
    total_cases: number;
}

export interface DashboardProps {
    user: User;
    metrics: BaseMetrics;
    recentIncidents: Incident[];
    caseWorkload: WorkloadData[];
    incidentStatusDistribution: StatusDistribution[];
    caseStatusDistribution: StatusDistribution[];
    // Role-specific data
    userCases?: CaseItem[];
    assignedCaseworker?: Caseworker;
    investigationIncidents?: Incident[];
    pendingApprovals?: PendingApproval[];
    systemLogs?: SystemLog[];
    personalWorkload?: PersonalWorkload;
    currentUserId: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DashboardLayout(props: DashboardProps) {
    const { user } = props;

    // Get the user's primary role
    const getUserRole = () => {
        if (!user.roles || user.roles.length === 0) return 'survivor';
        return user.roles[0].name.toLowerCase();
    };

    const userRole = getUserRole();

    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard {...props} />;
            case 'caseworker':
            case 'case_worker':
                return <CaseworkerDashboard {...props} />;
            case 'survivor':
                return <SurvivorDashboard {...props} currentUserId={user.id} />;
            case 'law_enforcement':
                return <LawEnforcementDashboard {...props} />;
            default:
                return <SurvivorDashboard {...props} currentUserId={user.id} />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {renderDashboard()}
            </div>
        </AppLayout>
    );
}
