import Lottie from "lottie-react";
import { useContext } from "react";
import { BiEnvelope, BiKey } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import Title from "../components/Title";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import loginAnimation from "../assets/loginAnimation.json";
import PageTitle from "../components/PageTitle";

const Login = () => {
  const { signIn, googleSignIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect path (default to "/")
  const from = location?.state || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const pass = form.pass.value;

    signIn(email, pass)
      .then(() => {
        Swal.fire({
          title: "Welcome Back!",
          text: "You have successfully logged in.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Login Failed", "Invalid email or password.", "error");
      });
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then(() => {
        Swal.fire({
          title: "Welcome!",
          text: "You have successfully signed in with Google.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire(
          "Google Sign-in Failed",
          "We couldn't complete your Google login. Please try again.",
          "error"
        );
      });
  };

  return (
    <div className="bg-background min-h-screen py-12 sm:py-20">
      <PageTitle title={"Login"} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Login to continue your life-saving journey
          </p>
        </div>

        <div className="flex justify-between items-center gap-8 lg:gap-12 flex-col lg:flex-row">
          <div className="flex-1 w-full max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="glass p-6 sm:p-8 lg:p-10 flex flex-col gap-6 shadow-2xl rounded-2xl border border-rose-200"
            >
              {/* Email */}
              <div className="flex justify-start items-center gap-2">
                <BiEnvelope className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                <input
                  className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted transition-all duration-200 border-border text-text text-sm sm:text-base"
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-start items-center gap-2">
                  <BiKey className="text-2xl sm:text-3xl text-highlighted flex-shrink-0" />
                  <input
                    className="outline-none flex-1 border-b p-2 bg-transparent focus:border-highlighted transition-all duration-200 border-border text-text text-sm sm:text-base"
                    type="password"
                    name="pass"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <p className="text-end text-xs sm:text-sm text-highlighted cursor-pointer hover:underline">
                  Forgot password?
                </p>
              </div>

              {/* Register link */}
              <div className="p-1 flex gap-2 text-xs sm:text-sm text-text opacity-80">
                <span>Don't have an account?</span>
                <Link
                  to="/registration"
                  className="text-highlighted hover:underline font-medium"
                >
                  Register
                </Link>
              </div>
              {/* Google login */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 sm:py-3 text-sm sm:text-base font-medium text-text bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <FcGoogle className="text-xl" />
                  <span>Continue with Google</span>
                </button>
              </div>
              {/* Submit */}
              <input
                type="submit"
                value="Login Now"
                className="cursor-pointer px-4 py-2.5 sm:py-3 rounded-lg bg-cta text-btn-text font-semibold text-sm sm:text-base hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              />
            </form>
          </div>

          {/* Animation */}
          <div className="lottie flex-1 w-full max-w-md lg:max-w-lg mx-auto">
            <Lottie animationData={loginAnimation} loop={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
