import ContentForm from "../ContentForm";

const AddExperience = () => {
    return (
        <>
            <div className="p-8 ">
                <h1 className="text-2xl font-bold text-[#2b5f60] mb-2">Experiences</h1>
                <ContentForm addUrl="/api/admin/add-experience" type="Experience" />
            </div>
        </>
    );
};

export default AddExperience;
