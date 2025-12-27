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
    let body;
    try {
        body = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const equipment = await Equipment.create(body);
        return NextResponse.json(equipment, { status: 201 });
    } catch (error) {
        console.warn('Database offline, saving equipment to file');
        try {
            const { addEquipment } = await import('@/lib/storage');

            // Minimal validation
            if (!body.name || !body.serialNumber) {
                return NextResponse.json({ error: 'Name and Serial Number required' }, { status: 400 });
            }

            const newEquipment = addEquipment(body);
            return NextResponse.json(newEquipment, { status: 201 });
        } catch (storageError) {
            console.error('Error creating equipment (storage fallback):', storageError);
            return NextResponse.json({ error: 'Failed to create equipment' }, { status: 500 });
        }
    }
}
