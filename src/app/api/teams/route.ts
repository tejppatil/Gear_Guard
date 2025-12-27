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
    try {
        await connectToDatabase();
        const body = await request.json();
        const team = await MaintenanceTeam.create(body);
        return NextResponse.json(team, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
    }
}
