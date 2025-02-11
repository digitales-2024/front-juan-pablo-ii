import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, FileText } from "lucide-react";
import type { Paciente } from "../types";

interface PatientBasicInfoProps {
  paciente: Paciente;
}

export function PatientBasicInfo({ paciente }: PatientBasicInfoProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Historia Médica</CardTitle>
        <Avatar className="w-32 h-32 mx-auto mt-4">
          <AvatarImage
            src={paciente.foto}
            alt={`${paciente.nombre} ${paciente.apellido}`}
          />
          <AvatarFallback>
            <User className="w-16 h-16" />
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span>{`${paciente.nombre} ${paciente.apellido}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <span>{paciente.dni}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span>{paciente.telefono}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <span>{paciente.correo}</span>
        </div>
        <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span>{paciente.direccion}</span>
        </div>
      </CardContent>
    </Card>
  );
}