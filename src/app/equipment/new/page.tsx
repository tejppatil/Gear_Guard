"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NewEquipmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [teams, setTeams] = useState<{ _id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        serialNumber: "",
        department: "",
        assignedTo: "",
        purchaseDate: "",
        warrantyEnd: "",
        location: "",
        category: "",
        maintenanceTeam: "",
        imageUrl: "",
    });

    useEffect(() => {
        // Fetch teams for the dropdown
        fetch("/api/teams")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTeams(data);
                } else {
                    console.error("Teams API Error:", data);
                    setTeams([]);
                }
            })
            .catch(err => {
                console.error(err);
                setTeams([]);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/equipment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create");

            router.push("/equipment");
            router.refresh();
        } catch (error) {
            alert("Failed to create equipment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/equipment">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">New Equipment</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Equipment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Equipment Name</Label>
                                <Input id="name" name="name" required placeholder="e.g. Laser Printer X1" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="serialNumber">Serial Number</Label>
                                <Input id="serialNumber" name="serialNumber" required placeholder="SN-123456" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" name="category" required placeholder="e.g. Printer, CNC" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maintenanceTeam">Maintenance Team</Label>
                                <select
                                    id="maintenanceTeam"
                                    name="maintenanceTeam"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    onChange={handleChange}
                                    value={formData.maintenanceTeam}
                                >
                                    <option value="">Select Team</option>
                                    {teams.map(team => (
                                        <option key={team._id} value={team._id}>{team.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" name="department" required placeholder="e.g. Production" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assignedTo">Assigned To (Employee)</Label>
                                <Input id="assignedTo" name="assignedTo" placeholder="e.g. John Doe" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" required placeholder="e.g. Floor 2, Room 101" onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Purchase Date</Label>
                                <Input id="purchaseDate" name="purchaseDate" type="date" required onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="warrantyEnd">Warranty Expiration</Label>
                                <Input id="warrantyEnd" name="warrantyEnd" type="date" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                {loading ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Equipment</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
