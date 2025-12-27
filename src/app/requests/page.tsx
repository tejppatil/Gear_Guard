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

export default function KanbanPage() {
    const [items, setItems] = useState<any[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Drag after 5px move to prevent accidental clicks
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetch("/api/requests")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    console.error("Requests API Error:", data);
                    setItems([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const columns = {
        'New': items.filter(i => i.status === 'New'),
        'In Progress': items.filter(i => i.status === 'In Progress'),
        'Repaired': items.filter(i => i.status === 'Repaired'),
        'Scrap': items.filter(i => i.status === 'Scrap'),
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
            // Find the item we dropped over to find its status
            const overItem = items.find(i => i._id === overId);
            if (overItem) newStatus = overItem.status;
        }

        if (newStatus) {
            // Optimistic update
            setItems((prev) => {
                return prev.map(item => {
                    if (item._id === activeId) {
                        return { ...item, status: newStatus };
                    }
                    return item;
                });
            });

            // API Call
            try {
                await fetch(`/api/requests/${activeId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
            } catch (error) {
                console.error("Failed to update status");
                // Revert details omitted for MVP
            }
        }

        setActiveId(null);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Board</h1>
                    <p className="text-muted-foreground">Manage ongoing repairs and requests.</p>
                </div>
                <Link href="/requests/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Button>
                </Link>
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
