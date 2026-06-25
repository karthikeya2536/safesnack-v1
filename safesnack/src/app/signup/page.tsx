import { AuthShell } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create account — SafeSnack" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" intro="Join for faster checkout, order tracking, and rewards.">
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
