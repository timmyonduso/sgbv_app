// File: components/dashboard/shared/MetricCard.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: 'amber' | 'blue' | 'green' | 'purple' | 'red';
    subtitle?: string;
}

const colorClasses = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
};

export default function MetricCard({ title, value, icon: Icon, color, subtitle }: MetricCardProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="flex items-center space-x-2">
                    <Icon className={`h-10 w-10 ${colorClasses[color]}`} />
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <h2 className="text-3xl font-bold">{value}</h2>
                    </div>
                </div>
                {subtitle && (
                    <div className="mt-4 flex items-center space-x-2">
                        <Icon className={`h-5 w-5 ${colorClasses[color]}`} />
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
