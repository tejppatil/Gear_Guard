"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Users, Trash2, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

interface Team {
    _id: string;
    name: string;
    members: string[];
}

export default function TeamsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            // Redirect team users to their own team dashboard
            if (user.role === 'team' && user.teamId) {
                router.push(`/teams/${user.teamId}`);
                return;
            }

            // Fetch teams for admin
            if (user.role === 'admin') {
                fetchTeams();
            }
        }
    }, [user, loading, router]);

    const fetchTeams = async () => {
        try {
            const res = await fetch('/api/teams');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTeams(data);
            }
        } catch (error) {
            console.error('Failed to fetch teams', error);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        setIsCreating(true);
        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTeamName, members: [] })
            });

            if (res.ok) {
                const newTeam = await res.json();
                setTeams([...teams, newTeam]);
                setNewTeamName("");
            }
        } catch (error) {
            console.error('Failed to create team', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteTeam = async (teamId: string, teamName: string) => {
        if (!confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/teams/${teamId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setTeams(teams.filter(t => t._id !== teamId));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete team');
            }
        } catch (error) {
            console.error('Failed to delete team', error);
            alert('Failed to delete team');
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (user?.role === 'team') {
        return null; // Redirecting
    }

    if (user?.role !== 'admin') {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
                    <p className="text-muted-foreground">Manage all maintenance teams and their members</p>
                </div>
            </div>

            {/* Create New Team */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Create New Team
                    </CardTitle>
                    <CardDescription>Add a new maintenance team to the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateTeam} className="flex gap-2">
                        <Input
                            placeholder="Enter team name (e.g., Plumbing Team)"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="max-w-md"
                        />
                        <Button type="submit" disabled={isCreating || !newTeamName.trim()}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {isCreating ? 'Creating...' : 'Create Team'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Teams Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-center">
                                No teams found. Create your first team to get started.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    teams.map((team) => (
                        <Card key={team._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            {team.name}
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-red-500"
                                        onClick={() => handleDeleteTeam(team._id, team.name)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {team.members.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground uppercase">Members</p>
                                        <div className="flex flex-wrap gap-2">
                                            {team.members.slice(0, 3).map((member, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs"
                                                >
                                                    {member}
                                                </span>
                                            ))}
                                            {team.members.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                                                    +{team.members.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Link href={`/teams/${team._id}`}>
                                    <Button variant="outline" className="w-full">
                                        Manage Team
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
