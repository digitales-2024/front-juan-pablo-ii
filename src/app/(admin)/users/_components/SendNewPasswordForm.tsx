
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SendNewPasswordDto, sendNewPasswordSchema, UserResponseDto } from "../types";
import { useUsers } from "../_hooks/useUsers";
import { generatePassword } from "../utils";

interface SendNewPasswordFormProps {
  user: UserResponseDto;
}

export const SendNewPasswordForm = ({ user }: SendNewPasswordFormProps) => {

const {sendNewPassword, isLoadingSendNewPassword} = useUsers()

  const form = useForm<SendNewPasswordDto>({
    resolver: zodResolver(sendNewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (input: SendNewPasswordDto) => {
    sendNewPassword({ email: user.email, password:input.password });
  };

  const handleGeneratePassword = () => {
	form.setValue("password", generatePassword());
};
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full border-none p-0">
          <CardHeader>
            <CardDescription>
              Genera una nueva constraseña para el usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Generar contraseña</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input id="password" placeholder="********" {...field} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGeneratePassword}
                            >
                              <Bot className="size-4" aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Generar constraseña</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-end">
            <Button variant="secondary" disabled={isLoadingSendNewPassword}>
              {isLoadingSendNewPassword ? (
                "Enviando..."
              ) : (
                <span className="flex gap-2">
                  Actualizar Contraseña <SendHorizonal />
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};