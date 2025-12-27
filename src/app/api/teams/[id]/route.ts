
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import MaintenanceTeam from '@/models/MaintenanceTeam';
import Equipment from '@/models/Equipment';


export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        const updated = await MaintenanceTeam.findByIdAndUpdate(id, body, { new: true });

        if (!updated) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.warn('Database offline, using file storage');
        const { id } = await params;
        const body = await request.json();
        const { updateTeam } = await import('@/lib/storage');

        const updated = updateTeam(id, body);
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: 'Team not found (Storage)' }, { status: 404 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        // Safety Check: Do not delete if Equipment is assigned
        const equipmentCount = await Equipment.countDocuments({ maintenanceTeam: id });
        if (equipmentCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete team. ${equipmentCount} equipment assets are still assigned to it.` },
                { status: 400 }
            );
        }

        const deleted = await MaintenanceTeam.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team deleted' });
    } catch (error) {
        console.warn('Database offline, using file storage');
        const { id } = await params;
        const { deleteTeam } = await import('@/lib/storage');
        deleteTeam(id);
        return NextResponse.json({ message: 'Team deleted (Storage)' });
    }
}
