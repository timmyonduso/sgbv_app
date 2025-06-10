// File: components/dashboard/shared/PersonalWorkloadChart.tsx
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PersonalWorkloadChartProps {
    data: {
        open_cases: number;
        closed_cases: number;
        pending_incidents: number;
    };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function PersonalWorkloadChart({ data }: PersonalWorkloadChartProps) {
    const chartData = [
        { name: 'Open Cases', value: data.open_cases },
        { name: 'Closed Cases', value: data.closed_cases },
        { name: 'Pending Incidents', value: data.pending_incidents }
    ].filter(item => item.value > 0);

    if (chartData.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-8">No workload data available</p>;
    }

    return (
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
