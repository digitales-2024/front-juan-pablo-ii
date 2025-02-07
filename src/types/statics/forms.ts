import { HTMLInputTypeAttribute } from "react";

export type Option = {
    value: string;
    label: string;
    [key: string]: string;
};

/**
 * Describe la estructura y el comportamiento de un campo de UI dentro de un formulario.
 * 
 * @property label - La etiqueta mostrada junto a este campo.
 * @property required - Indica si el campo debe ser completado.
 * @property defaultValue - Valor predeterminado opcional para el campo.
 * @property placeholder - Texto de marcador de posición opcional.
 * @property name - Atributo de nombre opcional para envíos de formularios.
 * @property type - Definición opcional del tipo de entrada HTML.
 * @property description - Explicación o detalles adicionales opcionales sobre el campo.
 * @property emptyMessage - Mensaje opcional para mostrar cuando el campo está vacío (por ejemplo, en una selección de búsqueda).
 */
export type FormFieldStatics<T> = {
    label: string;
    required: boolean;
    name : T; //El nombre es el mismo string de la validaciòn de zod
    placeholder: string;
    type: HTMLInputTypeAttribute;
    isNotEditable?: boolean;
    defaultValue?: string | number | boolean ; //Change according to necessity
    description?: string;
    emptyMessage?: string; //In case of a search select
}

export type ComplexFormFieldStatics<T, V> = {
    label: string;
    required: boolean;
    name : T; //El nombre es el mismo string de la validaciòn de zod
    placeholder: string;
    type: HTMLInputTypeAttribute;
    isNotEditable?: boolean;
    defaultValue?: string | number | boolean ; //Change according to necessity
    description?: string;
    emptyMessage?: string; //In case of a search select
    subFields?: FormStatics<V>;
}

/**
 * Representa un tipo genérico que mapea cada clave de un objeto de tipo `T` a un `FormFieldStatics`.
 *
 * @template T - El tipo del objeto cuyas claves se utilizarán para el mapeo.
 */
export type FormStatics<T> = Record<keyof T, FormFieldStatics<keyof T>>;
export type ComplexFormStatics<T, V> = Record<keyof T, ComplexFormFieldStatics<keyof T, V>>;

export const REQUIRED_MESSAGE = "Este campo es requerido";