'use server'
import FormAccount from './_components/FormAccount'

export default async function AccountPage() {
  return (
    <div className="container mx-auto py-6">
      <FormAccount />
    </div>
  )
}
