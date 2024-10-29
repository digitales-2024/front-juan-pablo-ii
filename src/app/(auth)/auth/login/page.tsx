// pages/login.tsx
"use client";

import { LoginForm } from "@/components/login/LoginForm";
import { Providers } from "@/redux/providers";

export default function LoginPage() {
  return (
    <Providers>
      <LoginForm onSuccess={() => {
      }} />
    </Providers>
  );
}
