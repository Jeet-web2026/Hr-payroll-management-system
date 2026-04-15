import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GuestLayout } from "@/comon/guestLayout"
import { Link } from "react-router-dom"
import { useState } from "react"
import { toast } from "sonner"
import apiService from "@/comon/api/apiService"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: ""
  });

  const [isPending, setIsPending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signupFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstName, lastName, email, password, confirmpassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmpassword) {
      toast.error("All fields are required", { position: "top-right", richColors: true });
      return;
    }

    if (password !== confirmpassword) {
      toast.error("Passwords do not match", { position: "top-right", richColors: true });
      return;
    }

    setIsPending(true)
    try {
      const res = await apiService.post('/auth/signup', formData);
      toast.success(res.data?.message, { position: "top-right", richColors: true });
    } catch (error: Array<any> | any) {
      setIsPending(false);
      let responseStatus = error.response?.data.success;

      if (responseStatus === false) {
        let errorMessages = error.response?.data.message;

        if (errorMessages && Array.isArray(errorMessages)) {
          errorMessages.forEach((element: string, index: number) => {
            setTimeout(() => {
              toast.error(element, {
                position: "top-right",
                richColors: true,
              });
            }, index * 800);
          });
        }

        toast.error(error.response?.data.message, {
          position: "top-right",
          richColors: true,
        });
      }
    } finally {
      setIsPending(false);
    }
  }


  return (
    <GuestLayout>
      <div className={cn("flex flex-col gap-6 p-5", className)} {...props}>
        <Card className="p-3">
          <CardHeader className="text-center my-5">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={signupFormSubmission}>
              <FieldGroup>
                <Field className="flex flex-col lg:flex-row gap-3">
                  <Field>
                    <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                    <Input id="first-name" type="text" placeholder="e.g. John" name="firstName" onChange={handleChange} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                    <Input id="last-name" type="text" placeholder="e.g. Doe" name="lastName" onChange={handleChange} />
                  </Field>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. m@example.com"
                    name="email"
                    onChange={handleChange}
                  />
                </Field>
                <Field>
                  <Field className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input id="password" type="password" name="password" onChange={handleChange} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                      </FieldLabel>
                      <Input id="confirm-password" type="password" name="confirmpassword" onChange={handleChange} />
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <i className="ri-loader-2-line animate-spin text-lg me-1"></i>
                        Creating...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link to="/">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
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
