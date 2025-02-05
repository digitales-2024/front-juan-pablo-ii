"use client";

import { UseFormReturn } from "react-hook-form";
import { CreatePatientFormData } from "../_interfaces/patient.interface";
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
import { FORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  Globe,
  FileText,
  UserPlus,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatePatientFormProps
  extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  /* botones de envio de formulario */
  children: React.ReactNode;
  /* hook de formulario */
  form: UseFormReturn<CreatePatientFormData>;
  /* funcion de envio de formulario */
  onSubmit: (data: CreatePatientFormData) => void;
}

export function CreatePatientForm({
  children,
  form,
  onSubmit,
}: CreatePatientFormProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* se debe de enviar un file de imagen */}
            <Avatar className="w-32 h-32">
              <AvatarImage src={preview ?? ""} />
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
          <FormField
            control={form.control}
            name="data.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.name.placeholder}
                    type={FORMSTATICS.name.type}
                    icon={<User className="w-4 h-4" />}
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
            name="data.lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.lastName.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.lastName.placeholder}
                    type={FORMSTATICS.lastName.type}
                    icon={<User className="w-4 h-4" />}
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
            name="data.dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.dni.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.dni.placeholder}
                    type={FORMSTATICS.dni.type}
                    icon={<FileText className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.dni.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.birthDate.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.birthDate.placeholder}
                    type={FORMSTATICS.birthDate.type}
                    icon={<Calendar className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.birthDate.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.gender.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.gender.placeholder}
                    type={FORMSTATICS.gender.type}
                    icon={<User className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.gender.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="data.address"
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
            name="data.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.phone.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.phone.placeholder}
                    type={FORMSTATICS.phone.type}
                    icon={<Phone className="w-4 h-4" />}
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
            name="data.email"
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data.emergencyContact"
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
            name="data.emergencyPhone"
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data.healthInsurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.healthInsurance.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.healthInsurance.placeholder}
                    type={FORMSTATICS.healthInsurance.type}
                    icon={<Heart className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.healthInsurance.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.maritalStatus.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.maritalStatus.placeholder}
                    type={FORMSTATICS.maritalStatus.type}
                    icon={<User className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.maritalStatus.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data.occupation"
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
            name="data.workplace"
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
            name="data.bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.bloodType.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.bloodType.placeholder}
                    type={FORMSTATICS.bloodType.type}
                    icon={<Heart className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.bloodType.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="data.primaryDoctor"
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
            name="data.language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{FORMSTATICS.language.label}</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder={FORMSTATICS.language.placeholder}
                    type={FORMSTATICS.language.type}
                    icon={<Globe className="w-4 h-4" />}
                  />
                </FormControl>
                <CustomFormDescription
                  required={FORMSTATICS.language.required}
                ></CustomFormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="data.notes"
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
