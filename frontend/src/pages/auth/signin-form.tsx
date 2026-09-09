import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GuestLayout } from "@/comon/guestLayout"
import logo from "@/assets/images/logo.png"
import { useNavigate } from "react-router-dom"
import { SOCIAL_PROVIDERS } from "@/config/socialAuth"
import { useEffect, useState } from "react"
import { ResponseHandler } from "@/comon/api/responseHandler"
import apiService from "@/comon/api/apiService"
import { TokenService } from "@/comon/api/tokenService"

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = TokenService.get();

    if (token) {
      navigate('/dashboard');
    }
  }, []);

  type SocialProvider = keyof typeof SOCIAL_PROVIDERS;
  function socialLogin(loginType: SocialProvider) {
    const provider = SOCIAL_PROVIDERS[loginType];
    window.location.href = provider.url;
  }

  const initialFormData = {
    email: "",
    password: ""
  };

  type FormErrors = {
    email?: string[];
    password?: string[];
    general?: string[];
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signinFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setErrors({
        general: ['All fields are required']
      })
      return;
    }

    setIsPending(true)
    try {
      const res = await apiService.post('/auth/signin', formData);
      ResponseHandler(res);
      TokenService.set(res.data.data.accessToken);
      setFormData(initialFormData);

      if (res.data?.data?.role === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/role/selection");
      }
    } catch (error: any) {
      if (error.response?.data?.statusCode === 400) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message });
      }
    } finally {
      formData.password = '';
      setIsPending(false);
    }

  }


  return (
    <GuestLayout>
      <div className={cn("flex flex-col gap-6 lg:w-3/5 px-8", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={signinFormSubmission}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Login your account</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                  </p>
                </div>
                {
                  errors.general && (
                    <p className="text-sm text-destructive border bg-red-950 p-2 rounded-md text-center">
                      <i className="ri-error-warning-line me-2 text-base"></i>
                      {errors.general}
                    </p>
                  )
                }
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email[0]}
                    </p>
                  )}
                </Field>
                <Field>
                  <Field className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input id="password" type="password" name="password" onChange={handleChange} value={formData.password} />
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password[0]}
                        </p>
                      )}
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={isPending} className="cursor-pointer">
                    {isPending ? (
                      <>
                        <i className="ri-loader-2-line animate-spin text-lg me-1"></i>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="ri-lock-2-line text-base me-1"></i>
                        Login Account
                      </>
                    )}
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <Field className="grid grid-cols-3 gap-4">
                  <Button onClick={() => socialLogin("google")} variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-google-line text-xl"></i>
                    <span className="sr-only">Sign up with Google</span>
                  </Button>
                  <Button onClick={() => socialLogin("linkedin")} variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-linkedin-line text-xl"></i>
                    <span className="sr-only">Sign up with linkedin</span>
                  </Button>
                  <Button onClick={() => socialLogin("facebook")} variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-facebook-line text-xl"></i>
                    <span className="sr-only">Sign up with facebook</span>
                  </Button>
                </Field>
              </FieldGroup>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={logo}
                alt="Image"
                className="absolute top-30 left-15 h-1/2 w-2/3 dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </GuestLayout>
  )
}
