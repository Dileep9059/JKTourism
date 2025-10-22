import ContentForm from "../ContentForm";


const AddShopping = () => {
    return (
        <>
            <div className="p-8 ">
                <h1 className="text-2xl font-bold text-[#2b5f60] mb-2">Shopping</h1>
                <ContentForm addUrl="/api/admin/add-shopping" type="Shopping" />
            </div>
        </>
    );
};

export default AddShopping;
