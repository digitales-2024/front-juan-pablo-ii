// Configuración específica para manejo de archivos en dispositivos móviles
export const MOBILE_CONFIG = {
  // Tamaño máximo de archivo en bytes (15MB)
  MAX_FILE_SIZE: 15 * 1024 * 1024,
  
  // Tamaño objetivo para compresión (15MB)
  TARGET_SIZE: 15 * 1024 * 1024,
  
  // Tipos de archivo permitidos
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  // Configuración para input de archivos en móviles
  INPUT_ATTRIBUTES: {
    accept: 'image/*',
    capture: 'environment' as const, // Usar cámara trasera por defecto
    multiple: true,
  },
  
  // Configuración de compresión para móviles
  COMPRESSION: {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.85,
    // Configuración de compresión agresiva para archivos grandes
    heavyCompression: {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.75,
    }
  }
};

// Función para detectar si es un dispositivo móvil
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Interfaz para resultado de validación
interface ValidationResult {
  valid: boolean;
  error?: string;
  needsCompression?: boolean;
}

// Función para validar archivos de forma simple
export const validateImageFile = (file: File): ValidationResult => {
  // Verificar tipo
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }
  
  // Para archivos muy grandes, aceptarlos pero marcar para compresión
  if (file.size > MOBILE_CONFIG.TARGET_SIZE) {
    return { valid: true, needsCompression: true };
  }
  
  return { valid: true };
};

// Función para comprimir imagen automáticamente
export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Determinar si necesita compresión agresiva
      const needsHeavyCompression = file.size > MOBILE_CONFIG.TARGET_SIZE;
      const config = needsHeavyCompression 
        ? MOBILE_CONFIG.COMPRESSION.heavyCompression 
        : MOBILE_CONFIG.COMPRESSION;
      
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img;
      const maxWidth = config.maxWidth;
      const maxHeight = config.maxHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      // Configurar canvas
      canvas.width = width;
      canvas.height = height;
      
      // Dibujar imagen redimensionada
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convertir a blob con compresión
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Crear nuevo archivo comprimido
            const compressedFile = new File(
              [blob], 
              file.name.replace(/\.(png|webp)$/i, '.jpg'), // Convertir a JPG para mejor compresión
              { 
                type: 'image/jpeg',
                lastModified: Date.now()
              }
            );
            resolve(compressedFile);
          } else {
            reject(new Error('Error comprimiendo imagen'));
          }
        },
        'image/jpeg',
        config.quality
      );
    };
    
    img.onerror = () => reject(new Error('Error cargando imagen'));
    img.src = URL.createObjectURL(file);
  });
};

// Función para procesar múltiples imágenes con compresión automática
export const processImages = async (files: File[]): Promise<{
  processedFiles: File[];
  errors: string[];
  compressionApplied: boolean;
}> => {
  const processedFiles: File[] = [];
  const errors: string[] = [];
  let compressionApplied = false;
  
  for (const file of files) {
    try {
      const validation = validateImageFile(file);
      
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`);
        continue;
      }
      
      // Si el archivo necesita compresión, comprimirlo
      if (validation.needsCompression || file.size > MOBILE_CONFIG.TARGET_SIZE) {
        try {
          const compressedFile = await compressImage(file);
          processedFiles.push(compressedFile);
          compressionApplied = true;
        } catch {
          // Si falla la compresión, intentar usar el archivo original si no es demasiado grande
          if (file.size <= MOBILE_CONFIG.MAX_FILE_SIZE * 2) { // Permitir hasta 30MB antes de rechazar
            processedFiles.push(file);
          } else {
            errors.push(`${file.name}: Demasiado grande y falló la compresión`);
          }
        }
      } else {
        // Archivo ya está en tamaño aceptable
        processedFiles.push(file);
      }
    } catch {
      errors.push(`${file.name}: Error procesando archivo`);
    }
  }
  
  return { processedFiles, errors, compressionApplied };
};

// Función para crear preview de imagen de forma segura
export const createSafeImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      resolve(url);
    } catch (error) {
      reject(new Error(error instanceof Error ? error.message : 'Error creating image preview'));
    }
  });
};
