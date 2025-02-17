'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Heart, Globe, FileText, UserPlus, PhoneIcon } from 'lucide-react'

interface RegistroPacienteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RegistroPacienteModal({ isOpen, onClose }: RegistroPacienteModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    cumpleanos: '',
    sexo: '',
    direccion: '',
    telefono: '',
    correo: '',
    fechaRegistro: new Date().toISOString().split('T')[0],
    alergias: '',
    medicamentosActuales: '',
    contactoEmergencia: '',
    telefonoEmergencia: '',
    seguroMedico: '',
    estadoCivil: '',
    ocupacion: '',
    lugarTrabajo: '',
    tipoSangre: '',
    antecedentesFamiliares: '',
    habitosVida: '',
    vacunas: '{}',
    medicoCabecera: '',
    idioma: '',
    autorizacionTratamiento: '',
    observaciones: '',
    fotografiaPaciente: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, fotografiaPaciente: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // Aquí iría la lógica para enviar los datos al servidor
    onClose()
  }

  const InputWithIcon = ({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        {icon}
      </div>
      <Input className="pl-10" {...props} />
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Registrar Nuevo Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={formData.fotografiaPaciente} />
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <InputWithIcon icon={<User className="w-4 h-4" />} id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <InputWithIcon icon={<User className="w-4 h-4" />} id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="dni">DNI</Label>
              <InputWithIcon icon={<FileText className="w-4 h-4" />} id="dni" name="dni" value={formData.dni} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="cumpleanos">Fecha de Nacimiento</Label>
              <InputWithIcon icon={<Calendar className="w-4 h-4" />} id="cumpleanos" name="cumpleanos" type="date" value={formData.cumpleanos} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select name="sexo" value={formData.sexo} onValueChange={(value) => handleSelectChange('sexo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <InputWithIcon icon={<MapPin className="w-4 h-4" />} id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <InputWithIcon icon={<Phone className="w-4 h-4" />} id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="correo">Correo Electrónico</Label>
              <InputWithIcon icon={<Mail className="w-4 h-4" />} id="correo" name="correo" type="email" value={formData.correo} onChange={handleInputChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="alergias">Alergias</Label>
            <Textarea id="alergias" name="alergias" value={formData.alergias} onChange={handleInputChange} placeholder="Describa las alergias del paciente..." className="min-h-[100px]" />
          </div>
          
          <div>
            <Label htmlFor="medicamentosActuales">Medicamentos Actuales</Label>
            <Textarea id="medicamentosActuales" name="medicamentosActuales" value={formData.medicamentosActuales} onChange={handleInputChange} placeholder="Liste los medicamentos actuales..." className="min-h-[100px]" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactoEmergencia">Contacto de Emergencia</Label>
              <InputWithIcon icon={<UserPlus className="w-4 h-4" />} id="contactoEmergencia" name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="telefonoEmergencia">Teléfono de Emergencia</Label>
              <InputWithIcon icon={<PhoneIcon className="w-4 h-4" />} id="telefonoEmergencia" name="telefonoEmergencia" value={formData.telefonoEmergencia} onChange={handleInputChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seguroMedico">Seguro Médico</Label>
              <InputWithIcon icon={<Heart className="w-4 h-4" />} id="seguroMedico" name="seguroMedico" value={formData.seguroMedico} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select name="estadoCivil" value={formData.estadoCivil} onValueChange={(value) => handleSelectChange('estadoCivil', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soltero">Soltero/a</SelectItem>
                  <SelectItem value="casado">Casado/a</SelectItem>
                  <SelectItem value="divorciado">Divorciado/a</SelectItem>
                  <SelectItem value="viudo">Viudo/a</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ocupacion">Ocupación</Label>
              <InputWithIcon icon={<Briefcase className="w-4 h-4" />} id="ocupacion" name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="lugarTrabajo">Lugar de Trabajo</Label>
              <InputWithIcon icon={<MapPin className="w-4 h-4" />} id="lugarTrabajo" name="lugarTrabajo" value={formData.lugarTrabajo} onChange={handleInputChange} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tipoSangre">Tipo de Sangre</Label>
            <Select name="tipoSangre" value={formData.tipoSangre} onValueChange={(value) => handleSelectChange('tipoSangre', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de sangre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="antecedentesFamiliares">Antecedentes Familiares</Label>
            <Textarea id="antecedentesFamiliares" name="antecedentesFamiliares" value={formData.antecedentesFamiliares} onChange={handleInputChange} placeholder="Describa los antecedentes familiares relevantes..." className="min-h-[100px]" />
          </div>
          
          <div>
            <Label htmlFor="habitosVida">Hábitos de Vida</Label>
            <Textarea id="habitosVida" name="habitosVida" value={formData.habitosVida} onChange={handleInputChange} placeholder="Describa los hábitos de vida del paciente..." className="min-h-[100px]" />
          </div>
          
          <div>
            <Label htmlFor="medicoCabecera">Médico de Cabecera</Label>
            <InputWithIcon icon={<User className="w-4 h-4" />} id="medicoCabecera" name="medicoCabecera" value={formData.medicoCabecera} onChange={handleInputChange} />
          </div>
          
          <div>
            <Label htmlFor="idioma">Idioma</Label>
            <InputWithIcon icon={<Globe className="w-4 h-4" />} id="idioma" name="idioma" value={formData.idioma} onChange={handleInputChange} />
          </div>
          
          <div>
            <Label htmlFor="autorizacionTratamiento">Autorización de Tratamiento</Label>
            <InputWithIcon icon={<FileText className="w-4 h-4" />} id="autorizacionTratamiento" name="autorizacionTratamiento" value={formData.autorizacionTratamiento} onChange={handleInputChange} />
          </div>
          
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleInputChange} placeholder="Añada cualquier observación relevante..." className="min-h-[100px]" />
          </div>
          
          <Button type="submit" className="w-full">Registrar Paciente</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

