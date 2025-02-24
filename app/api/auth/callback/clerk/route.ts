import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectMongo from '@/app/api/lib/db/connectMongo';
import User from '@/app/api/lib/models/User';

export async function GET(req: NextRequest) {
    try {
        // Fetch authenticated user's ID
        const { userId } = await auth();
        
        if (!userId) {
            // Return 401 Unauthorized if no user ID is found
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Immediately redirect user to /loading
        const response = NextResponse.redirect(new URL('/loading', req.url));

        // Perform database operations in the background
        (async () => {
            try {
                // Connect to the MongoDB database
                await connectMongo();

                // Check if the user already exists in the database
                const existingUser = await User.findOne({ clerkUid: userId });

                if (!existingUser) {
                    // Create a new user if not found
                    await User.create({
                        clerkUid: userId,
                        email: 'placeholder@example.com', // Replace this with a method to fetch the email securely
                        firstName: 'Placeholder', // Replace with user's first name
                        lastName: 'Placeholder', // Replace with user's last name
                        subscriptionType: 'free',
                        signupDate: new Date(),
                        repositories: [],
                    });
                }
            } catch (error) {
                console.error('Background processing error:', error);
            }
        })();

        return response; // Return redirect response immediately
    } catch (error) {
        console.error('Middleware error:', error);

        // Redirect to error page if an error occurs
        return NextResponse.redirect(new URL('/error', req.url));
    }
}
