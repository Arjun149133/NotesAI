import { AuthForm } from "@/components/auth/AuthForm";
import GoogleAuth from "@/components/auth/GoogleAuth";
import Link from "next/link";

const Signup = () => (
  <div
    className="min-h-screen w-full flex items-center justify-center"
    style={{
      background: "linear-gradient(120deg, #1A1F2C 0%, #2d243e 100%)",
    }}
  >
    <div
      className="bg-glass rounded-2xl shadow-glass px-8 py-8 md:px-12 w-full max-w-md font-inter relative overflow-hidden"
      style={{
        background: "rgba(26,31,44,0.88)",
        boxShadow: "0 8px 30px rgba(46,20,64,0.5)",
        border: "1.5px solid rgba(148,97,255,0.14)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
          Sign up
        </h2>
        <p className="text-gray-400">
          Create your free account to get started.
        </p>
      </div>
      {/* Google sign up */}
      <GoogleAuth />
      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-grow h-px bg-gray-700" />
        <span className="mx-3 text-gray-500 text-sm">or</span>
        <div className="flex-grow h-px bg-gray-700" />
      </div>
      <AuthForm text="Sign Up" />
      <div className="text-center mt-7">
        <span className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#884dff] hover:underline font-medium"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  </div>
);

export default Signup;
