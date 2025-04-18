import {z} from 'zod'
export const SignUpSchema = z.object({
    email:z.string({required_error:"please provide the email"}).email(),
    password :z.string().min(8,"password can be atmost of 8 characters").max(20,"password can be atmost of 20 characters")
})