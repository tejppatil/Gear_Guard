"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
    const [data, setData] = useState<{ teamData: any[], categoryData: any[], priorityData: any[] }>({ teamData: [], categoryData: [], priorityData: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/requests").then(res => res.json()),
            fetch("/api/teams").then(res => res.json())
        ]).then(([requests, teams]) => {
            const safeRequests = Array.isArray(requests) ? requests : [];
            const safeTeams = Array.isArray(teams) ? teams : [];

            // Process Data
            // 1. Requests per Team
            const teamCounts: Record<string, number> = {};
            safeRequests.forEach((r: any) => {
                const tName = r.maintenanceTeam?.name || "Unassigned";
                teamCounts[tName] = (teamCounts[tName] || 0) + 1;
            });
            const teamData = Object.entries(teamCounts).map(([name, count]) => ({ name, count }));

            // 2. Requests per Priority
            const priorityCounts: Record<string, number> = {};
            requests.forEach((r: any) => {
                priorityCounts[r.priority] = (priorityCounts[r.priority] || 0) + 1;
            });
            const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));

            setData({ teamData, categoryData: [], priorityData });
            setLoading(false);
        });
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) return <div className="p-8">Loading analytics...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
                <p className="text-muted-foreground">Insights into maintenance performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Requests per Team</CardTitle>
                        <CardDescription>Workload distribution across maintenance teams</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.teamData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Requests by Priority</CardTitle>
                        <CardDescription>Breakdown of request urgency</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.priorityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
