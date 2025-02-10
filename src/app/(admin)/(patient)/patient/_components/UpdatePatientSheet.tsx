"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  updatePatientSchema,
  UpdatePatientInput,
  Patient,
  UpdatePatientFormData,
} from "../_interfaces/patient.interface";
import { PencilIcon, RefreshCcw, UserPlus, User } from "lucide-react";
import { usePatients } from "../_hooks/usePatient";
import { Textarea } from "@/components/ui/textarea";
import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UpdatePatientSheetProps {
  patient: Patient;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdatePatientSheet({
  patient,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdatePatientSheetProps) {
  console.log(patient);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = usePatients();
  // const {

  // } = patientsQuery
  //const index = patients?.findIndex((p) => p.id === patient.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    patient.patientPhoto ?? null
  );

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const form = useForm<UpdatePatientInput>({
    resolver: zodResolver(updatePatientSchema),
    defaultValues: {
      name: patient.name ?? FORMSTATICS.name.defaultValue,
      lastName: patient.lastName ?? FORMSTATICS.lastName.defaultValue,
      dni: patient.dni ?? FORMSTATICS.dni.defaultValue,
      birthDate: patient.birthDate ?? FORMSTATICS.birthDate.defaultValue,
      gender: patient.gender ?? FORMSTATICS.gender.defaultValue,
      address: patient.address ?? FORMSTATICS.address.defaultValue,
      phone: patient.phone ?? FORMSTATICS.phone.defaultValue,
      email: patient.email ?? FORMSTATICS.email.defaultValue,
      emergencyContact:
        patient.emergencyContact ?? FORMSTATICS.emergencyContact.defaultValue,
      emergencyPhone:
        patient.emergencyPhone ?? FORMSTATICS.emergencyPhone.defaultValue,
      healthInsurance:
        patient.healthInsurance ?? FORMSTATICS.healthInsurance.defaultValue,
      maritalStatus:
        patient.maritalStatus ?? FORMSTATICS.maritalStatus.defaultValue,
      occupation: patient.occupation ?? FORMSTATICS.occupation.defaultValue,
      workplace: patient.workplace ?? FORMSTATICS.workplace.defaultValue,
      bloodType: patient.bloodType ?? FORMSTATICS.bloodType.defaultValue,
      primaryDoctor:
        patient.primaryDoctor ?? FORMSTATICS.primaryDoctor.defaultValue,
      language: patient.language ?? FORMSTATICS.language.defaultValue,
      notes: patient.notes ?? FORMSTATICS.notes.defaultValue,
      patientPhoto:
        patient.patientPhoto ?? FORMSTATICS.patientPhoto.defaultValue,
    },
  });

  console.log(form.watch());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Archivo seleccionado:", file);
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Maneja la presentación del formulario de Actualización del paciente.
   *
   * @Param Data: los datos de formulario validados para actualizar al paciente.
   *
   * Esta función verifica si una mutación de actualización ya está pendiente para evitar presentaciones duplicadas.
   * Prepara los datos del formulario con los detalles del paciente y la imagen opcional, luego intenta actualizar la información del paciente.
   * Sobre el éxito, cierra el formulario y lo restablece.En un error, registra el error y restablece el formulario si no está autorizado.
   */
  const onSubmit = async (data: UpdatePatientInput) => {
    if (updateMutation.isPending) return;

    // Log para verificar el contenido de patientPhoto antes de usarlo
    console.log(
      "Contenido de patientPhoto antes de procesar:",
      data.patientPhoto
    );

    const formData: UpdatePatientFormData = {
      data: {
        ...data,
      },
      image: data.image instanceof File ? data.image : null,
      id: patient.id,
    };

    // Log para verificar los datos al crear el objeto UpdatePatientFormData
    console.log("Datos creados para UpdatePatientFormData:", formData);

    try {
      await updateMutation.mutateAsync(
        {
          id: patient.id,
          formData,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            console.error(
              `Error al actualizar ${METADATA.entityName.toLowerCase()}:`,
              error
            );
            if (error.message.includes("No autorizado")) {
              setTimeout(() => {
                form.reset();
              }, 1000);
            }
          },
        }
      );
    } catch (error) {
      // The error is already handled by the mutation
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <PencilIcon className="size-4" aria-hidden="true" />
          </Button>
        </SheetTrigger>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            Actualizar {METADATA.entityName.toLowerCase()}
          </SheetTitle>
          <SheetDescription>
            Actualiza la información de este(a){" "}
            {METADATA.entityName.toLowerCase()} y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative">
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
              <div className="p-2 sm:p-1 overflow-auto h-[calc(80dvh-10rem)]  grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.name.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.name.placeholder}
                          type={FORMSTATICS.name.type}
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
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.lastName.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.lastName.placeholder}
                          type={FORMSTATICS.lastName.type}
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
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.dni.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.dni.placeholder}
                          type={FORMSTATICS.dni.type}
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
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.birthDate.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.birthDate.placeholder}
                          type={FORMSTATICS.birthDate.type}
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.gender.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
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
                      <CustomFormDescription
                        required={FORMSTATICS.gender.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.address.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.address.placeholder}
                          type={FORMSTATICS.address.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.address.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.phone.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.phone.placeholder}
                          type={FORMSTATICS.phone.type}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.email.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.email.placeholder}
                          type={FORMSTATICS.email.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.email.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        {FORMSTATICS.emergencyContact.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.emergencyContact.placeholder}
                          type={FORMSTATICS.emergencyContact.type}
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
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.emergencyPhone.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.emergencyPhone.placeholder}
                          type={FORMSTATICS.emergencyPhone.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.emergencyPhone.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthInsurance"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.healthInsurance.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                FORMSTATICS.healthInsurance.placeholder
                              }
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
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.maritalStatus.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                FORMSTATICS.maritalStatus.placeholder
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Soltero">Soltero</SelectItem>
                            <SelectItem value="Casado">Casado</SelectItem>
                            <SelectItem value="Divorciado">
                              Divorciado
                            </SelectItem>
                            <SelectItem value="Viudo">Viudo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.maritalStatus.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.occupation.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.occupation.placeholder}
                          type={FORMSTATICS.occupation.type}
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
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.workplace.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.workplace.placeholder}
                          type={FORMSTATICS.workplace.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.workplace.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.bloodType.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
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
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="primaryDoctor"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.primaryDoctor.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.primaryDoctor.placeholder}
                          type={FORMSTATICS.primaryDoctor.type}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.primaryDoctor.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.language.label}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={FORMSTATICS.language.placeholder}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Español">Español</SelectItem>
                            <SelectItem value="Inglés">Inglés</SelectItem>
                            <SelectItem value="Quechua">Quechua</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.language.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.notes.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={FORMSTATICS.notes.placeholder}
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

              <SheetFooter>
                <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCcw className="mr-2 size-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar"
                    )}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
