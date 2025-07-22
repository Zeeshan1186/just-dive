import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogsByCategoryId, getBlogscategories } from "@/services/apiService";

const CategoryBlogsPage = () => {
    const { categoryId } = useParams();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string; }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryBlogs = async () => {
            setIsLoading(true);
            try {
                const res = await getBlogsByCategoryId(categoryId as string);
                setBlogs(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch category blogs", err);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await getBlogscategories();
                setCategories(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };

        fetchCategoryBlogs();
        fetchCategories();
    }, [categoryId]);

    const getCategoryName = (id: number) => {
        return categories.find((c) => c.id === id)?.name || "Category";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const currentCategory = getCategoryName(Number(categoryId));

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 Poppins">
                All Blogs of {currentCategory} Category
            </h1>

            {isLoading ? (
                <div className="text-center py-10 text-gray-500">
                    Loading blogs...
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-lg">
                    No Blogs found for <span className="font-semibold">{currentCategory}</span>.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Link
                            to={`/blog/${blog.id}`}
                            key={blog.id}
                            className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition block"
                        >
                            <img
                                src={blog.blog_image}
                                alt={blog.title}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4">
                                <h4 className="font-semibold Poppins text-[#171717] leading-6 text-lg mb-2 line-clamp-2">
                                    {blog.title}
                                </h4>
                                <p className="font-normal Poppins text-gray-700 text-sm mb-2 line-clamp-3">
                                    {blog.description}
                                </p>
                                <p className="text-sm Poppins text-gray-500 flex justify-between items-center">
                                    <span>{formatDate(blog.updated_at)}</span>
                                    <span className="italic">{currentCategory}</span>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryBlogsPage;
