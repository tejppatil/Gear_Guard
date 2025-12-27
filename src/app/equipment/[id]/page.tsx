"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Calendar, MapPin, User, ShieldCheck, ClipboardList, AlertCircle, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed Badge import to avoid issues, using inline styles

interface EquipmentDetail {
    _id: string;
    name: string;
    serialNumber: string;
    department: string;
    location: string;
    assignedTo?: string;
    status: string;
    category: string;
    purchaseDate: string;
    warrantyEnd?: string;
    maintenanceTeam: { _id: string; name: string } | string;
}

export default function EquipmentDetailPage() {
    const { id } = useParams();
    const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
    const [requestCount, setRequestCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState<{ _id: string; name: string }[]>([]);

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<EquipmentDetail>>({});

    useEffect(() => {
        if (id) {
            Promise.all([
                fetch(`/api/equipment/${id}`).then(res => res.json()),
                fetch(`/api/requests?equipment=${id}`).then(res => res.json()),
                fetch('/api/teams').then(res => res.json())
            ]).then(([eqData, reqData, teamsData]) => {
                if (eqData && !eqData.error) {
                    setEquipment(eqData);
                    setEditForm(eqData);
                } else {
                    console.error("Equipment Detail API Error:", eqData);
                    setEquipment(null);
                }

                const open = Array.isArray(reqData)
                    ? reqData.filter((r: any) => r.status !== 'Repaired' && r.status !== 'Scrap').length
                    : 0;
                setRequestCount(open);

                if (Array.isArray(teamsData)) {
                    setTeams(teamsData);
                }

                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [id]);

    const handleSave = async () => {
        if (!equipment) return;

        try {
            const res = await fetch(`/api/equipment/${equipment._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updated = await res.json();
                setEquipment(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update equipment", error);
        }
    };

    const handleCancel = () => {
        setEditForm(equipment || {});
        setIsEditing(false);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!equipment) return <div className="p-8">Equipment not found</div>;

    const teamName = typeof equipment.maintenanceTeam === 'object' ? equipment.maintenanceTeam.name : 'Unknown Team';

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/equipment">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        {isEditing ? (
                            <Input
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="text-2xl font-bold h-10 w-64"
                            />
                        ) : (
                            <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
                        )}

                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Wrench className="h-4 w-4" />
                            <span>{equipment.category}</span>
                            <span>•</span>
                            <span className="font-mono">{equipment.serialNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel} size="sm">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                            <Button onClick={handleSave} size="sm">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                        </Button>
                    )}

                    <Link href={`/requests?equipmentId=${equipment._id}`}>
                        <Button size="lg" className="relative shadow-lg hover:shadow-xl transition-all ml-4">
                            <ClipboardList className="mr-2 h-5 w-5" />
                            Maintenance Requests
                            {requestCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-sm animate-pulse">
                                    {requestCount}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                            {isEditing ? (
                                <Input
                                    value={editForm.serialNumber}
                                    onChange={e => setEditForm({ ...editForm, serialNumber: e.target.value })}
                                />
                            ) : (
                                <p className="font-mono text-lg">{equipment.serialNumber}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Category</p>
                            {isEditing ? (
                                <Select
                                    value={editForm.category}
                                    onValueChange={(val: string) => setEditForm({ ...editForm, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Machinery">Machinery</SelectItem>
                                        <SelectItem value="Vehicle">Vehicle</SelectItem>
                                        <SelectItem value="Tool">Tool</SelectItem>
                                        <SelectItem value="Electronics">Electronics</SelectItem>
                                        <SelectItem value="Furniture">Furniture</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-lg">{equipment.category}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            {isEditing ? (
                                <Select
                                    value={editForm.status}
                                    onValueChange={(val: string) => setEditForm({ ...editForm, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Scrap">Scrap</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${equipment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {equipment.status}
                                </span>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Maintenance Team</p>
                            {isEditing ? (
                                <Select
                                    value={typeof editForm.maintenanceTeam === 'object' ? editForm.maintenanceTeam._id : editForm.maintenanceTeam}
                                    onValueChange={(val: string) => setEditForm({ ...editForm, maintenanceTeam: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Team" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map(team => (
                                            <SelectItem key={team._id} value={team._id}>{team.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    {teamName}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Assignment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Location & Ownership</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Location</p>
                                {isEditing ? (
                                    <Input
                                        value={editForm.location}
                                        onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-base">{equipment.location}</p>
                                )}
                                {!isEditing && <p className="text-xs text-muted-foreground">{equipment.department}</p>}
                                {isEditing && (
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Department</p>
                                        <Select
                                            value={editForm.department}
                                            onValueChange={(val: string) => setEditForm({ ...editForm, department: val })}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue placeholder="Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Production">Production</SelectItem>
                                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                <SelectItem value="Operations">Operations</SelectItem>
                                                <SelectItem value="Logistics">Logistics</SelectItem>
                                                <SelectItem value="IT">IT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                                {isEditing ? (
                                    <Input
                                        value={editForm.assignedTo}
                                        onChange={e => setEditForm({ ...editForm, assignedTo: e.target.value })}
                                        placeholder="Unassigned"
                                    />
                                ) : (
                                    <p className="text-base">{equipment.assignedTo || "Unassigned"}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Warranty & Purchase */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle>Warranty & Purchase Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                                <p>{new Date(equipment.purchaseDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Warranty Expiration</p>
                                <p>{equipment.warrantyEnd ? new Date(equipment.warrantyEnd).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
