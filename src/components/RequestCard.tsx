
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface RequestCardProps {
    id: string;
    request: any;
    teamMembers?: string[];
    onAssign?: (requestId: string, member: string) => void;
    onComplete?: (requestId: string) => void;
    onStatusChange?: (requestId: string, status: string) => void;
}

export function RequestCard({ id, request, teamMembers, onAssign, onComplete, onStatusChange }: RequestCardProps) {
    const { user } = useAuth();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityColor: Record<string, string> = {
        'Low': 'bg-gray-100 text-gray-800',
        'Medium': 'bg-blue-100 text-blue-800',
        'High': 'bg-orange-100 text-orange-800',
        'Critical': 'bg-red-100 text-red-800',
    };

    const colorClass = priorityColor[request.priority as string] || 'bg-gray-100';

    // Assignment locking: team users cannot reassign once assigned
    const isAssignmentLocked = user?.role === 'team' && request.assignedTo;

    return (
        <div ref={setNodeRef} style={style} className="mb-3 touch-none">
            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start" {...attributes} {...listeners}>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${colorClass}`}>
                            {request.priority}
                        </span>
                        <GripVertical className="h-4 w-4 text-gray-300 cursor-grab active:cursor-grabbing" />
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm leading-tight mb-1">{request.subject}</h4>
                        <div className="text-xs text-muted-foreground truncate">
                            {request.equipment?.name || "Unknown Equipment"}
                        </div>
                    </div>

                    {request.scheduledDate && (
                        <div className="flex items-center gap-1 text-xs text-orange-600">
                            <Clock className="h-3 w-3" />
                            {new Date(request.scheduledDate).toLocaleDateString()}
                        </div>
                    )}

                    {/* Assignment Section */}
                    {teamMembers && teamMembers.length > 0 && (
                        <div className="pt-2 border-t">
                            <div className="flex items-center gap-2 mb-1">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Assigned To:</span>
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={request.assignedTo || "unassigned"}
                                    onValueChange={(val: string) => onAssign && onAssign(id, val === "unassigned" ? "" : val)}
                                    disabled={isAssignmentLocked}
                                >
                                    <SelectTrigger className="h-7 text-xs w-[120px]">
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                        {teamMembers.map((member) => (
                                            <SelectItem key={member} value={member}>
                                                {member}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {onStatusChange && (
                                    <Select
                                        value={request.status}
                                        onValueChange={(val: string) => onStatusChange(id, val)}
                                    >
                                        <SelectTrigger className="h-7 text-xs w-[100px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New">New</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Repaired">Repaired</SelectItem>
                                            <SelectItem value="Scrap">Scrap</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Read-Only Assignment View (if no dropdown members provided but assigned) */}
                    {!teamMembers && request.assignedTo && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                            <User className="h-3 w-3" />
                            {request.assignedTo}
                        </div>
                    )}

                    {/* Mark Complete Action */}
                    {onComplete && request.status !== 'Repaired' && (
                        <button
                            onClick={() => onComplete(id)}
                            className="w-full mt-3 flex items-center justify-center gap-2 bg-green-100 text-green-700 text-xs font-bold py-1.5 rounded-md hover:bg-green-200 transition-colors"
                        >
                            <span className="h-3 w-3 rounded-full border-2 border-green-600" />
                            Mark as Finished
                        </button>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
