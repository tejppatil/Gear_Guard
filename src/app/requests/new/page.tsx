"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

function NewRequestForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedEquipment = searchParams.get("equipmentId");

    const [loading, setLoading] = useState(false);
    const [equipmentList, setEquipmentList] = useState<{ _id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        subject: "",
        equipment: preselectedEquipment || "",
        type: "Corrective",
        priority: "Medium",
        description: "",
        scheduledDate: "",
        requestedBy: "Current User",
    });

    useEffect(() => {
        fetch("/api/equipment")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEquipmentList(data);
                } else {
                    console.error("Equipment API error:", data);
                    setEquipmentList([]);
                }
            })
            .catch(err => {
                console.error(err);
                setEquipmentList([]);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create request");

            router.push("/requests");
            router.refresh();
        } catch (error) {
            alert("Failed to create request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            required
                            placeholder="e.g. Oil Leakage in Unit 2"
                            value={formData.subject}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="equipment">Equipment</Label>
                            <select
                                id="equipment"
                                name="equipment"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChange}
                                value={formData.equipment}
                            >
                                <option value="">Select Equipment</option>
                                {equipmentList.map(eq => (
                                    <option key={eq._id} value={eq._id}>{eq.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Request Type</Label>
                            <select
                                id="type"
                                name="type"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChange}
                                value={formData.type}
                            >
                                <option value="Corrective">Corrective (Breakdown)</option>
                                <option value="Preventive">Preventive (Routine)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <select
                                id="priority"
                                name="priority"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChange}
                                value={formData.priority}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        {formData.type === "Preventive" && (
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                                <Input
                                    id="scheduledDate"
                                    name="scheduledDate"
                                    type="date"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe the issue in detail..."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading} className="w-full md:w-auto">
                            {loading ? "Creating..." : <><Save className="mr-2 h-4 w-4" /> Create Request</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

export default function NewRequestPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/requests">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">New Maintenance Request</h1>
                    <p className="text-muted-foreground">Report a breakdown or schedule checkup.</p>
                </div>
            </div>

            <Suspense fallback={<div className="p-4">Loading form...</div>}>
                <NewRequestForm />
            </Suspense>
        </div>
    );
}
