'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { getPatientByDni } from '@/app/(admin)/(patient)/patient/_actions/patient.actions'
import { Patient } from '@/app/(admin)/(patient)/patient/_interfaces/patient.interface'
import { toast } from 'sonner'

interface SearchPatientDniInputProps {
    onPatientFound: (patient: Patient | null) => void
    hasCE?: boolean //CE has up to 20 characters
}

export default function SearchPatientDniInput({ onPatientFound, hasCE }: SearchPatientDniInputProps) {
    const DNIChars = 8
    const CEChars = 9
    const [dni, setDni] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        if (!dni) return;
        if (!hasCE && dni.length < DNIChars) return;
        if (!hasCE && dni.length > DNIChars) return;
        if (hasCE && dni.length < 1) return; // Allow any length for CE as long as it's not empty
        if (hasCE && dni.length > CEChars) return;

        setIsSearching(true)
        try {
            const patient = await getPatientByDni(dni)
            if ('error' in patient) {
                throw new Error(patient.error)
            }
            if (patient.length === 0) {
                return;
            }
            if (patient.length > 0) {
                onPatientFound(patient[0])
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error('Error buscando pacientes' + error.message)
            } else {
                toast.error('Error buscando pacientes')
            }
            onPatientFound(null)
        } finally {
            setIsSearching(false)
        }
    }

    return (
        <div className="flex gap-2 items-center">
            <Input
                type="text"
                placeholder="Ingrese DNI del paciente"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                maxLength={8}
                className="w-[200px]"
            />
            <Button 
                onClick={handleSearch}
                disabled={isSearching || dni.length < 7}
                variant="outline"
                size="icon"
            >
                <Search className="h-4 w-4" />
            </Button>
        </div>
    )
}
