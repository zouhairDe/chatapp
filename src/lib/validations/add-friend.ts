import {z} from "zod"

export const addFrienValidator = z.object({
    email: z.string().email()
})