import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MaintenanceTeam from '@/models/MaintenanceTeam';



export async function GET() {
    try {
        await connectToDatabase();
        const teams = await MaintenanceTeam.find({}).sort({ createdAt: -1 });
        return NextResponse.json(teams);
    } catch (error) {
        console.warn('Database offline, serving teams from file');
        const { getTeams } = await import('@/lib/storage');
        return NextResponse.json(getTeams());
    }
}

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const team = await MaintenanceTeam.create(body);
        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        console.warn('Database offline, saving team to file');
        try {
            const { addTeam } = await import('@/lib/storage');

            // Validate body minimally
            if (!body.name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

            const newTeam = addTeam(body);
            return NextResponse.json(newTeam, { status: 201 });
        } catch (storageError) {
            return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
        }
    }
}
