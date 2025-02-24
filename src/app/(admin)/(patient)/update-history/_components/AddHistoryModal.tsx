// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { DialogClose } from "@radix-ui/react-dialog"
// import { ImageIcon, X, FileText, User, MapPin, Stethoscope, ClipboardPlus, CalendarHeart } from "lucide-react"
// import { SERVICIOS_OPCIONES, PERSONAL_MEDICO, SUCURSAL } from "../_interfaces/constants"
// import type { Servicio } from "../_interfaces/types"
// import { AddMedicalLeaveModal } from "./AddMedicalLeaveModal"
// import { AddPrescriptionModal } from "./AddPrescriptionModal"
// import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"

// interface AddHistoryModalProps {
//   isOpen: boolean
//   setIsOpen: (isOpen: boolean) => void
//   onSave: (servicio: Servicio) => void
//   initialData?: Servicio
// }

// export function AddHistoryModal({ isOpen, setIsOpen, onSave, initialData }: AddHistoryModalProps) {
//   const [nuevoServicio, setNuevoServicio] = useState<Servicio>(
//     initialData || {
//       serviceId: "",
//       staffId: PERSONAL_MEDICO,
//       branchId: SUCURSAL,
//       prescription: false,
//       prescriptionItems: [],
//       description: "",
//       medicalLeave: false,
//       newImages: [],
//       medicalLeaveStartDate: null,
//       medicalLeaveEndDate: null,
//       medicalLeaveDays: null,
//       leaveDescription: "",
//       prescriptionTitle: "",
//       prescriptionDescription: "",
//       services: [],
//     },
//   )

//   const [showMedicalLeaveModal, setShowMedicalLeaveModal] = useState(false)
//   const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

//   const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files)
//       const newImages = files.map((file) => URL.createObjectURL(file))
//       setNuevoServicio((prev) => ({
//         ...prev,
//         newImages: [...prev.newImages, ...newImages],
//       }))
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSave(nuevoServicio)
//     resetForm()
//     setIsOpen(false)
//   }

//   const resetForm = () => {
//     setNuevoServicio({
//       serviceId: "",
//       staffId: PERSONAL_MEDICO,
//       branchId: SUCURSAL,
//       prescription: false,
//       prescriptionItems: [],
//       description: "",
//       medicalLeave: false,
//       newImages: [],
//       medicalLeaveStartDate: null,
//       medicalLeaveEndDate: null,
//       medicalLeaveDays: null,
//       leaveDescription: "",
//       prescriptionTitle: "",
//       prescriptionDescription: "",
//       services: [],
//     })
//     setShowMedicalLeaveModal(false)
//     setShowPrescriptionModal(false)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent className="max-w-3xl max-h-[90vh] h-full border-t-4 border-t-primary">
//         <ScrollArea className="max-h-[calc(100vh-8rem)]">
//           <DialogHeader>
//             <div className="flex justify-between items-center">
//               <DialogTitle className="text-2xl font-semibold">Agregar Historia Médica</DialogTitle>
//               <DialogClose asChild>
//                 <Button variant="ghost" size="icon">
//                   <X className="h-4 w-4" />
//                 </Button>
//               </DialogClose>
//             </div>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-6 p-6">
//             <Card>
//               <CardContent className="p-6 space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="serviceId" className="flex items-center gap-2">
//                       <Stethoscope className="h-4 w-4 text-primary" />
//                       Servicio
//                     </Label>
//                     <Select
//                       value={nuevoServicio.serviceId}
//                       onValueChange={(value) => setNuevoServicio((prev) => ({ ...prev, serviceId: value }))}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Seleccione un servicio" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {SERVICIOS_OPCIONES.map((servicio) => (
//                           <SelectItem key={servicio} value={servicio}>
//                             {servicio}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="staffId" className="flex items-center gap-2">
//                       <User className="h-4 w-4 text-primary" />
//                       Medico
//                     </Label>
//                     <Input id="staffId" value={PERSONAL_MEDICO} disabled className="bg-muted" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="branchId" className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4 text-primary" />
//                       Sucursal
//                     </Label>
//                     <Input id="branchId" value={SUCURSAL} disabled className="bg-muted" />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6 space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="description" className="flex items-center gap-2">
//                     <FileText className="h-4 w-4 text-primary" />
//                     Descripción
//                   </Label>
//                   <Textarea
//                     id="description"
//                     value={nuevoServicio.description}
//                     onChange={(e) => setNuevoServicio((prev) => ({ ...prev, description: e.target.value }))}
//                     required
//                     className="min-h-[100px]"
//                     placeholder="Ingrese la descripción de la consulta o servicio..."
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6 space-y-4">
//                 <Label className="flex items-center gap-2">
//                   <ImageIcon className="h-4 w-4 text-primary" />
//                   Evidencia Fotográfica
//                 </Label>
//                 <div className="mt-2">
//                   <input type="file" id="images" multiple onChange={handleAddImage} className="hidden" />
//                   <label
//                     htmlFor="images"
//                     className="inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors"
//                   >
//                     <ImageIcon className="w-5 h-5 mr-2" />
//                     <span>Agregar Imágenes</span>
//                   </label>
//                 </div>

//                 {nuevoServicio.newImages.length > 0 && (
//                   <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                     {nuevoServicio.newImages.map((image, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={image || "/placeholder.svg"}
//                           alt={`Imagen ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         <button
//                           type="button"
//                           onClick={() =>
//                             setNuevoServicio((prev) => ({
//                               ...prev,
//                               newImages: prev.newImages.filter((_, i) => i !== index),
//                             }))
//                           }
//                           className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6 space-y-4">
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowPrescriptionModal(true)}
//                     className="w-full sm:w-auto flex items-center gap-2"
//                   >
//                     <ClipboardPlus className="w-4 h-4" />
//                     Agregar Receta Médica
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowMedicalLeaveModal(true)}
//                     className="w-full sm:w-auto flex items-center gap-2"
//                   >
//                     <CalendarHeart className="w-4 h-4" />
//                     Agregar Descanso Médico
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {nuevoServicio.medicalLeave && <Badge variant="secondary">Descanso Médico Agregado</Badge>}
//                   {nuevoServicio.prescription && <Badge variant="secondary">Receta Médica Agregada</Badge>}
//                 </div>
//               </CardContent>
//             </Card>

//             <DialogFooter>
//               <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
//                 Cancelar
//               </Button>
//               <Button type="submit">Guardar Historia</Button>
//             </DialogFooter>
//           </form>
//         </ScrollArea>
//       </DialogContent>

//       <AddMedicalLeaveModal
//         isOpen={showMedicalLeaveModal}
//         setIsOpen={setShowMedicalLeaveModal}
//         onSave={(data) => {
//           setNuevoServicio((prev) => ({ ...prev, ...data }))
//         }}
//         initialData={{
//           medicalLeave: nuevoServicio.medicalLeave,
//           medicalLeaveStartDate: nuevoServicio.medicalLeaveStartDate,
//           medicalLeaveEndDate: nuevoServicio.medicalLeaveEndDate,
//           medicalLeaveDays: nuevoServicio.medicalLeaveDays,
//           leaveDescription: nuevoServicio.leaveDescription,
//         }}

//       />

//       <AddPrescriptionModal
//         isOpen={showPrescriptionModal}
//         setIsOpen={setShowPrescriptionModal}
//         onSave={(data) => {
//           setNuevoServicio((prev) => ({
//             ...prev,
//             ...data,
//             prescription: true,
//           }))
//         }}
//         initialData={{
//           prescription: nuevoServicio.prescription,
//           prescriptionTitle: nuevoServicio.prescriptionTitle,
//           prescriptionDescription: nuevoServicio.prescriptionDescription,
//           prescriptionItems: nuevoServicio.prescriptionItems,
//           services: nuevoServicio.services || [],
//         }}
//       />
//     </Dialog>
//   )
// }