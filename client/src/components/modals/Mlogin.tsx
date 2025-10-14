'use client';

import React, { useState, useCallback, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateCaptcha = (): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export default function LoginPage(): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState<string>(generateCaptcha());

    const refreshCaptcha = useCallback(() => {
        setCaptcha(generateCaptcha());
    }, []);

    return (
        <div className="flex justify-center items-center bg-black">
            {/* Trigger Button */}
            {/* <div className="flex justify-center items-center h-full"> */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300"
            >
                Login
            </button>
            {/* </div> */}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-md h-screen overflow-y-auto flex flex-col items-center px-6 py-8 text-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            {/* Background Video */}
                            <video
                                className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
                                src="/videos/Mobile_Bg.mp4"
                                autoPlay
                                loop
                                muted
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ff0505] to-[#fc827a59] opacity-90 z-[-1]" />

                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300 transition-colors duration-200"
                            >
                                &times;
                            </button>

                            {/* Avatar */}
                            <div className="w-26 h-26 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/40 shadow-md">
                                <img
                                    src="/images/Mobile_Profile.gif"
                                    alt="User Icon"
                                    className="w-20 h-20 object-contain rounded-full"
                                />
                            </div>

                            {/* Title */}
                            <h2 className="text-white text-xl font-semibold mb-6">
                                Sign in to your Account
                            </h2>

                            {/* Inputs */}
                            <div className="w-full max-w-xs space-y-4 mb-6">
                                <input
                                    type="text"
                                    placeholder="Email / Phone Number"
                                    className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                />

                                {/* CAPTCHA Section */}
                                <div className="w-full">
                                    <div className="flex items-center mb-1">
                                        <div className="flex-1 bg-white/90 rounded-md px-4 py-2 flex justify-between items-center border border-gray-300">
                                            <span className="text-gray-800 font-mono text-lg tracking-widest select-none">
                                                {captcha}
                                            </span>
                                        </div>
                                        <button
                                            onClick={refreshCaptcha}
                                            className="ml-2 p-2 bg-white/90 rounded-md hover:bg-gray-100 transition-colors"
                                            aria-label="Refresh CAPTCHA"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter CAPTCHA"
                                        className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* OTP Input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all pr-24"
                                    />
                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-md hover:bg-orange-600 transition-colors">
                                        Send OTP
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button className="w-full text-xl max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-lg mb-4 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md">
                                Login
                            </button>

                            {/* Forgot Password */}
                            <button className="text-right w-full max-w-xs text-base text-white hover:text-white mb-4 transition-colors">
                                Forgot Password?
                            </button>

                            {/* Sign Up */}
                            <div className="bg-black/60 text-white py-3 px-6 rounded-md text-base w-full max-w-xs">
                                Don't have an account?{' '}
                                <button className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
                                    Sign up
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}



// 'use client';

// import React, { useState, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function LoginPage() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [showOTP, setShowOTP] = useState(false);
//     const [captcha, setCaptcha] = useState(generateCaptcha());

//     const refreshCaptcha = useCallback(() => {
//         setCaptcha(generateCaptcha());
//     }, []);

//     function generateCaptcha() {
//         const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//         let result = '';
//         for (let i = 0; i < 6; i++) {
//             result += chars.charAt(Math.floor(Math.random() * chars.length));
//         }
//         return result;
//     }

//     return (
//         <div className="relative h-screen w-screen overflow-hidden bg-black">
//             {/* Trigger Button */}
//             <div className="flex justify-center items-center h-full">
//                 <button
//                     onClick={() => setIsModalOpen(true)}
//                     className="bg-orange-500 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-300"
//                 >
//                     Login
//                 </button>
//             </div>

//             {/* Modal */}
//             <AnimatePresence>
//                 {isModalOpen && (
//                     <motion.div
//                         className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div
//                             className="relative w-full max-w-md h-screen overflow-y-auto flex flex-col items-center px-6 py-8 text-center"
//                             initial={{ scale: 0.8 }}
//                             animate={{ scale: 1 }}
//                             exit={{ scale: 0.8 }}
//                         >
//                             {/* Background Video */}
//                             <video
//                                 className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
//                                 src="/videos/Mobile_Bg.mp4"
//                                 autoPlay
//                                 loop
//                                 muted
//                             />
//                             {/* Gradient Overlay */}
//                             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ff0505] to-[#fc827a59] opacity-90 z-[-1]" />

//                             {/* Close Button */}
//                             <button
//                                 onClick={() => setIsModalOpen(false)}
//                                 className="absolute top-4 right-4 text-white text-2xl font-bold z-10 hover:text-gray-300 transition-colors duration-200"
//                             >
//                                 &times;
//                             </button>

//                             {/* Avatar */}
//                             <div className="w-26 h-26 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/40     shadow-md">
//                                 <img
//                                     src="/images/Mobile_Profile.gif"
//                                     alt="User Icon"
//                                     className="w-20 h-20 object-contain rounded-full"
//                                 />
//                             </div>

//                             {/* Title */}
//                             <h2 className="text-white text-xl font-semibold mb-6">
//                                 Sign in to your Account
//                             </h2>

//                             {/* Inputs */}
//                             <div className="w-full max-w-xs space-y-4 mb-6">
//                                 <input
//                                     type="text"
//                                     placeholder="Email / Phone Number"
//                                     className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                                 />


//                                 <>
//                                     <input
//                                         type="password"
//                                         placeholder="Password"
//                                         className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                                     />

//                                     {/* CAPTCHA Section */}
//                                     <div className="w-full">
//                                         <div className="flex items-center mb-1">
//                                             <div className="flex-1 bg-white/90 rounded-md px-4 py-2 flex justify-between items-center border border-gray-300">
//                                                 <span className="text-gray-800 font-mono text-lg tracking-widest select-none">
//                                                     {captcha}
//                                                 </span>
//                                             </div>
//                                             <button
//                                                 onClick={refreshCaptcha}
//                                                 className="ml-2 p-2 bg-white/90 rounded-md hover:bg-gray-100 transition-colors"
//                                                 aria-label="Refresh CAPTCHA"
//                                             >
//                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                                                 </svg>
//                                             </button>
//                                         </div>
//                                         <input
//                                             type="text"
//                                             placeholder="Enter CAPTCHA"
//                                             className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                                         />
//                                     </div>
//                                 </>

//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         placeholder="Enter OTP"
//                                         className="w-full px-4 py-3 rounded-lg text-base placeholder-gray-500 bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all pr-24"
//                                     />
//                                     <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-md hover:bg-orange-600 transition-colors">
//                                         Send OTP
//                                     </button>
//                                 </div>



//                             </div>

//                             {/* Login Button */}
//                             <button className="w-full text-xl max-w-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 rounded-lg mb-4 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-md">
//                                 Login
//                             </button>

//                             {/* Forgot Password */}

//                             <button className="text-right w-full max-w-xs text-base text-white hover:text-white mb-4 transition-colors">
//                                 Forgot Password?
//                             </button>

//                             {/* Sign Up */}
//                             <div className="bg-black/60 text-white py-3 px-6 rounded-md text-base w-full max-w-xs">
//                                 Don't have an account?{' '}
//                                 <button className="text-yellow-400 font-medium hover:text-yellow-300 transition-colors">
//                                     Sign up
//                                 </button>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }