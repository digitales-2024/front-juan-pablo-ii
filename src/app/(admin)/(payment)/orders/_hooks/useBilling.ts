import { CreateMedicalAppointmentBillingDto, CreatePrescriptionBillingLocalDto } from "./../_interfaces/order.interface";

import { BaseApiResponse } from "@/types/api/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateProductSaleBillingDto,
  Order,
} from "../_interfaces/order.interface";
import {
  createMedicalAppointmentOrder,
  createPrescriptionOrder,
  createProductSaleOrder,
} from "../_actions/billing.actions";
import { toast } from "sonner";

export const useBilling = () => {
  const queryClient = useQueryClient();
  const createSaleOrderMutation = useMutation<
    BaseApiResponse<Order>,
    Error,
    CreateProductSaleBillingDto
  >({
    mutationFn: async (data) => {
      const response = await createProductSaleOrder(data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createPrescriptionOrderMutation = useMutation<
    BaseApiResponse<Order>,
    Error,
    CreatePrescriptionBillingLocalDto
  >({
    mutationFn: async (data) => {
      const response = await createPrescriptionOrder(data);
      if ("error" in response) {
        throw new Error("Error del servidor: " + response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

    const createMedicalAppointmentOrderMutation = useMutation<BaseApiResponse<Order>, Error, CreateMedicalAppointmentBillingDto>({
      mutationFn: async (data) => {
        const response = await createMedicalAppointmentOrder(data);
        if ("error" in response) {
          throw new Error("Error del servidor: " + response.error);
        }
        return response;
      },
      onSuccess: async (res) => {
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success(res.message);
      },
      onError: (error) => {
        toast.error(error.message);
      }
    });
  return {
    createSaleOrderMutation,
    createPrescriptionOrderMutation,
    createMedicalAppointmentOrderMutation
  };
};
