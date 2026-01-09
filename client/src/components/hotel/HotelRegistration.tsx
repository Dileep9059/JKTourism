import { HotelSignupForm } from "./hotel-signup-form"

const HotelRegistration = () => {
    return (
        <div className="bg-black flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-6xl">
                <HotelSignupForm />
            </div>
        </div>
    )
}

export default HotelRegistration