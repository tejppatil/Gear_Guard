"use client";

import { useState, useEffect } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Team {
    _id: string;
    name: string;
    members: string[];
}

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamMembers, setNewTeamMembers] = useState("");

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const res = await fetch("/api/teams");
            const data = await res.json();
            if (Array.isArray(data)) {
                setTeams(data);
            } else {
                console.error("Teams API Error:", data);
                setTeams([]);
            }
        } catch (error) {
            console.error("Failed to fetch teams", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName) return;

        const membersArray = newTeamMembers.split(",").map(m => m.trim()).filter(m => m);

        try {
            const res = await fetch("/api/teams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newTeamName,
                    members: membersArray
                }),
            });

            if (res.ok) {
                setNewTeamName("");
                setNewTeamMembers("");
                fetchTeams();
            }
        } catch (error) {
            console.error("Failed to create team", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team?")) return;

        try {
            const res = await fetch(`/api/teams/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to delete team");
                return;
            }

            fetchTeams();
        } catch (error) {
            console.error("Failed to delete team", error);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Maintenance Teams</h1>
                <p className="text-muted-foreground">Manage your specialized maintenance crews.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Team Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Team</CardTitle>
                        <CardDescription>Add a specialized team (e.g. Electricians)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="teamName">Team Name</Label>
                                <Input
                                    id="teamName"
                                    placeholder="e.g. Mechanics"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="members">Members (comma separated)</Label>
                                <Input
                                    id="members"
                                    placeholder="e.g. John, Mike, Sarah"
                                    value={newTeamMembers}
                                    onChange={(e) => setNewTeamMembers(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Create Team
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Existing Teams List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Existing Teams</h2>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />)}
                        </div>
                    ) : (
                        teams.map((team) => (
                            <Card key={team._id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Link href={`/teams/${team._id}`} className="hover:underline">
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {team.name}
                                            </CardTitle>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                            onClick={() => handleDelete(team._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span className="font-medium text-foreground">{team.members.length} Members:</span>
                                        {team.members.join(", ")}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                    {!loading && teams.length === 0 && (
                        <p className="text-muted-foreground">No teams found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
