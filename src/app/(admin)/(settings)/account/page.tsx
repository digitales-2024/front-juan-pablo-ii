import React from 'react'
import FormProfile from './_components/FormProfile'
import { getProfile } from './actions';

export default async function AccountPage() {
  const profile = await getProfile();
  
  return (
    <div>
      <FormProfile profile={profile} />
    </div>
  )
}
