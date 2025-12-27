"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Wrench,
    Users,
    ClipboardList,
    CalendarDays,
    Settings,
    Menu,
    BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/equipment", label: "Equipment", icon: Wrench },
    { href: "/teams", label: "Teams", icon: Users },
    { href: "/requests", label: "Requests", icon: ClipboardList },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
    { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden p-4 flex items-center justify-between bg-card border-b">
                <div className="font-bold text-xl tracking-tight text-primary">
                    GearGuard
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 border-r bg-card text-card-foreground transition-transform md:translate-x-0 md:static",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
                        GearGuard
                    </Link>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* User / Settings Footer (Optional) */}
                <div className="mt-auto border-t p-4">
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                </div>
            </motion.aside>
        </>
    );
}
