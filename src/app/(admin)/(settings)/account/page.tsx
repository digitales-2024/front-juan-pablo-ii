'use server'
import { getUser } from './_actions/get-profile.action';
import FormAccount from './_components/FormAccount'

export default async function Account2Page() {
  return (
    <div className="container mx-auto py-6">
      <FormAccount />
    </div>
  )
}
