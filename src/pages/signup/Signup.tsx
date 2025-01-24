import imgBB from "@/lib/imgBB";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { forwardRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  logo: FileList;
  avatar?: string;
};

export default function Signup() {
  const dispatch = useAppDispatch();
  const [singup] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Creating account...");
    const logo = await imgBB(data.logo[0] as File);
    data.avatar = logo;

    try {
      const result = await singup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        avatar: data.avatar,
      }).unwrap();
      toast.success("Account created successfully", { id: toastId });
      dispatch(setUser(result.data));
      console.log(result);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred", { id: toastId });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
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
          <div className="flex w-full flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Tyler"
                type="text"
                {...register("firstName", { required: true })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  First name is required
                </p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Durden"
                type="text"
                {...register("lastName", { required: true })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  Last name is required
                </p>
              )}
            </LabelInputContainer>
          </div>
          <div className="h-3"></div>
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
          <LabelInputContainer>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Confirm Password is required
              </p>
            )}
          </LabelInputContainer>
          <div className="h-3"></div>
          <LabelInputContainer>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              {...register("gender", { required: true })}
              className="p-2 border rounded-md"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">Gender is required</p>
            )}
          </LabelInputContainer>
          <div className="h-3"></div>
          <LabelInputContainer>
            <Label htmlFor="logo">User Logo</Label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              {...register("logo", { required: true })}
              onChange={handleLogoChange}
              className="p-2 border rounded-md"
            />
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">User logo is required</p>
            )}
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="mt-2 h-20 w-20 rounded-full object-cover"
              />
            )}
          </LabelInputContainer>
          <div className="h-3"></div>
          <div className="flex space-x-4">
            <button
              className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-300"
              type="submit"
            >
              Sign up &rarr;
            </button>
            <button
              className="bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-medium py-2 px-4 rounded-md shadow-md transition duration-300"
              type="button"
              onClick={() => {
                reset();
                setLogoPreview(null);
              }}
            >
              Reset
            </button>
          </div>
        </form>
      
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </div>
    </div>
  );
}

const LabelInputContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col space-y-1">{children}</div>
);

const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
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
