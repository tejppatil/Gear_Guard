"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, Users, Trash2, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RequestCard } from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";

interface Team {
    _id: string;
    name: string;
    members: string[];
}

interface Request {
    _id: string;
    subject: string;
    equipment: { name: string; _id: string } | string;
    status: string;
    priority: string;
    assignedTo?: string;
    maintenanceTeam?: { _id: string; name: string } | string;
    scheduledDate?: string;
}

export default function TeamDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [team, setTeam] = useState<Team | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);
    const [newMember, setNewMember] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Access control: team users can only view their own team
            if (user?.role === 'team' && user.teamId !== id) {
                router.push('/teams');
                return;
            }

            fetchData();
        }
    }, [id, user, router]);

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

            // Filter requests for this team
            const teamRequests = Array.isArray(allRequests)
                ? allRequests.filter((r: any) => {
                    const teamId = typeof r.maintenanceTeam === 'object' ? r.maintenanceTeam._id : r.maintenanceTeam;
                    return teamId === id && r.status !== 'Scrap';
                })
                : [];

            setRequests(teamRequests);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
            setLoading(false);
        }
    };

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
        if (!team) return;

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
        try {
            const res = await fetch(`/api/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedTo: member })
            });

            if (res.ok) {
                setRequests((prev: Request[]) =>
                    prev.map((r: Request) => (r._id === requestId ? { ...r, assignedTo: member } : r))
                );
            }
        } catch (error) {
            console.error("Failed to assign member", error);
        }
    };

    const handleStatusChange = async (requestId: string, status: string) => {
        try {
            const res = await fetch(`/api/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setRequests((prev: Request[]) =>
                    prev.map((r: Request) => (r._id === requestId ? { ...r, status } : r))
                );
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleComplete = async (requestId: string) => {
        try {
            const res = await fetch(`/api/requests/${requestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: 'Repaired' })
            });

            if (res.ok) {
                setRequests((prev: Request[]) =>
                    prev.map((r: Request) => (r._id === requestId ? { ...r, status: 'Repaired' } : r))
                );
            }
        } catch (error) {
            console.error("Failed to complete request", error);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!team) return <div className="p-8">Team not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/teams">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{team.name}</h1>
                        <p className="text-muted-foreground">Team Dashboard</p>
                    </div>
                </div>
                <Link href="/requests/new">
                    <Button size="lg">
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Team Roster */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Roster</CardTitle>
                        <CardDescription>
                            {user?.role === 'admin' ? 'Manage your team members' : 'View team members'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Only admins can add members */}
                        {user?.role === 'admin' && (
                            <div className="space-y-2">
                                <Label htmlFor="newMember">Add Member</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="newMember"
                                        placeholder="Member name"
                                        value={newMember}
                                        onChange={(e) => setNewMember(e.target.value)}
                                    />
                                    <Button onClick={handleAddMember} size="icon">
                                        <UserPlus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {team.members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-card rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{member}</span>
                                    </div>
                                    {user?.role === 'admin' && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                            onClick={() => handleRemoveMember(member)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Work Assignment */}
                <div className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Active Requests</CardTitle>
                            <CardDescription>Assign and manage team workload</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {requests.length === 0 ? (
                                    <p className="text-muted-foreground col-span-2 text-center py-10">
                                        No active requests for this team.
                                    </p>
                                ) : (
                                    requests.map(req => (
                                        <RequestCard
                                            key={req._id}
                                            id={req._id}
                                            request={req}
                                            teamMembers={team.members}
                                            onAssign={handleAssignMember}
                                            onStatusChange={handleStatusChange}
                                            onComplete={handleComplete}
                                        />
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
