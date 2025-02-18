import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Heart,
  Briefcase,
  AlertCircle,
  Building2,
  UserCheck,
  Stethoscope,
  Languages,
  ScrollText,
 IdCard,
} from "lucide-react"
import type { Patient } from "../_interfaces/types"

interface PatientBasicInfoProps {
  paciente: Patient
}

export function PatientBasicInfo({ paciente }: PatientBasicInfoProps) {
  //console .log("paciente en el componente de datos basicos de historia ", paciente);
  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 md:col-span-3">
            <Card className="h-full flex flex-col border-t-4 border-t-primary">
              <CardContent className="p-6 text-center flex-grow flex flex-col justify-center">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                  <AvatarImage src={paciente.patientPhoto} alt={`${paciente.name} ${paciente.lastName}`} />
                  <AvatarFallback>
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl sm:text-2xl font-semibold">{`${paciente.name} ${paciente.lastName}`}</h2>
                <div className="flex items-center justify-center mt-2">
                  <IdCard className="w-5 h-5 text-primary mr-2" />
                  <p className="text-muted-foreground">{paciente.dni}</p>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="bg-green-500 text-black">
                    Paciente
                  </Badge>
                  <Badge variant="secondary">
                    <Heart className="w-4 h-4 mr-1" />
                    {paciente.bloodType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-9">
            <Tabs defaultValue="medical" className="w-full">
              <div className="flex flex-col md:flex-row">
                <TabsList className="w-full flex flex-col md:flex-row justify-start mb-4 gap-2 h-fit">
                  <TabsTrigger value="medical" className="w-full md:w-auto">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Información Médica
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="w-full md:w-auto">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Información Personal
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="w-full md:w-auto">
                    <Phone className="w-4 h-4 mr-2" />
                    Contacto
                  </TabsTrigger>
                </TabsList>
              </div>
          
              <div className="mt-4 md:mt-0">
                <TabsContent value="medical">
                  <Card className="h-full min-h-[300px] border-t-4 border-t-primary">
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Seguro de Salud</label>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.healthInsurance}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Médico de cabecera</label>
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.primaryDoctor}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Notas Médicas</label>
                          <div className="flex items-start space-x-2 mt-1">
                            <ScrollText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="font-medium">{paciente.notes}</span>
                          </div>
                        </div>
                      </div>
                    
                    </CardContent>
                  </Card>
                </TabsContent>
          
                <TabsContent value="personal">
                  <Card className="h-full min-h-[300px] border-t-4 border-t-primary">
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.birthDate}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Género</label>
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.gender}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Estado Civil</label>
                          <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.maritalStatus}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Idioma</label>
                          <div className="flex items-center space-x-2">
                            <Languages className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.language}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Ocupación</label>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.occupation}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Lugar de Trabajo</label>
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.workplace}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
          
                <TabsContent value="contact">
                  <Card className="h-full min-h-[300px] border-t-4 border-t-primary">
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Celular</label>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.phone}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.email}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.address}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Contacto de Emergencia</label>
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.emergencyContact}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-muted-foreground">Teléfono de Emergencia</label>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-5 h-5 text-primary" />
                            <span className="font-medium">{paciente.emergencyPhone}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}