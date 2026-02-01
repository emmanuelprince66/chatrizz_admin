import heroPattern from "@/assets/hero_pattern.png";
import loginLogo from "@/assets/login_one.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLoginHook } from "@/hooks/useLoginHook";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const { form, onSubmit, isSubmitting } = useLoginHook();

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#02141c]">
      {/* Background Block Puzzle Game Style - Covering the screen with random block/snake shapes */}
      <div className="absolute w-full h-full">
        <img
          src={heroPattern}
          alt="Background Pattern"
          height={1000}
          width={2000}
          className="object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 h-full z-10 mx-auto flex items-center flex-col justify-center p-6 lg:p-12">
        <div className="w-full md:max-w-[65%] flex justify-center gap-4 flex-col justify-center z-100">
          {/* Logo */}
          <div className="mb-1 flex items-center gap-2 w-full justify-center mx-auto">
            <img
              src={loginLogo}
              alt="Logo"
              width={40}
              height={40}
              className="object-cover"
            />
            <h1 className="text-2xl font-normal text-white mb-2">Chatrizz</h1>
          </div>

          <h5 className="text-white text-lg font-[500] text-center">
            Welcome Back!
          </h5>
          <h6 className="text-white text-lg font-normal text-center">Login</h6>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <h6 className="text-sm text-white font-medium uppercase tracking-wider">
                      Email
                    </h6>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-orange-500 focus:ring-0 transition-colors"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <h6 className="text-sm font-medium text-white uppercase tracking-wider">
                      Password
                    </h6>
                    <FormControl>
                      <Input
                        type="password"
                        showPasswordToggle
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-orange-500 focus:ring-0 transition-colors"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-6 space-y-4 text-center w-full justify-start flex">
                <Link to="/forget-password">
                  <h6 className="text-sm text-white hover:text-white/700 transition-colors">
                    Forget Password
                  </h6>
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-white cursor-pointer font-medium rounded-full transition-colors uppercase tracking-wider h-[48px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner className=" w-7 h-7" color="white" />
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>

          {/* Additional Links */}
        </div>

        {/* Verify OTP Modal - Uncomment and implement when needed */}
        {/* <CustomModal
          isOpen={showOtpModal}
          onClose={closeOtpPhoneModal}
          trigger={true}
          title="Verify OTP"
          description="Enter the 6-digit code sent to your email"
        >
          <div className="grid gap-4 py-4">
            <OtpInput
              value={otp}
              onChange={(value) => setOtp(value)}
              length={6}
            />

            <div className="flex w-full flex-col items-start mt-4">
              <p className="text-sm text-gray-600 mb-2">Enter Phone Number</p>
              <PhoneInput
                international
                defaultCountry="NG"
                value={verifyOtpPhone}
                onChange={(value) => setVerifyOtpPhone(value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-full focus:border-orange-500 focus:ring-0 transition-colors"
              />
              <p className="text-[10px] text-yellow-600 mt-1 mb-2">
                Please enter the phone number you used in signing up.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button className="w-full h-[48px]">
                {false ? <Spinner /> : "Verify OTP"}
              </Button>

              <Button variant="outline" className="w-full h-[48px]">
                Resend OTP
              </Button>
            </div>
          </div>
        </CustomModal> */}
        {/* verify otp modal end */}
      </div>
    </div>
  );
};

export default LoginForm;
