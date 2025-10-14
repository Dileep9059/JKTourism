import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and
          timezone.'
    >
      <>
        <AccountForm />
        <div className='mt-3'>
          <ChangePassword />
        </div>
        <div className='mt-3'>
          <DeleteAccount />
        </div>
      </>
    </ContentSection>
  )
}
