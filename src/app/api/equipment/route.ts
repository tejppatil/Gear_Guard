import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Equipment from '@/models/Equipment';
import MaintenanceTeam from '@/models/MaintenanceTeam';


export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const search = searchParams.get('search');

        let query: any = {};

        if (department) {
            query.department = department;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { serialNumber: { $regex: search, $options: 'i' } },
                { assignedTo: { $regex: search, $options: 'i' } },
            ];
        }

        const equipment = await Equipment.find(query)
            .populate('maintenanceTeam')
            .sort({ createdAt: -1 });

        return NextResponse.json(equipment);
    } catch (error) {
        console.warn('Database offline, serving equipment from file');
        const { getEquipment } = await import('@/lib/storage');
        return NextResponse.json(getEquipment());
    }
}

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const body = await request.json();
        const equipment = await Equipment.create(body);
        return NextResponse.json(equipment, { status: 201 });
    } catch (error) {
        console.error('Error creating equipment:', error);
        return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
    }
}
