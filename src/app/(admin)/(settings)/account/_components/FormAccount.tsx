'use client'
import AccountData from './AccountData'


export default function FormAccount() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Información de la Cuenta</h3>
        <p className="text-sm text-muted-foreground">
          Aquí puedes ver la información detallada de tu cuenta
        </p>
      </div>
      
      <AccountData />
    </div>
  )
}
