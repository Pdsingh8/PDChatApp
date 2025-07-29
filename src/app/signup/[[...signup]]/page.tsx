
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
    return (
        <div>
            <SignUp path="/signup" routing="path" signInUrl="/signin" /> 
        </div>
    )
}
