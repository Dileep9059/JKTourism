import ContentForm from '../ContentForm'

const AddActivity = () => {
  return (
    <>
      <div className="p-8 ">
        <h1 className="text-2xl font-bold text-[#2b5f60]">Activity</h1>
        <ContentForm addUrl="/api/admin/add-activity" type="Activity" />
      </div>
    </>
  )
}

export default AddActivity