/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";
import { PaymentMethod } from "../../../orders/_interfaces/order.interface";
import { Card, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ConsultationSchema,
  consultationsSchema,
} from "@/app/(admin)/(consultations)/consultations/type";
import { useAppointments } from "@/app/(admin)/(appointments)/appointments/_hooks/useAppointments";
import { CreateAppointmentDto } from "@/app/(admin)/(appointments)/appointments/_interfaces/appointments.interface";
import ConsultationForm from "@/app/(admin)/(consultations)/consultations/_components/ConsultationForm";
import LeftPanel from "@/app/(admin)/(consultations)/consultations/_components/LeftPanel";
import ConsultationCalendarTime from "@/app/(admin)/(consultations)/consultations/_components/ConsultationCalendarTime";

const CREATE_APPOINTMENT_FOR_ORDER_MESSAGES = {
  button: "Agendar Cita",
  title: "Agendar Nueva Cita",
  description:
    "Selecciona fecha, hora, médico y sucursal para agendar una nueva cita.",
  success: "Cita agendada exitosamente",
  submitButton: "Confirmar Cita",
  cancel: "Cancelar",
} as const;

interface CreateAppointmentDialogProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  serviceId: string;
  patientId: string;
  disabled?: boolean;
  uniqueIdentifier: string
}
export function CreateAppointmentDialog({
  className,
  serviceId,
  patientId,
  disabled,
  uniqueIdentifier,
  ...rest
}: CreateAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  //   const [localSelectRows, setLocalSelectRows] = useState<ActiveProduct[]>([]);
  // const selectedProductsTanstack = useSelectedProducts();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const [showForm, setShowForm] = useState(false);
  const [allowPastDates, setAllowPastDates] = useState(false);
  const [showAvailableDays, setShowAvailableDays] = useState(false);
  const [showAvailableHours, setShowAvailableHours] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  //First initialize the local storage for selected services store BEFORE INSTANTIATING "useAppointments"
  //   const selectedServicesAppointmentsData = useSelectedServicesAppointments();
  //const dispatch = useSelectedServicesAppointmentsDispatch();
  const { createMutationForOrder } = useAppointments();
  const createMutation = createMutationForOrder(uniqueIdentifier);

  const form = useForm<ConsultationSchema>({
    resolver: zodResolver(consultationsSchema),
    defaultValues: {
      time: undefined,
      date: format(new Date(), "yyyy-MM-dd"),
      serviceId: serviceId,
      notes: undefined,
      staffId: undefined,
      branchId: undefined,
      patientId: patientId,
      paymentMethod: undefined,
    },
  });

  const handleClose = () => {
    //form.reset();
    // dispatch({ type: "clear" });
    setOpen(false);
  };

  // Cada vez que cambie selectedDate, actualizar form.date
  useEffect(() => {
    form.setValue("date", format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate, form]);

  const selectedTime = form.watch("time");

  const canContinueToForm = selectedDate && selectedTime;

  const handleStaffChange = (staffId: string) => {
    setSelectedStaffId(staffId);
    form.setValue("staffId", staffId);
  };

  const handleBranchChange = (branchId: string) => {
    setSelectedBranchId(branchId);
    form.setValue("branchId", branchId);
  };

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleServiceChange = (serviceId: string) => {
    form.setValue("serviceId", serviceId);
  };

  const handlePatientChange = (patientId: string) => {
    form.setValue("patientId", patientId);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    form.setValue("date", format(date, "yyyy-MM-dd")); // Actualiza como string
  };

  useEffect(() => {
    console.log("Form values changed:", form.getValues());
  }, [form.watch()]);

  useEffect(() => {
    const formValues = form.getValues();

    if (formValues.time && selectedDate) {
      // Procesar fecha y hora
      const [time, period] = formValues.time.split(/(?=[AaPp][Mm])/);
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);

      if (period.toLowerCase() === "pm" && hour24 < 12) {
        hour24 += 12;
      } else if (period.toLowerCase() === "am" && hour24 === 12) {
        hour24 = 0;
      }

      // Crear fechas ISO
      const startDate = new Date(selectedDate);
      startDate.setHours(hour24);
      startDate.setMinutes(parseInt(minutes));
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);

      const endDate = new Date(startDate);
      // Cambiar de 30 a 15 minutos
      endDate.setMinutes(endDate.getMinutes() + 15);

      console.log("🕒 HORARIOS:", {
        "Hora seleccionada (Perú)": formValues.time,
        "Fecha seleccionada (Perú)": format(selectedDate, "yyyy-MM-dd"),
        "Inicio (Perú)": new Date(startDate).toLocaleString("es-PE", {
          timeZone: "America/Lima",
        }),
        "Fin (Perú)": new Date(endDate).toLocaleString("es-PE", {
          timeZone: "America/Lima",
        }),
        "Inicio (UTC)": startDate.toISOString(),
        "Fin (UTC)": endDate.toISOString(),
        Duración: "15 minutos",
      });

      const appointmentPreview = {
        staffId: formValues.staffId,
        serviceId: formValues.serviceId,
        branchId: formValues.branchId,
        patientId: formValues.patientId,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type: "CONSULTA" as const,
        notes: formValues.notes ?? "",
        status: "PENDING" as const,
        paymentMethod: formValues.paymentMethod as PaymentMethod,
      };

      console.log(
        "👀 PREVIEW - Así se enviará el appointment:",
        appointmentPreview
      );
    }
  }, [form.watch(), selectedDate]);

  const handleSubmit = async (data: ConsultationSchema) => {
    console.log("🔄 INICIO DE handleSubmit CON DATOS:", data);

    // Validación explícita de campos requeridos
    const requiredFields = [
      "staffId",
      "serviceId",
      "branchId",
      "patientId",
      "time",
      "paymentMethod",
    ];
    const missingFields = requiredFields.filter(
      (field) => !data[field as keyof ConsultationSchema]
    );

    if (missingFields.length > 0) {
      console.error("❌ Faltan campos requeridos:", missingFields);
      toast.error(`Faltan campos requeridos: ${missingFields.join(", ")}`);
      return;
    }

    try {
      // Procesar fecha y hora
      console.log("⏱️ Procesando fecha y hora...");
      console.log("📆 Fecha seleccionada (string):", data.date);
      console.log("🕒 Hora seleccionada (Lima):", data.time);

      // Extraer componentes de la hora
      const [time, period] = data.time.split(/(?=[AaPp][Mm])/);
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);

      if (period.toLowerCase() === "pm" && hour24 < 12) {
        hour24 += 12;
      } else if (period.toLowerCase() === "am" && hour24 === 12) {
        hour24 = 0;
      }

      console.log("🕒 Hora convertida a 24h (Lima):", hour24 + ":" + minutes);

      // Parsear la fecha en formato yyyy-MM-dd
      const [year, month, day] = data.date.split("-").map(Number);

      // CORRECCIÓN: Crear la fecha en hora local de Lima y luego convertir a UTC
      // Lima está en UTC-5, por lo que necesitamos sumar 5 horas para obtener UTC
      const limaToUTCOffset = 5; // Diferencia horaria entre Lima y UTC

      // Crear fecha en hora local (Lima)
      const limaDate = new Date(
        year,
        month - 1,
        day,
        hour24,
        parseInt(minutes),
        0,
        0
      );
      console.log("📅 Fecha en hora local (Lima):", limaDate.toString());

      // Convertir a UTC sumando la diferencia horaria
      const utcHour = hour24 + limaToUTCOffset;
      console.log("🕒 Hora convertida a UTC:", utcHour + ":" + minutes);

      // Crear fecha en UTC
      const startDate = new Date(
        Date.UTC(year, month - 1, day, utcHour, parseInt(minutes), 0, 0)
      );

      console.log("📅 Fecha creada (UTC):", startDate.toISOString());
      console.log("📅 Fecha creada (local):", startDate.toString());
      console.log("📅 Día del mes (UTC):", startDate.getUTCDate());
      console.log(
        "📅 Hora (UTC):",
        startDate.getUTCHours() + ":" + startDate.getUTCMinutes()
      );

      // Verificar la conversión a hora de Lima
      const limaHourFromUTC = startDate.getUTCHours() - limaToUTCOffset;
      console.log(
        "🕒 Hora en Lima calculada desde UTC:",
        limaHourFromUTC + ":" + startDate.getUTCMinutes()
      );

      // Crear fecha de fin (15 minutos después)
      const endDate = new Date(startDate.getTime());
      endDate.setUTCMinutes(endDate.getUTCMinutes() + 15);

      console.log("📅 Fechas procesadas:", {
        startDateUTC: startDate.toISOString(),
        endDateUTC: endDate.toISOString(),
        startHourUTC: startDate.getUTCHours() + ":" + startDate.getUTCMinutes(),
        endHourUTC: endDate.getUTCHours() + ":" + endDate.getUTCMinutes(),
        startHourLima: limaHourFromUTC + ":" + startDate.getUTCMinutes(),
        endHourLima: limaHourFromUTC + ":" + endDate.getUTCMinutes(),
        duracionMinutos: 15,
      });

      // Crear objeto para createMutation
      const appointmentToCreate: CreateAppointmentDto = {
        staffId: data.staffId,
        serviceId: data.serviceId,
        branchId: data.branchId,
        patientId: data.patientId,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        type: "CONSULTA" as const,
        notes: data.notes ?? "",
        status: "PENDING" as const,
        paymentMethod: data.paymentMethod as PaymentMethod,
      };

      console.log(
        "📦 OBJETO FINAL PARA CREAR APPOINTMENT:",
        appointmentToCreate
      );

      await createMutation.mutateAsync(appointmentToCreate);
      //Enviar datos de retorno a la tabla de citas
      // En lugar de resetear todo el formulario, solo limpiamos algunos campos
      // pero mantenemos la fecha, hora, personal y sucursal seleccionados
      form.setValue("notes", "");
      form.setValue("paymentMethod", "CASH");
      // Mantenemos: date, time, staffId, branchId
      setShowForm(false);
      toast.success("Cita agendada exitosamente");
      handleClose()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al crear la cita: ${error.message}`);
        console.error(error.message);
      } else {
        toast.error("Error desconocido al crear la cita");
      }
      // dispatch({ type: "clear" });
    }
  };

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
      {/* <Button
        type="button"
        onClick={() => handleSave(localSelectRows)}
        className="w-full"
      >
        {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.submitButton}
      </Button> */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleClose}
      >
        {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="ghost"
      size="sm"
      type="button"
      className={className}
      {...rest}
      disabled={disabled}
    >
      <CalendarPlus className="size-4 mr-2 text-primary" aria-hidden="true" />
      {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.button}
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="sm:min-w-[calc(640px-2rem)] md:min-w-[calc(768px-2rem)] lg:min-w-[calc(1024px-10rem)] max-h-[calc(100vh-4rem)] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.title}
            </DialogTitle>
            <DialogDescription>
              {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.description}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-auto max-h-full">
            <Card className="w-full p-8 rounded-lg max-w-7xl mx-auto shadow">
              <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                <div className="flex items-center  gap-2">
                  <Button
                    variant={showForm ? "outline" : "default"}
                    onClick={() => setShowForm(false)}
                    className="gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    Calendario
                  </Button>
                  <Button
                    variant={showForm ? "default" : "outline"}
                    onClick={() => setShowForm(true)}
                    className="gap-2"
                    disabled={!canContinueToForm}
                  >
                    <FileText className="w-4 h-4" />
                    Formulario
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {/* <Switch
						id="allow-past"
						checked={allowPastDates}
						onCheckedChange={setAllowPastDates}
					/>
					<Label htmlFor="allow-past">Permitir fechas pasadas</Label> */}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-available-days"
                    checked={showAvailableDays}
                    onCheckedChange={setShowAvailableDays}
                  />
                  <Label htmlFor="show-available-days">
                    Mostrar solo días disponibles
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-available-hours"
                    checked={showAvailableHours}
                    onCheckedChange={setShowAvailableHours}
                  />
                  <Label htmlFor="show-available-hours">
                    Mostrar horas disponibles
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] w-full  gap-8">
                <LeftPanel
                  date={selectedDate}
                  time={selectedTime}
                  onStaffChange={handleStaffChange}
                  onBranchChange={handleBranchChange}
                  onServiceChange={handleServiceChange}
                  onPatientChange={handlePatientChange}
                  form={form}
                  notModifyDefaults={true}
                />
                <div className="relative">
                  {!showForm ? (
                    <div className="pb-12">
                      <ConsultationCalendarTime
                        form={form}
                        allowPastDates={allowPastDates}
                        showAvailableDays={showAvailableDays}
                        showAvailableHours={showAvailableHours}
                        selectedStaffId={selectedStaffId}
                        selectedBranchId={selectedBranchId}
                        selectedDate={selectedDate}
                        onMonthChange={handleMonthChange}
                      />
                      {canContinueToForm && (
                        <div className="absolute bottom-0 right-0 mt-4">
                          <Button
                            onClick={() => setShowForm(true)}
                            className="gap-2"
                          >
                            Continuar
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <ConsultationForm form={form} onSubmit={handleSubmit}>
                      <CardFooter className="w-full gap-10">
                        <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
                          <Button type="submit" className="w-full">
                            Guardar
                          </Button>

                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al calendario
                          </Button>
                        </div>
                      </CardFooter>
                    </ConsultationForm>
                  )}
                </div>
              </div>
            </Card>
          </div>
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.title}
          </DrawerTitle>
          <DrawerDescription>
            {CREATE_APPOINTMENT_FOR_ORDER_MESSAGES.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-auto max-h-[calc(100dvh-12rem)]">
          <Card className="w-full p-8 rounded-lg max-w-7xl mx-auto shadow">
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
              <div className="flex items-center  gap-2">
                <Button
                  variant={showForm ? "outline" : "default"}
                  onClick={() => setShowForm(false)}
                  className="gap-2"
                >
                  <CalendarDays className="w-4 h-4" />
                  Calendario
                </Button>
                <Button
                  variant={showForm ? "default" : "outline"}
                  onClick={() => setShowForm(true)}
                  className="gap-2"
                  disabled={!canContinueToForm}
                >
                  <FileText className="w-4 h-4" />
                  Formulario
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {/* <Switch
						id="allow-past"
						checked={allowPastDates}
						onCheckedChange={setAllowPastDates}
					/>
					<Label htmlFor="allow-past">Permitir fechas pasadas</Label> */}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-available-days"
                  checked={showAvailableDays}
                  onCheckedChange={setShowAvailableDays}
                />
                <Label htmlFor="show-available-days">
                  Mostrar solo días disponibles
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="show-available-hours"
                  checked={showAvailableHours}
                  onCheckedChange={setShowAvailableHours}
                />
                <Label htmlFor="show-available-hours">
                  Mostrar horas disponibles
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] w-full  gap-8">
              <LeftPanel
                date={selectedDate}
                time={selectedTime}
                onStaffChange={handleStaffChange}
                onBranchChange={handleBranchChange}
                onServiceChange={handleServiceChange}
                onPatientChange={handlePatientChange}
                form={form}
                notModifyDefaults={true}
              />
              <div className="relative">
                {!showForm ? (
                  <div className="pb-12">
                    <ConsultationCalendarTime
                      form={form}
                      allowPastDates={allowPastDates}
                      showAvailableDays={showAvailableDays}
                      showAvailableHours={showAvailableHours}
                      selectedStaffId={selectedStaffId}
                      selectedBranchId={selectedBranchId}
                      selectedDate={selectedDate}
                      onMonthChange={handleMonthChange}
                    />
                    {canContinueToForm && (
                      <div className="absolute bottom-0 right-0 mt-4">
                        <Button
                          onClick={() => setShowForm(true)}
                          className="gap-2"
                        >
                          Continuar
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <ConsultationForm form={form} onSubmit={handleSubmit}>
                    <CardFooter className="w-full gap-10">
                      <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
                        <Button type="submit" className="w-full">
                          Guardar
                        </Button>

                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Volver al calendario
                        </Button>
                      </div>
                    </CardFooter>
                  </ConsultationForm>
                )}
              </div>
            </div>
          </Card>
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
