import { GuestLayout } from "@/comon/guestLayout"

const OtpVerification = () => {
    return (
        <GuestLayout>
            <div className="w-[35%] bg-zinc-900 p-10 rounded flex flex-col gap-8">
                <p className="text-center text-xl">Please verify your Email</p>
                <form action="" method="post">
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                        <input type="text" maxLength={1} className="w-10 h-10 border rounded text-white text-center outline-none" />
                    </div>
                </form>
            </div>
        </GuestLayout>
    )
}

export default OtpVerification