import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { forwardRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading("Loading...");

    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();
      toast.success("Login successfully", { id: toastId });
      dispatch(setUser(result.data));
      console.log(result);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred", { id: toastId });
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="w-full max-w-md">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Heart Vibrate
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to Heart Vibrate if you can because we don&apos;t have a login
          flow yet
        </p>
        <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </LabelInputContainer>
          <div className="h-3"></div>
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </LabelInputContainer>
          <div className="h-3"></div>
          <div className="flex space-x-4">
            <button
              className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-300"
              type="submit"
            >
              Login &rarr;
            </button>
            <button
              className="bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-300"
              type="button"
              onClick={() => {
                reset();
              }}
            >
              Reset
            </button>
          </div>
        </form>
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500">
          Login
        </Link>
      </div>
    </div>
  );
}

const LabelInputContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="flex flex-col space-y-1">{children}</div>;

const Label = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    {children}
  </label>
);

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className={`p-2 border rounded-md ${props.className}`}
  />
));
