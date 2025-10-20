import { useQueryClient } from "@tanstack/react-query";
import AddCategory from "./AddCategory"
import ShowCategories from "./ShowCategories"

const Category = () => {

    const queryClient = useQueryClient();

    const handleCategoriesAdded = () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] }); // refetch coupons
    };

    return (
        <>
            <AddCategory onSuccess={handleCategoriesAdded} />
            <ShowCategories />
        </>
    )
}

export default Category