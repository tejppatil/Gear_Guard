"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Calendar, MapPin, User, ShieldCheck, ClipboardList, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Note: I need to create Badge or use span, assuming Badge exists or I'll just use span styling

// Assuming Badge component doesn't exist yet, I'll inline styles or use a span. 
// Actually, I should create a Badge component later, but for now I'll use standard Tailwind classes.

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

    useEffect(() => {
        if (id) {
            Promise.all([
                fetch(`/api/equipment/${id}`).then(res => res.json()),
                fetch(`/api/requests?equipment=${id}`).then(res => res.json())
            ]).then(([eqData, reqData]) => {
                if (eqData && !eqData.error) {
                    setEquipment(eqData);
                } else {
                    console.error("Equipment Detail API Error:", eqData);
                    setEquipment(null);
                }

                // Count open requests safely
                const open = Array.isArray(reqData)
                    ? reqData.filter((r: any) => r.status !== 'Repaired' && r.status !== 'Scrap').length
                    : 0;
                setRequestCount(open);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [id]);

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
                        <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Wrench className="h-4 w-4" />
                            <span>{equipment.category}</span>
                            <span>•</span>
                            <span className="font-mono">{equipment.serialNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Smart Button */}
                <Link href={`/requests?equipmentId=${equipment._id}`}>
                    <Button size="lg" className="relative shadow-lg hover:shadow-xl transition-all">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                            <p className="font-mono text-lg">{equipment.serialNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Category</p>
                            <p className="text-lg">{equipment.category}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${equipment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {equipment.status}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Maintenance Team</p>
                            <p className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                {teamName}
                            </p>
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
                                <p className="text-base">{equipment.location}</p>
                                <p className="text-xs text-muted-foreground">{equipment.department}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                                <p className="text-base">{equipment.assignedTo || "Unassigned"}</p>
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
