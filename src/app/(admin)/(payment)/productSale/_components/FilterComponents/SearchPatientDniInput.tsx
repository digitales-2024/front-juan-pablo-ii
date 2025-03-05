'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchPatientDniInputProps {
    onPatientFound: (patient: Patient | null) => void
}

export default function SearchPatientDniInput({ onPatientFound }: SearchPatientDniInputProps) {
    const [dni, setDni] = useState('')
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        if (!dni || dni.length < 7) return

        setIsSearching(true)
        try {
            const patient = await searchPatientByDni(dni)
            onPatientFound(patient)
        } catch (error) {
            console.error('Error searching patient:', error)
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
