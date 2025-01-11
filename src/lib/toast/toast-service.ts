import type { ToastAdapter, ToastMessage, ToastOptions, ToastPromiseOptions } from './types';
import { SonnerAdapter } from './adapters/sonner-adapter';

class ToastService {
  private adapter: ToastAdapter;

  constructor(adapter: ToastAdapter) {
    this.adapter = adapter;
  }

  setAdapter(adapter: ToastAdapter) {
    this.adapter = adapter;
  }

  show(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.show(toastMessage, options);
  }

  success(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.success(toastMessage, options);
  }

  error(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.error(toastMessage, options);
  }

  warning(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.warning(toastMessage, options);
  }

  info(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.info(toastMessage, options);
  }

  loading(message: string | ToastMessage, options?: ToastOptions) {
    const toastMessage = this.normalizeMessage(message);
    return this.adapter.loading(toastMessage, options);
  }

  promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>) {
    return this.adapter.promise(promise, options);
  }

  dismiss(toastId?: string | number) {
    this.adapter.dismiss(toastId);
  }

  dismissAll() {
    this.adapter.dismissAll();
  }

  private normalizeMessage(message: string | ToastMessage): ToastMessage {
    if (typeof message === 'string') {
      return { message };
    }
    return message;
  }
}

export const toast = new ToastService(new SonnerAdapter());