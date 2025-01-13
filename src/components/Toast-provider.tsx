"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      closeButton
      expand={false}
      duration={3000}
      theme="light"
      position="top-center"
      toastOptions={{
        className: "group",
        classNames: {
          toast: "group rounded-lg border bg-background text-foreground",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          closeButton: "text-foreground/50 hover:text-foreground",
        },
      }}
    />
  );
}