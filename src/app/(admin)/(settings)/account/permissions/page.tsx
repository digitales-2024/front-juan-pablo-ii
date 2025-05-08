import React from 'react'
import { Permissions } from './_components/Permissions'

export default function SettingsPage() {
  
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Permisos de la Cuenta</h3>      
      </div>
      
        <Permissions />
    </div>
    </div>

    )
  }
