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
import { Link } from "react-router-dom"
import { SOCIAL_PROVIDERS } from "@/config/socialAuth"

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  type SocialProvider = keyof typeof SOCIAL_PROVIDERS;
  function socialLogin(loginType: SocialProvider) {
    const provider = SOCIAL_PROVIDERS[loginType];
    window.location.href = provider.url;
  }


  return (
    <GuestLayout>
      <div className={cn("flex flex-col gap-6 lg:w-3/5 px-8", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Login your account</h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <Field className="flex flex-col gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input id="password" type="password" required />
                    </Field>
                  </Field>
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit">Login Account</Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
                <Field className="grid grid-cols-3 gap-4">
                  <Button onClick={() => socialLogin("google")} variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-google-line text-xl"></i>
                    <span className="sr-only">Sign up with Google</span>
                  </Button>
                  <Button variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-linkedin-line text-xl"></i>
                    <span className="sr-only">Sign up with linkedin</span>
                  </Button>
                  <Button variant="outline" type="button" className="cursor-pointer">
                    <i className="ri-facebook-line text-xl"></i>
                    <span className="sr-only">Sign up with facebook</span>
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Dont have an account? <Link to="/auth/signup">Sign up</Link>
                </FieldDescription>
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
