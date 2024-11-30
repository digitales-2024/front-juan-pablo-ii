"use client";

import trazoProfile from "@/assets/images/trazo_profile.webp";
import { useProfile } from "@/hooks/use-profile";
import { KeyRound, User } from "lucide-react";
import Image from "next/image";

import { AccountComponent } from "@/components/account/accountUpdate";
import { PasswordComponent } from "@/components/account/passwordUpdate";
import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Account() {
    const { user } = useProfile();
    const userName = user?.name ?? "";
    const initials = userName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("");

    return (
        <Shell className="gap-2">
            <HeaderPage
                title="Mi cuenta"
                description="Configura la información de tu cuenta"
            />

            <div className="flex justify-evenly py-8">
                <div className="hidden px-4 py-12 xl:block">
                    <div className="group relative hidden lg:block">
                        <Image
                            className="inline-block rounded-full transition-all group-hover:blur-[1px] group-hover:brightness-75"
                            width={320}
                            src={trazoProfile}
                            alt="Perfil"
                        />
                        <div className="absolute left-0 top-0 flex h-full w-full cursor-default items-center justify-center text-5xl font-black uppercase tracking-widest text-white">
                            {initials}
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <Tabs
                        defaultValue="account"
                        className="w-full md:w-[600px]"
                    >
                        <TabsList className="grid w-full grid-cols-2 text-lg">
                            <TabsTrigger value="account">
                                <User className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="truncate text-ellipsis">
                                    Cuenta
                                </span>
                            </TabsTrigger>
                            <TabsTrigger value="password">
                                <KeyRound className="mr-2 h-4 w-4 flex-shrink-0" />
                                <span className="truncate text-ellipsis">
                                    Contraseña
                                </span>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <AccountComponent />
                        </TabsContent>

                        <TabsContent value="password">
                            <PasswordComponent />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Shell>
    );
}
