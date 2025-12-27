"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Wrench, Activity, Clock, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [stats, setStats] = useState({
    equipmentCount: 0,
    activeRequests: 0,
    scheduledJobs: 0,
    repairedJobs: 0
  });

  useEffect(() => {
    // Fetch count data
    Promise.all([
      fetch("/api/equipment").then(res => res.json()),
      fetch("/api/requests").then(res => res.json())
    ]).then(([equipment, requests]) => {
      const safeEquipment = Array.isArray(equipment) ? equipment : [];
      const safeRequests = Array.isArray(requests) ? requests : [];

      const active = safeRequests.filter((r: any) => r.status !== 'Repaired' && r.status !== 'Scrap').length;
      const scheduled = safeRequests.filter((r: any) => r.scheduledDate && new Date(r.scheduledDate) > new Date()).length;
      const repaired = safeRequests.filter((r: any) => r.status === 'Repaired').length;

      setStats({
        equipmentCount: safeEquipment.length,
        activeRequests: active,
        scheduledJobs: scheduled,
        repairedJobs: repaired
      });
    }).catch(err => console.error(err));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-primary text-primary-foreground p-8 md:p-12 shadow-2xl">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl decoration-clone"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10 max-w-2xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            System Operational
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            GearGuard <br />
            <span className="text-white/80">Maintenance Zero.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/70 mb-8 max-w-lg">
            The ultimate maintenance tracker. Seamlessly connect Equipment, Teams, and Requests in one fluid workflow.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4">
            <Link href="/requests">
              <Button size="lg" variant="secondary" className="gap-2 text-primary font-bold">
                View Requests <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/equipment">
              <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                Manage Assets
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Stats / Modules */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Link href="/equipment">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.equipmentCount}</div>
              <p className="text-xs text-muted-foreground">Registered Assets</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/requests">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeRequests}</div>
              <p className="text-xs text-muted-foreground">Pending Action</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/calendar">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledJobs}</div>
              <p className="text-xs text-muted-foreground">Upcoming Preventive</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reports">
          <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repaired Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.repairedJobs}</div>
              <p className="text-xs text-muted-foreground">Total Completed</p>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}
