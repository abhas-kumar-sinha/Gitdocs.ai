import User from "@/app/api/lib/models/User";

export const updateUserDb = async (user_id: string, github_user_id: string) => {

    // Update only if githubUid is empty (null or undefined)
    await User.findOneAndUpdate(
        { clerkUid: user_id, githubUid: { $exists: false } }, // Check if githubUid doesn't exist
        { $set: { githubUid: github_user_id } }, // Update the githubUid field
        { new: true } // Return the updated document
    );

};

