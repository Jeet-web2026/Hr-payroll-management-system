import { GuestLayout } from "@/comon/guestLayout"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"

const OtpVerification = () => {
    const [searchParam] = useSearchParams();
    const otpFromUrl = searchParam.get('otp');

    const [otpInputs, setOtpInputs] = useState<string[]>(Array(6).fill(""));

    useEffect(() => {
        if (otpFromUrl) {
            const split = otpFromUrl.split("").slice(0, 6);
            setOtpInputs(split);
        }
    }, [otpFromUrl]);

    const handleChange = (value: string, index: number) => {
        const newOtp = [...otpInputs];
        newOtp[index] = value;
        setOtpInputs(newOtp);
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    return (
        <GuestLayout>
            <div className="lg:w-[35%] bg-zinc-900 p-10 rounded flex flex-col gap-8">
                <img src="/src/assets/images/logo.png" alt="logo" className="w-18 mx-auto" />
                <p className="text-center text-xl">Please verify your Email</p>
                <form action="" method="post" className="flex flex-col gap-5">
                    <div className="flex flex-row gap-2 justify-center items-center">
                        {otpInputs.map((_, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={otpInputs[index]}
                                onChange={(e) => handleChange(e.target.value, index)}
                                className="w-10 h-10 border rounded text-white text-center outline-none"
                            />
                        ))}
                    </div>
                    <button type="submit" className="w-full h-12 bg-blue-900 rounded">Verify</button>
                </form>
            </div>
        </GuestLayout>
    )
}

export default OtpVerification