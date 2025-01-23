import { useUsers } from "@/hooks/use-users";
import {
    sendNewPasswordSchema,
    SendNewPasswordSchema,
} from "@/schemas/users/sendNewPasswordSchema";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, SendHorizonal } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "../ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

interface SendNewPasswordFormProps {
    user: User;
}

export const SendNewPasswordForm = ({ user }: SendNewPasswordFormProps) => {
    const {
        onSendNewPassword,
        isSuccessSendNewPassword,
        isLoadingSendNewPasswrod,
        handleGeneratePassword,
        password,
    } = useUsers();

    const form = useForm<SendNewPasswordSchema>({
        resolver: zodResolver(sendNewPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (input: SendNewPasswordSchema) => {
        onSendNewPassword({ email: user.email, ...input });
    };

    useEffect(() => {
        if (isSuccessSendNewPassword) {
            form.reset();
        }
    }, [isSuccessSendNewPassword, form]);

    const { setValue, clearErrors } = form;

    useEffect(() => {
        if (password) {
            setValue("password", password?.password);
            clearErrors("password");
        }
    }, [password, setValue, clearErrors]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-full border-none p-0">
                    <CardHeader>
                        <CardDescription>
                            Genera una nueva constraseña para el usuario y
                            envíala por correo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password">
                                        Generar contraseña
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="password"
                                                placeholder="********"
                                                {...field}
                                            />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                handleGeneratePassword
                                                            }
                                                        >
                                                            <Bot
                                                                className="size-4"
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Generar constraseña
                                                    </TooltipContent>
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
                        <Button
                            variant="secondary"
                            disabled={isLoadingSendNewPasswrod}
                        >
                            {isLoadingSendNewPasswrod ? (
                                "Enviando..."
                            ) : (
                                <span className="flex gap-2">
                                    Enviar <SendHorizonal />
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};
