export interface ToastMessage {
    message: string | (() => React.ReactNode);
    description?: string | (() => React.ReactNode);
  }
  
  export interface ToastOptions {
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    className?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
    onDismiss?: () => void;
  }
  
  export interface ToastPromiseOptions<T> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
  
  export interface ToastAdapter {
    show(message: ToastMessage, options?: ToastOptions): string | number;
    success(message: ToastMessage, options?: ToastOptions): string | number;
    error(message: ToastMessage, options?: ToastOptions): string | number;
    warning(message: ToastMessage, options?: ToastOptions): string | number;
    info(message: ToastMessage, options?: ToastOptions): string | number;
    loading(message: ToastMessage, options?: ToastOptions): string | number;
    promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>;
    dismiss(toastId?: string | number): void;
    dismissAll(): void;
  }