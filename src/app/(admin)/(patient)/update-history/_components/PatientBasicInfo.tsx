import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Heart,
  Briefcase,
  Globe,
  Clipboard,
} from "lucide-react";
import type { Patient } from "../types";

interface PatientBasicInfoProps {
  paciente: Patient;
}

export function PatientBasicInfo({ paciente }: PatientBasicInfoProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Historia Médica</CardTitle>
        <Avatar className="w-32 h-32 mx-auto mt-4">
          <AvatarImage
            src={paciente.patientPhoto}
            alt={`${paciente.name} ${paciente.lastName}`}
          />
          <AvatarFallback>
            <User className="w-16 h-16" />
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span>{`${paciente.name} ${paciente.lastName}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <span>{paciente.dni}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>{paciente.birthDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-gray-500" />
          <span>{paciente.gender}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span>{paciente.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <span>{paciente.email}</span>
        </div>
        <div className="flex items-center space-x-2 col-span-2 md:col-span-1">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span>{paciente.address}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span>{`Contacto de emergencia: ${paciente.emergencyContact}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-500" />
          <span>{`Teléfono de emergencia: ${paciente.emergencyPhone}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clipboard className="w-5 h-5 text-gray-500" />
          <span>{`Seguro de salud: ${paciente.healthInsurance}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clipboard className="w-5 h-5 text-gray-500" />
          <span>{`Estado civil: ${paciente.maritalStatus}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span>{`Ocupación: ${paciente.occupation}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span>{`Lugar de trabajo: ${paciente.workplace}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-gray-500" />
          <span>{`Tipo de sangre: ${paciente.bloodType}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-500" />
          <span>{`Médico primario: ${paciente.primaryDoctor}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <span>{`Idioma: ${paciente.language}`}</span>
        </div>
        <div className="flex items-center space-x-2 col-span-2">
          <Clipboard className="w-5 h-5 text-gray-500" />
          <span>{`Notas: ${paciente.notes}`}</span>
        </div>
      </CardContent>
    </Card>
  );
}
