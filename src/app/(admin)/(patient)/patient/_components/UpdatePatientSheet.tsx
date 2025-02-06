"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
} from "../_interfaces/patient.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { usePatients } from "../_hooks/usePatient";
import { Textarea } from "@/components/ui/textarea";
import { UPDATEFORMSTATICS as FORMSTATICS } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";

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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = usePatients();

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
      emergencyContact: patient.emergencyContact ?? FORMSTATICS.emergencyContact.defaultValue,
      emergencyPhone: patient.emergencyPhone ?? FORMSTATICS.emergencyPhone.defaultValue,
      healthInsurance: patient.healthInsurance ?? FORMSTATICS.healthInsurance.defaultValue,
      maritalStatus: patient.maritalStatus ?? FORMSTATICS.maritalStatus.defaultValue,
      occupation: patient.occupation ?? FORMSTATICS.occupation.defaultValue,
      workplace: patient.workplace ?? FORMSTATICS.workplace.defaultValue,
      bloodType: patient.bloodType ?? FORMSTATICS.bloodType.defaultValue,
      primaryDoctor: patient.primaryDoctor ?? FORMSTATICS.primaryDoctor.defaultValue,
      language: patient.language ?? FORMSTATICS.language.defaultValue,
      notes: patient.notes ?? FORMSTATICS.notes.defaultValue,
      patientPhoto: patient.patientPhoto ?? FORMSTATICS.patientPhoto.defaultValue,
    },
  });

  const onSubmit = async (data: UpdatePatientInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: patient.id,
          data,
        },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            console.error(`Error al actualizar ${METADATA.entityName.toLowerCase()}:`, error);
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
          <SheetTitle>Actualizar {METADATA.entityName.toLowerCase()}</SheetTitle>
          <SheetDescription>
            Actualiza la información de este(a) {METADATA.entityName.toLowerCase()} y guarda los cambios
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-2 sm:p-1 overflow-auto max-h-[calc(80dvh-4rem)] grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={FORMSTATICS.name.name}
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
                  name={FORMSTATICS.lastName.name}
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
                  name={FORMSTATICS.dni.name}
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
                  name={FORMSTATICS.birthDate.name}
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
                  name={FORMSTATICS.gender.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.gender.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.gender.placeholder}
                          type={FORMSTATICS.gender.type}
                        />
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
                  name={FORMSTATICS.address.name}
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
                  name={FORMSTATICS.phone.name}
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
                  name={FORMSTATICS.email.name}
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
                  name={FORMSTATICS.emergencyContact.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.emergencyContact.label}</FormLabel>
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
                  name={FORMSTATICS.emergencyPhone.name}
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
                  name={FORMSTATICS.healthInsurance.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.healthInsurance.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.healthInsurance.placeholder}
                          type={FORMSTATICS.healthInsurance.type}
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
                  name={FORMSTATICS.maritalStatus.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.maritalStatus.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.maritalStatus.placeholder}
                          type={FORMSTATICS.maritalStatus.type}
                        />
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
                  name={FORMSTATICS.occupation.name}
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
                  name={FORMSTATICS.workplace.name}
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
                  name={FORMSTATICS.bloodType.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.bloodType.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.bloodType.placeholder}
                          type={FORMSTATICS.bloodType.type}
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
                  name={FORMSTATICS.primaryDoctor.name}
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
                  name={FORMSTATICS.language.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.language.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.language.placeholder}
                          type={FORMSTATICS.language.type}
                        />
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
                  name={FORMSTATICS.notes.name}
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
                <FormField
                  control={form.control}
                  name={FORMSTATICS.patientPhoto.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.patientPhoto.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.patientPhoto.placeholder}
                          type={FORMSTATICS.patientPhoto.type}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.patientPhoto.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name={FORMSTATICS.image.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.image.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.image.placeholder}
                          type={FORMSTATICS.image.type}
                          onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                        />
                      </FormControl>
                      <FormMessage />
                      <CustomFormDescription
                        required={FORMSTATICS.image.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
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