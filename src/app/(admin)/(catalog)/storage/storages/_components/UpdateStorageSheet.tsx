"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
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
  Storage,
  UpdateStorageInput,
  updateStorageSchema,
} from "../_interfaces/storage.interface";
import { PencilIcon, RefreshCcw } from "lucide-react";
import { useStorages } from "../_hooks/useStorages";
import { AutoComplete } from "@/components/ui/autocomplete";
import LoadingDialogForm from "./LoadingDialogForm";
import GeneralErrorMessage from "./errorComponents/GeneralErrorMessage";
import { Option } from "@/types/statics/forms";
import { UPDATEFORMSTATICS as STATIC_FORM } from "../_statics/forms";
import { CustomFormDescription } from "@/components/ui/custom/CustomFormDescription";
import { METADATA } from "../_statics/metadata";
import { useTypeStorages } from "../../storage-types/_hooks/useStorageTypes";
import DataDependencyErrorMessage from "./errorComponents/DataDependencyErrorMessage";
import { useStaff } from "@/app/(admin)/(staff)/staff/_hooks/useStaff";
import { useBranches } from "@/app/(admin)/branches/_hooks/useBranches";

interface UpdateStoargeSheetProps {
  storage: Storage;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function UpdateStorageSheet({
  storage,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
}: UpdateStoargeSheetProps) {
  const FORMSTATICS = useMemo(() => STATIC_FORM, []);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const { updateMutation } = useStorages();

  // Use controlled state if props are provided, otherwise use internal state
  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  // export const updateStorageSchema = z.object({
  //   name: z.string().optional(),
  //   location: z.string().optional(),
  //   typeStorageId: z.string().optional(),
  // }) satisfies z.ZodType<UpdateStorageDto>;

  const form = useForm<UpdateStorageInput>({
    resolver: zodResolver(updateStorageSchema),
    defaultValues: {
      name: storage.name ?? FORMSTATICS.name.defaultValue,
      location: storage.location ?? FORMSTATICS.location.defaultValue,
      typeStorageId:
        storage.typeStorageId ?? FORMSTATICS.typeStorageId.defaultValue,
      branchId: storage.branchId ?? "",
      staffId: storage.staffId ?? "",
    },
  });

  const onSubmit = async (data: UpdateStorageInput) => {
    if (updateMutation.isPending) return;

    try {
      await updateMutation.mutateAsync(
        {
          id: storage.id,
          data,
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

  const { activeTypeStoragesQuery: responseStorageTypes } = useTypeStorages();
  const { activeStaffQuery: responseStaff } = useStaff();
  const { activeBranchesQuery: responseBranches } = useBranches();

  if (
    responseStorageTypes.isLoading &&
    responseStaff.isLoading &&
    responseBranches.isLoading
  ) {
    return <LoadingDialogForm />;
  } else {
    if (responseStorageTypes.isError) {
      return (
        <GeneralErrorMessage
          error={responseStorageTypes.error}
          reset={responseStorageTypes.refetch}
        />
      );
    }
    if (!responseStorageTypes.data) {
      return <LoadingDialogForm />;
    }
    if (responseStaff.isError) {
      return (
        <GeneralErrorMessage
          error={responseStaff.error}
          reset={responseStaff.refetch}
        />
      );
    }
    if (!responseStaff.data) {
      return <LoadingDialogForm />;
    }
    if (responseBranches.isError) {
      return responseBranches.error ? (
        <GeneralErrorMessage
          error={responseBranches.error}
          reset={responseBranches.refetch}
        />
      ) : null;
    }
    if (!responseBranches.data) {
      return <LoadingDialogForm />;
    }
  }

  if (METADATA.dataDependencies && (responseStorageTypes.data.length === 0|| responseStaff.data.length === 0 || responseBranches.data.length === 0)) {
    return (
      <DataDependencyErrorMessage
        error={
          new Error(
            `No existe la información necesaria. Revisar presencia de información en: ${METADATA.dataDependencies
              .map((dependency) => dependency.dependencyName)
              .join(", ")}`
          )
        }
        dataDependencies={METADATA.dataDependencies}
      />
    );
  }

  const storageTypesOptions: Option[] = responseStorageTypes.data.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

  const staffOptions: Option[] = responseStaff.data.map((staff) => ({
    label: `${staff.name} ${staff.lastName} - ${staff.staffType.name}`,
    value: staff.id,
  }));

  const branchesOptions: Option[] = responseBranches.data.map(
    (typeProduct) => ({
      label: typeProduct.name,
      value: typeProduct.id,
    })
  );

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
                {/* Campo de tipo de almacén */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.typeStorageId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.typeStorageId.label}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={storageTypesOptions}
                          placeholder={FORMSTATICS.typeStorageId.placeholder}
                          emptyMessage={FORMSTATICS.typeStorageId.emptyMessage!}
                          value={
                            storageTypesOptions.find(
                              (option) => option.value === field.value
                            ) ?? undefined
                          }
                          onValueChange={(option) => {
                            field.onChange(option?.value || "");
                          }}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.typeStorageId.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                {/* Campo de Sucursal */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.branchId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel htmlFor={FORMSTATICS.branchId.name}>{FORMSTATICS.branchId.label}</FormLabel>
                      <FormControl>
                        {
                          branchesOptions.length>0 ? <AutoComplete
                          options={branchesOptions}
                          placeholder={FORMSTATICS.branchId.placeholder}
                          emptyMessage={FORMSTATICS.branchId.emptyMessage!}
                          value={
                            branchesOptions.find(
                              (option) => option.value === field.value
                            ) ?? undefined
                          }
                          onValueChange={(option) => {
                            field.onChange(option?.value || "");
                          }}
                        /> : (
                          <Input
                            disabled={true}
                            placeholder={FORMSTATICS.branchId.placeholder}
                            type={FORMSTATICS.branchId.type}
                          />
                        )
                        }
                      </FormControl>
                      <CustomFormDescription required={FORMSTATICS.branchId.required}>
                        { branchesOptions.length===0 && <span>No hay sucursales disponibles o activas. Este campo es opcional</span>}
                      </CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Campo de personal */}
                <FormField
                  control={form.control}
                  name={FORMSTATICS.staffId.name}
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>
                        {FORMSTATICS.staffId.label}
                      </FormLabel>
                      <FormControl>
                        {
                          staffOptions.length>0 ? <AutoComplete
                          options={staffOptions}
                          placeholder={FORMSTATICS.staffId.placeholder}
                          emptyMessage={FORMSTATICS.staffId.emptyMessage!}
                          value={
                            staffOptions.find(
                              (option) => option.value === field.value
                            ) ?? undefined
                          }
                          onValueChange={(option) => {
                            field.onChange(option?.value || "");
                          }}
                        /> : (
                          <Input
                            disabled={true}
                            placeholder={FORMSTATICS.name.placeholder}
                            type={FORMSTATICS.staffId.type}
                          />
                        )
                        }
                      </FormControl>
                      <CustomFormDescription required={FORMSTATICS.staffId.required}>
                        { staffOptions.length===0 && <span>No hay personal disponible o activo. Este campo es opcional</span>}
                      </CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={FORMSTATICS.location.name}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{FORMSTATICS.location.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={FORMSTATICS.location.placeholder}
                        />
                      </FormControl>
                      <CustomFormDescription
                        required={FORMSTATICS.location.required}
                      ></CustomFormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
