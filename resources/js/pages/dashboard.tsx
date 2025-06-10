// File: resources/js/pages/dashboard/Dashboard.tsx
import React from 'react';
import DashboardLayout, { type DashboardProps } from '@/components/Dashboard/DashboardLayout';

export default function Dashboard(props: DashboardProps) {
    return <DashboardLayout {...props} />;
}
