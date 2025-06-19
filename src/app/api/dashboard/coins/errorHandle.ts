import { NextResponse } from "next/server";

export const coinErrorHandle = (error: Error) => {
    console.error('Error wheh fetching coin data:', error);
    return NextResponse.json(
        { error: error.message || 'Failed to fetch coin data' },
        { status: 500 }
    );
}