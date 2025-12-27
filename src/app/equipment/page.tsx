"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Layers, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Equipment {
    _id: string;
    name: string;
    serialNumber: string;
    department: string;
    assignedTo?: string;
    status: string;
    category: string;
    maintenanceTeam: { name: string } | string;
    imageUrl?: string;
}

export default function EquipmentPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [groupBy, setGroupBy] = useState<"none" | "department" | "assignedTo">("none");

    useEffect(() => {
        fetchEquipment();
    }, [search]);

    const fetchEquipment = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            const res = await fetch(`/api/equipment?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setEquipment(data);
            } else {
                console.error("Equipment API Error:", data);
                setEquipment([]);
            }
        } catch (error) {
            console.error("Failed to fetch equipment", error);
        } finally {
            setLoading(false);
        }
    };

    const groupedEquipment = () => {
        if (groupBy === "none") return { All: equipment };

        return equipment.reduce((acc, item) => {
            const key = (item[groupBy] as string) || "Unassigned";
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, Equipment[]>);
    };

    const groups = groupedEquipment();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
                    <p className="text-muted-foreground">Manage assets and track maintenance.</p>
                </div>
                <Link href="/equipment/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Equipment
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-lg border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, serial, or assignee..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm font-medium text-muted-foreground">Group by:</span>
                    <Button
                        variant={groupBy === "none" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGroupBy("none")}
                    >
                        None
                    </Button>
                    <Button
                        variant={groupBy === "department" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGroupBy("department")}
                    >
                        <Layers className="mr-2 h-4 w-4" /> Dept
                    </Button>
                    <Button
                        variant={groupBy === "assignedTo" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGroupBy("assignedTo")}
                    >
                        <User className="mr-2 h-4 w-4" /> Employee
                    </Button>
                </div>
            </div>

            <div className="space-y-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : (
                    Object.entries(groups).map(([groupName, items]) => (
                        <div key={groupName} className="space-y-4">
                            {groupBy !== "none" && (
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <span className="w-2 h-6 bg-primary rounded-full" />
                                    {groupName}
                                    <span className="text-sm font-normal text-muted-foreground">({items.length})</span>
                                </h2>
                            )}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {items.map((item) => (
                                    <Link key={item._id} href={`/equipment/${item._id}`}>
                                        <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-medium">
                                                        {item.category}
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                </div>
                                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                    {item.name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <p>SN: <span className="font-mono text-foreground">{item.serialNumber}</span></p>
                                                    <p>Dept: {item.department}</p>
                                                    <p>Assigned: {item.assignedTo || "Unassigned"}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </motion.div>
                        </div>
                    ))
                )}

                {!loading && equipment.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No equipment found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
