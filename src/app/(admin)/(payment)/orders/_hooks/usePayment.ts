import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ProcessPaymentDto,
  Payment,
  VerifyPaymentDto,
  CancelPaymentDto,
  RejectPaymentDto,
  RefundPaymentDto,
} from "../_interfaces/order.interface";
import { BaseApiResponse } from "@/types/api/types";
import { cancelPayment, processPayment, refundPayment, rejectPayment, verifyPayment } from "../_actions/payment.actions";

interface PaymentVariables<T> {
    paymentId: string;
    data: T;
  }

export const usePayments = () => {
  const queryClient = useQueryClient();

  const processPaymentMutation = useMutation<BaseApiResponse<Payment>, Error, PaymentVariables<ProcessPaymentDto>>({
    mutationFn: async ({data, paymentId}) => {
      const response = await processPayment(paymentId, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const verifyPaymentMutation = useMutation<BaseApiResponse<Payment>, Error, PaymentVariables<VerifyPaymentDto>>({
    mutationFn: async ({paymentId, data}) => {
      const response = await verifyPayment(paymentId, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const cancelPaymentMutation = useMutation<BaseApiResponse<Payment>, Error, PaymentVariables<CancelPaymentDto>>({
    mutationFn: async ({paymentId, data}) => {
      const response = await cancelPayment(paymentId, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const rejectPaymentMutation = useMutation<BaseApiResponse<Payment>, Error, PaymentVariables<RejectPaymentDto>>({
    mutationFn: async ({paymentId, data}) => {
      const response = await rejectPayment(paymentId, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const refundPaymentMutation = useMutation<BaseApiResponse<Payment>, Error, PaymentVariables<RefundPaymentDto>>({
    mutationFn: async ({paymentId, data}) => {
      const response = await refundPayment(paymentId, data);
      if ("error" in response) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: async (res) => {
      await queryClient.refetchQueries({ queryKey: ["orders"] });
      toast.success(res.message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return {
    processPaymentMutation,
    verifyPaymentMutation,
    cancelPaymentMutation,
    rejectPaymentMutation,
    refundPaymentMutation
  };
};
