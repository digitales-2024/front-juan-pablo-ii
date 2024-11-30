import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState, forwardRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const InputPassword = forwardRef<
    HTMLInputElement,
    React.ComponentPropsWithoutRef<"input">
>((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className="hide-password-toggle pr-10"
                {...props}
                ref={ref} // Pasa el ref aquí
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                )}
            </Button>
        </div>
    );
});

InputPassword.displayName = "InputPassword";
