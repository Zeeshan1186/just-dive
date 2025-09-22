import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBlogs, getBlogscategories } from "@/services/apiService";
import { useNavigate, Link } from "react-router-dom";

const BlogSection = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string; }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await getBlogs();
                setBlogs(res.data.data || []);
            } catch (err) {
                console.error("Failed to load blogs", err);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await getBlogscategories();
                setCategories(res.data.data || []);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };

        fetchBlogs();
        fetchCategories();
    }, []);

    const displayedBlogs = blogs.slice(0, 3);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // DD-MM-YYYY
    };

    return (
        <section className="px-4 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
            {/* Title Section */}
            <div className="text-center relative mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl relative z-10 Trirong font-normal">
                    Blogs
                </h2>
                <div className="flex justify-center items-center mt-[-50px] sm:mt-[-70px] md:mt-[-90px]">
                    <span className="hidden sm:block w-20 sm:w-40 border-t border-dotted border-[#C3A357]" />
                    <span className="relative top-[-10px] text-[50px] sm:text-[80px] md:text-[120px] font-bold blog inset-0 z-0 select-none leading-none">
                        Blogs
                    </span>
                    <span className="hidden sm:block w-20 sm:w-40 border-t border-dotted border-[#C3A357]" />
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-6 md:px-10 lg:px-20">
                {displayedBlogs.map((blog) => {
                    const categoryName =
                        categories.find((c) => c.id === blog.category_id)?.name || "No Category";

                    return (
                        <div key={blog.id} className="rounded-xl overflow-hidden bg-white">
                            <Link
                                to={`/blog/${blog.id}`}
                                className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition block"
                            >
                                <img
                                    src={blog.blog_image}
                                    alt={blog.title}
                                    className="h-48 sm:h-52 md:h-56 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h4 className="font-semibold text-[#171717] leading-6 Poppins text-lg mb-2 line-clamp-2">
                                        {blog.title}
                                    </h4>
                                    <p className="font-normal text-gray-700 Poppins text-sm mb-2 line-clamp-3">
                                        {blog.description}
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{formatDate(blog.creation_date)}</span>
                                        <span className="italic">{categoryName}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>

            {/* View More Button */}
            <div className="flex justify-center items-center mt-8">
                <Button
                    onClick={() => navigate("/blogs")}
                    className="text-white cursor-pointer font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border border-[#0191e9] rounded-full text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5"
                >
                    View More Blog
                </Button>
            </div>
        </section>
    );
};

export default BlogSection;
