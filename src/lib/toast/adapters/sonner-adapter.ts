import { toast } from 'sonner';
import type { ToastAdapter, ToastMessage, ToastOptions, ToastPromiseOptions } from '../types';

const defaultOptions: Partial<ToastOptions> = {};

export class SonnerAdapter implements ToastAdapter {
  private mapOptions(options?: ToastOptions) {
    return {
      ...defaultOptions,
      ...options,
      onDismiss: options?.onDismiss,
    };
  }

  show(message: ToastMessage, options?: ToastOptions) {
    return toast(message.message, this.mapOptions(options));
  }

  success(message: ToastMessage, options?: ToastOptions) {
    return toast.success(message.message, this.mapOptions(options));
  }

  error(message: ToastMessage, options?: ToastOptions) {
    return toast.error(message.message, this.mapOptions(options));
  }

  warning(message: ToastMessage, options?: ToastOptions) {
    return toast.warning(message.message, this.mapOptions(options));
  }

  info(message: ToastMessage, options?: ToastOptions) {
    return toast.info(message.message, this.mapOptions(options));
  }

  loading(message: ToastMessage, options?: ToastOptions) {
    return toast.loading(message.message, this.mapOptions(options));
  }

  async promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>) {
    toast.promise(promise, options);
    return promise;
  }

  dismiss(toastId?: string | number) {
    toast.dismiss(toastId);
  }

  dismissAll() {
    toast.dismiss();
  }
}