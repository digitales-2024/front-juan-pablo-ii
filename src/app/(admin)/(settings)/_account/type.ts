import { z } from 'zod'
import { isValidPhoneNumber } from 'react-phone-number-input'

export const profileSchema = z.object({
	name: z.string().min(2, {
	  message: 'El nombre debe tener al menos 2 caracteres.',
	}).max(30, {
	  message: 'El nombre no debe exceder los 30 caracteres.',
	}),
	phone: z.string().refine(isValidPhoneNumber, {
	  message: 'El número de teléfono no es válido.',
	}).optional(),
  })
  
  export type ProfileFormValues = z.infer<typeof profileSchema>
  