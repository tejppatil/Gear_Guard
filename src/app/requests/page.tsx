"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, GripVertical, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // I will simulate badge style if not imported, but shadcn/ui usually has it. I'll use inline class.

import { RequestCard } from "@/components/RequestCard";
import { useAuth } from "@/context/AuthContext";

function Column({ id, title, items }: { id: string, title: string, items: any[] }) {
    const { setNodeRef } = useSortable({ id });
    return (
        <div ref={setNodeRef} className="flex flex-col bg-muted/50 rounded-xl p-4 min-h-[500px]">
            <h3 className="font-bold mb-4 flex items-center justify-between text-muted-foreground text-sm uppercase tracking-wide">
                {title}
                <span className="bg-background text-foreground px-2 py-0.5 rounded-full text-xs border">
                    {items.length}
                </span>
            </h3>
            <SortableContext id={id} items={items.map(i => i._id)} strategy={verticalListSortingStrategy}>
                {items.map((req) => (
                    <RequestCard key={req._id} id={req._id} request={req} />
                ))}
            </SortableContext>
        </div>
    );
}

export default function RequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/requests");
            const data = await res.json();
            if (Array.isArray(data)) {
                // Filter requests for team users
                let filteredData = data;
                if (user?.role === 'team' && user.teamId) {
                    filteredData = data.filter((req: any) => {
                        const teamId = typeof req.maintenanceTeam === 'object'
                            ? req.maintenanceTeam._id
                            : req.maintenanceTeam;
                        return teamId === user.teamId;
                    });
                }
                setRequests(filteredData);
            } else {
                console.error("Requests API Error:", data);
                setRequests([]);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = {
        'New': requests.filter((i: any) => i.status === 'New'),
        'In Progress': requests.filter((i: any) => i.status === 'In Progress'),
        'Repaired': requests.filter((i: any) => i.status === 'Repaired'),
        'Scrap': requests.filter((i: any) => i.status === 'Scrap'),
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Logic for sorting between lists if needed visually
        // For simple Kanban, we might rely on DragEnd mainly, but visual feedback is good.
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Determine target container (status)
        // If overId is a container ID (column status)
        // OR if overId is an item ID, we find its container.

        let newStatus = "";

        if (Object.keys(columns).includes(overId as string)) {
            newStatus = overId as string;
        } else {
            // If overId is an item ID, find its parent column's status
            const overItem = requests.find((i: any) => i._id === overId);
            if (overItem) {
                newStatus = overItem.status;
            }
        }

        if (newStatus && activeItem.status !== newStatus) {
            // Optimistic update
            setRequests((prev: any[]) =>
                prev.map((item: any) =>
                    item._id === activeId ? { ...item, status: newStatus } : item
                )
            );

            // API Call
            try {
                const res = await fetch(`/api/requests/${activeId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!res.ok) {
                    console.error("Failed to update request status on server");
                    // Revert optimistic update if API call fails (optional for MVP)
                    setRequests((prev: any[]) =>
                        prev.map((item: any) =>
                            item._id === activeId ? { ...item, status: activeItem.status } : item
                        )
                    );
                }
            } catch (error) {
                console.error("Failed to update request status", error);
                // Revert optimistic update if API call fails (optional for MVP)
                setRequests((prev: any[]) =>
                    prev.map((item: any) =>
                        item._id === activeId ? { ...item, status: activeItem.status } : item
                    )
                );
            }
        }

        setActiveId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between mb-6 w-full">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
                        <p className="text-muted-foreground">Drag and drop to change status</p>
                    </div>
                    <Link href="/requests/new">
                        <Button size="lg">
                            <Plus className="mr-2 h-4 w-4" /> New Request
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex gap-4 overflow-auto pb-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="min-w-[280px] w-full h-96 bg-muted rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start">
                        {Object.entries(columns).map(([status, colItems]) => (
                            <div key={status} className="min-w-[280px] w-full max-w-sm">
                                <Column id={status} title={status} items={colItems} />
                            </div>
                        ))}
                    </div>
                    <DragOverlay>
                        {activeId ? (
                            <Card className="w-[280px] shadow-2xl rotate-2 cursor-grabbing opacity-90">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold">Moving Request...</h4>
                                </CardContent>
                            </Card>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            )}
        </div>
    );
}
