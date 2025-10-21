
import ContentForm from "@/components/admin/ContentForm";

const AddCuisines = () => {
    return (
        <>
            <div className="p-8 ">
                <h1 className="text-2xl font-bold text-[#2b5f60]">Cuisine</h1>
                <ContentForm addUrl="/api/admin/add-cuisine" type="Cuisine" />
            </div>
        </>
    );
};

export default AddCuisines;
