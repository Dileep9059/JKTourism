import useAuth from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import useToggle from "../../hooks/useToggle";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect, type FormEvent } from "react";
import axios, { setupAxiosPrivate } from "../../axios/axios";
import { d, e } from "../utils/crypto";
import type { AuthType } from "../../context/AuthProvider";
import { toast } from "sonner";
import DocumentTitle from "../DocumentTitle";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const roleRedirectMap: Record<string, string> = {
  ROLE_MASTER_ADMIN: "/masterAdmin",
  ROLE_SUPER_ADMIN: "/superAdmin",
  ROLE_ADMIN: "/dashboard",
  ROLE_HOTEL: "/hotel/dashboard",
};

const LOGIN_URL = "/api/auth/signin";

const Login = () => {
  const userRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef(null);

  const { auth, setAuth } = useAuth() as { auth: AuthType; setAuth: React.Dispatch<React.SetStateAction<AuthType>> };
  const [step, setStep] = useState<"credentials" | "otp" | "captcha">("credentials");
  const navigate = useNavigate();

  const [user, resetUser, userAttributes] = useInput("user", "");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);

  const [captchaId, setCaptchaId] = useState(null);
  const [captchaImage, setCaptchaImage] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [otp, setOtp] = useState("");

  const [resendTimer, setResendTimer] = useState(60); // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false);

  const verifyCredentials = async () => {
    try {
      const encrypted = await e(JSON.stringify({ username: user, password }));
      await axios.post("/api/auth/verify-credentials", encrypted, {
        headers: { "Content-Type": "text/plain" }
      });
      // ✅ Only if successful, load CAPTCHA image
      fetchCaptcha();
    } catch (err) {
      toast.error("Invalid username or password.");
    }
  };

  const fetchCaptcha = async () => {
    try {
      const response = await axios.get("/api/auth/captcha", {
        responseType: "blob",
      });

      const captchaIdFromHeader = response.headers["captcha-id"];
      setCaptchaId(captchaIdFromHeader);

      const imageUrl = URL.createObjectURL(response.data);
      setCaptchaImage(imageUrl);

      setStep("captcha");
    } catch (err) {
      toast.error("Could not load CAPTCHA");
    }
  };

  const handleCredentialSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await verifyCredentials();
  };

  const handleCaptchaSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const encrypted = await e(JSON.stringify({ username: user, password, captcha: captchaInput, captchaId }));
      await axios.post("/api/auth/verify-captcha", encrypted, { headers: { "Content-Type": "text/plain" } });
      toast.success("CAPTCHA verified. OTP sent.");
      setStep("otp");
      setResendTimer(60); // restart countdown
      setCanResend(false);
    } catch (err) {
      toast.error("Invalid CAPTCHA. Try again.");
      await fetchCaptcha();
    }
  };

  const handleResendOtp = async () => {
    try {
      const encrypted = await e(JSON.stringify({ username: user }));
      await axios.post("/api/auth/resend-otp", encrypted, {
        headers: { "Content-Type": "text/plain" },
      });
      toast.success("OTP resent to your email");
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  const handleOtpSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const encrypted = await e(JSON.stringify({ username: user, password, otp }));
      const res = await axios.post(LOGIN_URL, encrypted, {
        headers: { "Content-Type": "text/plain" },
        withCredentials: true,
      });
      const response = JSON.parse(await d(res.data));
      setAuth({ user: response.username, accessToken: response.accessToken, roles: response.roles, email: response.email, name: response.name, mobile: response.mobile, profileImage: response.profileImage });
      resetUser("");
      setPassword("");
      toast.success("Login successful");

      setupAxiosPrivate(response.accessToken);

      // 🔁 Redirect based on role
      const roles: string[] = response?.roles || [];
      const matchedRole = roles.find((r: string) => roleRedirectMap[r]);
      const destination = matchedRole ? roleRedirectMap[matchedRole] : "/unauthorized";
      navigate(destination, { replace: true });

    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  useEffect(() => {
    const roles: string[] = auth?.roles || [];
    if (roles.length !== 0) {
      const matchedRole = roles.find((r: string) => roleRedirectMap[r]);
      const destination = matchedRole ? roleRedirectMap[matchedRole] : "/unauthorized";
      navigate(destination, { replace: true });
    }
  }, [auth?.roles, navigate]);

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg("");
  }, [user, password]);

  useEffect(() => {
    if (step === "otp" && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (resendTimer === 0) {
      setCanResend(true); // enable the resend button
    }
  }, [step, resendTimer]);


  const autoOtpSubmissionRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (otp.length === 6) {
      autoOtpSubmissionRef.current?.requestSubmit();
    }
  }, [otp]);

  return (
    <>
      <DocumentTitle title="Login" />
      <div className='container grid max-w-none items-center justify-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <Card className='gap-4'>
            <CardHeader>
              <CardTitle className='text-lg tracking-tight'>Login</CardTitle>
              <CardDescription>
                Enter your email and password below to <br />
                log into your account
              </CardDescription>
            </CardHeader>
            <CardContent>


              {errorMsg && (
                <p ref={errorRef} className="bg-red-700 text-white font-semibold py-2 px-4 mb-4 rounded-md" aria-live="assertive">{errorMsg}</p>
              )}

              {step === "credentials" && (
                <form onSubmit={handleCredentialSubmit}>
                  <input type="text" ref={userRef} placeholder="Username" {...userAttributes} autoComplete="off" required className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md text-black dark:text-white" />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md text-black dark:text-white" />
                  <button type="submit" className="w-full py-2 text-white font-bold rounded-md bg-green-600 hover:bg-green-700">Next</button>
                </form>
              )}

              {step === "captcha" && (
                <form onSubmit={handleCaptchaSubmit}>
                  {captchaImage && (
                    <img src={captchaImage} alt="CAPTCHA" className="w-full h-auto rounded mb-2 p-4 bg-line-pattern dark:bg-white" />
                  )}


                  <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter CAPTCHA" required className="w-full px-3 py-2 border text-black dark:text-white border-gray-300 rounded-md mb-3" />
                  <button type="submit" className="w-full py-2 text-white font-bold rounded-md bg-blue-600 hover:bg-blue-700">Verify CAPTCHA</button>
                </form>
              )}

              {step === "otp" && (
                <form ref={autoOtpSubmissionRef} onSubmit={handleOtpSubmit} className="w-full">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                    containerClassName="w-full py-2 mb-2"
                  >
                    <InputOTPGroup className="w-full flex justify-between">
                      <InputOTPSlot index={0} className="flex-1 text-center" inputMode="numeric" />
                      <InputOTPSlot index={1} className="flex-1 text-center" inputMode="numeric" />
                      <InputOTPSlot index={2} className="flex-1 text-center" inputMode="numeric" />
                    </InputOTPGroup>
                    <InputOTPSeparator className="my-2" />
                    <InputOTPGroup className="w-full flex justify-between">
                      <InputOTPSlot index={3} className="flex-1 text-center" inputMode="numeric" />
                      <InputOTPSlot index={4} className="flex-1 text-center" inputMode="numeric" />
                      <InputOTPSlot index={5} className="flex-1 text-center" inputMode="numeric" />
                    </InputOTPGroup>
                  </InputOTP>

                  <button
                    type="submit"
                    className="w-full py-2 text-white font-bold rounded-md bg-purple-600 hover:bg-purple-700"
                    disabled={otp.length !== 6}
                  >
                    Verify OTP & Login
                  </button>

                  <div className="text-sm text-black mt-2 dark:text-white">
                    {!canResend ? (
                      <p>Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="mt-2 text-blue-400 hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}

            </CardContent>
            <CardFooter>
              <p className='text-muted-foreground px-8 text-center text-sm'>
                By clicking login, you agree to our{' '}
                <a
                  href='/terms'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='/privacy'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
