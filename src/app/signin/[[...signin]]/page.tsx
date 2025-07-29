import { SignIn} from '@clerk/nextjs'
 

 export default function SignInPage (){
    return (
        <div>
            <SignIn path="/signin" routing="path" signUpUrl="/signup" />
            {/* You can add a custom sign-in form here if needed */}
        </div>
    )
 }