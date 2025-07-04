import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getBlogs } from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BlogSection = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
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

        fetchBlogs();
    }, []);

    const displayedBlogs = blogs.slice(0, 3);

    return (
        <section className="px-4 py-4 max-w-7xl mx-auto">
            <div className="text-center relative mb-6">
                <h2 className="text-4xl relative z-10 Trirong font-normal">Blogs</h2>
                <div className="flex justify-center mt-[-90px] items-center">
                    <span className="w-150 border-t border-dotted border-[#C3A357]"></span>
                    <span className="relative top-[-10px] text-[80px] md:text-[120px] font-bold blog inset-0 z-0 select-none">
                        Blogs
                    </span>
                    <span className="w-150 border-t border-dotted border-[#C3A357]"></span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-20">
                {displayedBlogs.map((blog) => (
                    <div key={blog.id} className="rounded-xl overflow-hidden bg-white">
                        <Link
                            to={`/blog/${blog.id}`}
                            className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition block"
                        >
                            <img
                                src={blog.blog_image}
                                alt="Related Post"
                                className="h-40 w-full object-cover"
                            />
                            <div className="p-4 pl-0">
                                <h4 className="font-semibold text-[#171717] leading-6 Poppins text-lg mb-2">
                                    {blog.title}
                                </h4>
                                <p className="font-normal text-gray-700 Poppins text-sm mb-2 line-clamp-2">
                                    {blog.description}
                                </p>
                                <p className="text-sm text-gray-500">{blog.creation_date}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-6">
                <Button
                    onClick={() => navigate("/blogs")}
                    className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2"
                >
                    View More Blogs
                </Button>
            </div>
        </section>
    );
};

export default BlogSection;
