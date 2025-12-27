
"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Trash2, Save, Wrench, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequestCard } from "@/components/RequestCard";
import {
    DndContext,
    closestCorners,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    DragEndEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [team, setTeam] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Member Management State
    const [newMember, setNewMember] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Team Details
                const teamRes = await fetch(`/api/teams`);
                const allTeams = await teamRes.json();
                const currentTeam = allTeams.find((t: any) => t._id === id);
                setTeam(currentTeam);

                // Fetch Requests for this Team
                const reqRes = await fetch(`/api/requests`);
                const allRequests = await reqRes.json();

                // Filter requests for this team (ignoring Repaired/Scrap for active workload)
                const teamRequests = allRequests.filter((r: any) =>
                    r.maintenanceTeam?._id === id && r.status !== 'Scrap'
                );

                setRequests(teamRequests);
            } catch (error) {
                console.error("Failed to load team data", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMember || !team) return;

        const updatedMembers = [...team.members, newMember];

        try {
            const res = await fetch(`/api/teams/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ members: updatedMembers })
            });

            if (res.ok) {
                setTeam({ ...team, members: updatedMembers });
                setNewMember("");
            }
        } catch (error) {
            console.error("Failed to add member", error);
        }
    };

    const handleRemoveMember = async (memberToRemove: string) => {
        if (!confirm(`Remove ${memberToRemove} from the team?`)) return;

        const updatedMembers = team.members.filter((m: string) => m !== memberToRemove);

        try {
            const res = await fetch(`/api/teams/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ members: updatedMembers })
            });

            if (res.ok) {
                setTeam({ ...team, members: updatedMembers });
            }
        } catch (error) {
            console.error("Failed to remove member", error);
        }
    };

    const handleAssignMember = async (requestId: string, member: string) => {
        // Optimistic Update
        setRequests(prev => prev.map(r => r._id === requestId ? { ...r, assignedTo: member } : r));

        try {
            await fetch(`/api/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedTo: member })
            });
        } catch (error) {
            console.error("Failed to assign member", error);
        }
    };

    if (loading) return <div className="p-8">Loading team dashboard...</div>;
    if (!team) return <div className="p-8">Team not found.</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 border-b pb-6">
                <Link href="/teams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{team.name} Dashboard</h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <UsersIcon className="h-4 w-4" /> {team.members.length} Members
                        <Briefcase className="h-4 w-4 ml-4" /> {requests.length} Active Tasks
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Roster Management */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Roster</CardTitle>
                            <CardDescription>Manage your crew members.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleAddMember} className="flex gap-2">
                                <Input
                                    placeholder="New Member Name"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                />
                                <Button type="submit" size="icon">
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </form>

                            <div className="space-y-2">
                                {team.members.map((member: string) => (
                                    <div key={member} className="flex items-center justify-between p-2 bg-muted rounded-md group">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                {member.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium">{member}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleRemoveMember(member)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Work Assignment */}
                <div className="md:col-span-2">
                    <Card className="h-full border-dashed bg-muted/20">
                        <CardHeader>
                            <CardTitle>Work Verification & Assignment</CardTitle>
                            <CardDescription>Assign active requests to team members.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DndContext sensors={sensors} collisionDetection={closestCorners}>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {requests.length === 0 ? (
                                        <p className="text-muted-foreground col-span-2 text-center py-10">No active work assigned to this team.</p>
                                    ) : (
                                        requests.map(req => (
                                            <RequestCard
                                                key={req._id}
                                                id={req._id}
                                                request={req}
                                                teamMembers={team.members}
                                                onAssign={handleAssignMember}
                                            />
                                        ))
                                    )}
                                </div>
                            </DndContext>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

