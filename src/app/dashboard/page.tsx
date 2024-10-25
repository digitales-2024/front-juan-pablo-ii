"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutDialog } from "@/components/user/LogoutDialog";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <Card className="bg-black bg-opacity-50 text-white shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Bienvenido(a) a Juan Pablo II
            </CardTitle>
            <LogoutDialog /> {/* Botón de cerrar sesión */}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
