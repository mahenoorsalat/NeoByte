import { inngest, syncUserCreation, syncUserDeletion, syncUserUpdation } from "@/config/inngest";
import { serve } from "inngest/next";

// Create a api to send and receive events
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        syncUserCreation,
        syncUserUpdation,
        syncUserDeletion
    ],
})

