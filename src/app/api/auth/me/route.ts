import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('auth_user');

    if (!userCookie) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const user = JSON.parse(userCookie.value);
        return NextResponse.json({ user });
    } catch (e) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}

export async function POST(request: Request) {
    // LOGOUT
    (await cookies()).delete('auth_user');
    return NextResponse.json({ success: true });
}
