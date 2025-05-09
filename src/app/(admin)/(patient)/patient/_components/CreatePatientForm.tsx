"use client";

import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { CreatePatientInput } from "../_interfaces/patient.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FORMSTATICS } from "../_statics/forms"; // Importación directa
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useRef, useState } from "react"; // Removido useMemo ya que no es necesario
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Briefcase,
  UserPlus,
  Smartphone,
  IdCard,
  PhoneIcon,
  Droplet,
  Shield,
  Heart,
  Users,
  UserRoundPen,
  Hospital,
} from "lucide-react";
import { BookOpen, Building, CreditCard } from "lucide-react"; // Importar íconos adicionales
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import DatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

interface CreatePatientFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreatePatientInput>;
  onSubmit: SubmitHandler<CreatePatientInput>;
}

// Componente InputWithIcon definido fuera del componente principal
const InputWithIcon = ({
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <Input className="pl-10" {...props} />
  </div>
);

export function CreatePatientForm({
  children,
  form,
  onSubmit,
}: CreatePatientFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string>("dni");
  // Función de cambio de archivo extraída del ciclo de render
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("patientPhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Añadir al inicio del archivo o en un archivo separado de constantes
  const DOCUMENT_TYPES = [
    {
      id: "dni",
      label: "DNI",
      icon: <IdCard className="w-4 h-4" />,
      length: 8,
    },
    {
      id: "ce",
      label: "CE",
      icon: <CreditCard className="w-4 h-4" />,
      length: 9,
    },
    {
      id: "passport",
      label: "PAS",
      icon: <BookOpen className="w-4 h-4" />,
      length: 12,
    },
    {
      id: "ruc",
      label: "RUC",
      icon: <Building className="w-4 h-4" />,
      length: 11,
    },
  ];

  // Crear este componente en el mismo archivo o en uno separado

  const InputWithDocumentSelector = ({
    value,
    onChange,
    placeholder,
    documentType,
    setDocumentType,
    ...props
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    documentType: string;
    setDocumentType: (type: string) => void;
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
    // Encontrar el tipo de documento seleccionado
    const selectedType =
      DOCUMENT_TYPES.find((type) => type.id === documentType) ??
      DOCUMENT_TYPES[0];

    // Manejar cambio en el input con validación de longitud
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Permitir solo dígitos
      if (!/^\d*$/.test(newValue)) return;

      // Limitar a la longitud correspondiente al tipo de documento
      if (newValue.length <= selectedType.length) {
        onChange(newValue);
      }
    };

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
          <Select
            value={documentType}
            onValueChange={setDocumentType}
            defaultValue="dni"
          >
            <SelectTrigger className="w-[40px] h-[26px] p-0 border-none bg-transparent">
              <SelectValue>{selectedType.icon}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id}
                  className="flex gap-2 items-center"
                >
                  {type.icon} <span>{type.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          value={value}
          onChange={handleInputChange}
          className="pl-12"
          placeholder={
            placeholder ??
            `Ingrese ${selectedType.label} (${selectedType.length} dígitos)`
          }
          {...props}
        />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={preview ?? ""} className="object-cover" />
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

        {/* El resto del formulario queda igual, solo asegurándose de usar InputWithIcon como componente externo */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.name.placeholder}
                    type={FORMSTATICS.name.type}
                    icon={<UserRoundPen className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.name.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.lastName.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.lastName.placeholder}
                    type={FORMSTATICS.lastName.type}
                    icon={<UserRoundPen className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.lastName.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.dni.label}</FormLabel>
                <FormControl>
                  <InputWithDocumentSelector
                    value={field.value || ""}
                    onChange={(value) => field.onChange(value)}
                    documentType={documentType}
                    setDocumentType={setDocumentType}
                    placeholder={FORMSTATICS.dni.placeholder}
                  />
                </FormControl>
                <div className="flex justify-between items-center text-xs">
                  <CustomFormDescription required={FORMSTATICS.dni.required} />
                  <span className="text-muted-foreground">
                    {field.value?.length || 0}/
                    {DOCUMENT_TYPES.find((t) => t.id === documentType)
                      ?.length ?? 8}{" "}
                    dígitos
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.birthDate.label}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        type="button"
                      >
                        {field.value ? (
                          format(parseISO(field.value), "dd/MM/yyyy", {
                            locale: es,
                          })
                        ) : (
                          <span>Seleccione fecha de nacimiento</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePicker
                      selected={field.value ? parseISO(field.value) : null}
                      onChange={(date) => {
                        if (!date) return;
                        field.onChange(format(date, "yyyy-MM-dd"));
                      }}
                      dateFormat="yyyy-MM-dd"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      locale={es}
                      maxDate={new Date()}
                      inline
                      className="react-datepicker"
                      calendarClassName="react-datepicker__calendar"
                      dayClassName={() => "react-datepicker__day"}
                      monthClassName={() => "react-datepicker__month"}
                      yearClassName={() => "react-datepicker__year"}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.gender.label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative pl-10">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <SelectValue
                        placeholder={FORMSTATICS.gender.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <CustomFormDescription required={FORMSTATICS.gender.required} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.maritalStatus.label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative pl-10">
                      <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <SelectValue
                        placeholder={FORMSTATICS.maritalStatus.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soltero">Soltero</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viudo">Viudo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.maritalStatus.required}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.phone.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.phone.placeholder}
                    type={FORMSTATICS.phone.type}
                    icon={<Smartphone className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.phone.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emergencyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.emergencyPhone.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.emergencyPhone.placeholder}
                    type={FORMSTATICS.emergencyPhone.type}
                    icon={<PhoneIcon className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.emergencyPhone.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.email.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.email.placeholder}
                    type={FORMSTATICS.email.type}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.email.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.address.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.address.placeholder}
                    type={FORMSTATICS.address.type}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.address.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.emergencyContact.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.emergencyContact.placeholder}
                    type={FORMSTATICS.emergencyContact.type}
                    icon={<UserPlus className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.emergencyContact.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="healthInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.healthInsurance.label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative pl-10">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <SelectValue
                        placeholder={FORMSTATICS.healthInsurance.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Privado">Privado</SelectItem>
                      <SelectItem value="Público">Público</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.healthInsurance.required}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.occupation.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.occupation.placeholder}
                    type={FORMSTATICS.occupation.type}
                    icon={<Briefcase className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.occupation.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workplace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.workplace.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.workplace.placeholder}
                    type={FORMSTATICS.workplace.type}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.workplace.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.bloodType.label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative pl-10">
                      <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <SelectValue
                        placeholder={FORMSTATICS.bloodType.placeholder}
                      />
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
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.bloodType.required}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primaryDoctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.primaryDoctor.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.primaryDoctor.placeholder}
                    type={FORMSTATICS.primaryDoctor.type}
                    icon={<User className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.primaryDoctor.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="sucursal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.sucursal.label}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="relative pl-10">
                      <Hospital className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <SelectValue
                        placeholder={FORMSTATICS.sucursal.placeholder}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JLBYR">JLBYR</SelectItem>
                      <SelectItem value="Yanahuara">Yanahuara</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.sucursal.required}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={FORMSTATICS.notes.placeholder}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
                <CustomFormDescription
                  required={FORMSTATICS.notes.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {children}
      </form>
    </Form>
  );
}
