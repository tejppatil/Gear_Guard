"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CalendarPage() {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/requests")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter for requests with scheduled dates (Preventive mostly)
                    const scheduled = data.filter((r: any) => r.scheduledDate);
                    setRequests(scheduled);
                } else {
                    console.error("Requests API Error:", data);
                    setRequests([]);
                }
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const today = new Date();

    // Generate calendar grid
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const handleDateClick = (date: Date) => {
        // Navigate to new request with type=Preventive and date pre-filled
        const formattedDate = format(date, "yyyy-MM-dd");
        router.push(`/requests/new?type=Preventive&date=${formattedDate}`);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Calendar</h1>
                    <p className="text-muted-foreground">Schedule and view upcoming preventive works.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-[150px] text-center">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="flex-1 flex flex-col shadow-md">
                <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 border-b bg-muted/20">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                            <div key={day} className="p-4 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                        {days.map((day, dayIdx) => {
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, today);
                            const dayEvents = requests.filter(r => isSameDay(new Date(r.scheduledDate), day));

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => handleDateClick(day)}
                                    className={cn(
                                        "min-h-[100px] border-b border-r p-2 transition-colors hover:bg-muted/30 cursor-pointer flex flex-col gap-1 relative",
                                        !isCurrentMonth && "bg-muted/10 text-muted-foreground/50",
                                        isToday && "bg-blue-50/50"
                                    )}
                                >
                                    <span className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                        isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                                    )}>
                                        {format(day, "d")}
                                    </span>

                                    {/* Events */}
                                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px]">
                                        {dayEvents.map(event => (
                                            <Link
                                                key={event._id}
                                                href={`/equipment/${event.equipment?._id}`} // Or request detail if available
                                                onClick={(e) => e.stopPropagation()} // Prevent date click
                                                className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded truncate border border-sky-200 hover:bg-sky-200 transition-colors block"
                                                title={event.subject}
                                            >
                                                {event.subject}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Add button on hover (subtle) */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
