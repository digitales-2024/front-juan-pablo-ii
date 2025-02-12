import React from "react";
import { FormDescription } from "../form";
import { REQUIRED_MESSAGE } from "@/types/statics/forms";

interface CustomFormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  required?: boolean;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}
export function CustomFormDescription({
  className,
  required,
  description,
  children,
  ...props
}: CustomFormDescriptionProps) {
  return (
    <>
      {(required ?? description) && (
        <FormDescription className={className} {...props}>
          {required && <span className="block">{REQUIRED_MESSAGE}</span>}
          {description && <span className="block">{description}</span>}
        </FormDescription>
      )}
      {(!required && children) && <FormDescription className={className} {...props}>{children}
        </FormDescription>}
      {
        (required && children) && <FormDescription className={className} {...props}>
          {children}
          <span className="block">{REQUIRED_MESSAGE}</span>
        </FormDescription>
      }
      {/* {children&&children} */}
    </>
  );
}
