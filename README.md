# GearGuard - Intelligent Maintenance Management System (IMMS)

**GearGuard** is a modern, web-based platform designed to streamline equipment maintenance, track repairs, and manage maintenance teams efficiently. Built with performance and user experience in mind, it bridges the gap between complex industrial requirements and intuitive design.

## 🚀 Features

-   **Dashboard Analytics**: Real-time overview of equipment status, active requests, and maintenance health.
-   **Asset Management**: detailed records of all equipment, including warranties, breakdown history, and location.
-   **Maintenance Kanban Board**: A drag-and-drop interface for managing maintenance requests through their lifecycle (New -> In Progress -> Repaired).
-   **Team Command Center**: Manage maintenance crews, assign specific members to tasks, and track individual workloads.
-   **Smart Assignment**: "Assign To" functionality allows granular delegation of tasks to specific technicians.
-   **Hybrid Persistence (Demo Mode)**: Seamlessly operates with a local MongoDB database or falls back to a file-based JSON storage system for offline/demo environments.

## 🛠️ Technology Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/) (Icons)
-   **Animation**: Framer Motion
-   **Database**: MongoDB (via Mongoose)
-   **Interactivity**: DnD Kit (Drag & Drop), Custom UI Components (Select, Tabs, Badges)
