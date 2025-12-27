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

## 📦 Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/gearguard.git
    cd gearguard
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *Note: If you encounter disk space error (ENOSPC) regarding radix-ui, the project includes lightweight custom replacements for Select and Tabs components.*

3.  **Environment Setup**:
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/gearguard
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:3000`.

## 🗄️ Database & Demo Mode

**GearGuard** is designed to be robust.

-   **Online Mode**: If a local MongoDB instance is running on `127.0.0.1:27017`, the app will connect and use it for all data operations.
-   **Offline/Demo Mode**: If MongoDB is unavailable, the app automatically switches to **File Persistence**. It reads from and writes to `gearguard-data.json` in the project root. This ensures the app works immediately after cloning, with no database setup required for demos.

### Seeding Data
To populate the database (when MongoDB is online) or reset the `gearguard-data.json` file:
```bash
node scripts/seed.js
```

## 🏗️ Project Structure

-   `src/app`: Application routes and pages (Next.js App Router).
-   `src/components`: Reusable UI components (RequestCard, Sidebar, etc.).
-   `src/lib`: Utility functions, database connection (`db.ts`), and storage fallback (`storage.ts`).
-   `src/models`: Mongoose schemas for MongoDB.
-   `scripts`: Database seeding scripts.

*Built for the Future of Maintenance.*
