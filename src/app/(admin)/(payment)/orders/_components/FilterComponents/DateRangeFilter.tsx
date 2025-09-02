"use client";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { toast } from "sonner";
import {
  FilterByDateRange,
  FilterByDateRangeSchema,
} from "../../_interfaces/filter.interface";
import { useUnifiedOrders } from "../../_hooks/useFilterOrders";

interface DateRangeFilterProps {
  className?: string;
}

export function DateRangeFilter({ className }: DateRangeFilterProps) {
  const { setFilterByDateRange, query: ordersQuery } = useUnifiedOrders();

  const filterByDateRangeForm = useForm<FilterByDateRange>({
    resolver: zodResolver(FilterByDateRangeSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });

  const onSubmitDateRange = useCallback(
    (input: FilterByDateRange) => {
      console.log("Filtrando por rango de fechas:", input);
      setFilterByDateRange({
        startDate: input.startDate,
        endDate: input.endDate,
      });
      if (ordersQuery.isError) {
        toast.error("Error al filtrar órdenes por fecha");
      }
      if (ordersQuery.data) {
        filterByDateRangeForm.reset();
        toast.success("Órdenes filtradas correctamente");
      }
    },
    [setFilterByDateRange, ordersQuery.isError, ordersQuery.data, filterByDateRangeForm]
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <CalendarIcon className="h-4 w-4" />
          Filtrar por Rango de Fechas
        </CardTitle>
        <CardDescription className="text-xs">
          Selecciona un rango de fechas para filtrar las órdenes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...filterByDateRangeForm}>
          <form
            onSubmit={filterByDateRangeForm.handleSubmit(onSubmitDateRange)}
            className="flex flex-col sm:flex-row gap-3 items-end"
          >
            <FormField
              control={filterByDateRangeForm.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Fecha de Inicio</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={filterByDateRangeForm.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Fecha de Fin</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="h-8 px-3 flex items-center gap-1"
              disabled={ordersQuery.isLoading}
            >
              <FilterIcon className="h-3 w-3" />
              Filtrar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
