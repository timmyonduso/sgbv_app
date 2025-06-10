// File: components/dashboard/shared/WorkloadChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WorkloadChartProps {
    data: any[];
}

export default function WorkloadChart({ data }: WorkloadChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Caseworker Workload</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
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
    );
}
