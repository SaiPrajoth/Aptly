import { ZodError } from "zod";
import { SignUpSchema } from "~/schemas/SignUpSchema";

export async function register(prevState: string | undefined, formData:FormData) {
    try {
        const {email,password} = await SignUpSchema.parseAsync({email:formData.get('email'),password:formData.get('password')})
    } catch (error) {
        if(error instanceof ZodError){
            return error.errors.map((error)=> error.message).join('\n')
        }

        if (error instanceof Error) {
            return error.message;
        }
        


    }
}

