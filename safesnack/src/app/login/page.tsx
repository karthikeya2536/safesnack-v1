import { AuthShell } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in — SafeSnack" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" intro="Sign in to track orders and reorder favourites.">
      <AuthForm mode="login" />
    </AuthShell>
  );
}
