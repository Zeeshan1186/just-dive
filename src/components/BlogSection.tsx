import blog1 from "../assets/images/blog1.png";
import blog2 from "../assets/images/blog2.png";
import blog3 from "../assets/images/blog3.png";
import blogimg from "../assets/images/blog-img.png";
import { Button } from "@/components/ui/button";

const blogs = [
    {
        id: 1,
        title: "Exploring the Hidden Gems of South Goa",
        author: "Gabie Sheber",
        date: "Mar. 28, 2020",
        image: blog1, // replace with your actual image path
    },
    {
        id: 2,
        title: "Exploring the Rich Heritage of Goa",
        author: "Gabie Sheber",
        date: "Mar. 28, 2020",
        image: blog2,
    },
    {
        id: 3,
        title: "Famous Temple in Goa: Discover Sacred Beauty",
        author: "Gabie Sheber",
        date: "Mar. 28, 2020",
        image: blog3,
    },
];

const BlogSection = () => {
    return (
        <section className="px-4 py-4 max-w-7xl mx-auto">
            <div className="text-center relative mb-6">
                <h2 className="text-4xl font-bold relative z-10 Trirong font-normal">Blogs</h2>
                <div className="flex justify-center mt-[-90px] items-center">
                    <span className="w-150 border-t border-dotted border-[#C3A357]"></span>
                    <span className="relative top-[-10px] text-[80px] md:text-[120px] font-bold blog inset-0 z-0 select-none">
                        Blogs
                    </span>
                    <span className="w-150 border-t border-dotted border-[#C3A357]"></span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-20">
                {blogs.map((blog) => (
                    <div key={blog.id} className="rounded-xl overflow-hidden bg-white">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-60 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#141A28] Poppins mb-4">{blog.title}</h3>
                            <div className="flex items-center gap-x-2 text-sm text-gray-600 min-h-[40px]">
                                <img
                                    src={blogimg}
                                    alt={blog.author}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-2">
                                    <span>By {blog.author}</span>
                                    <span>{blog.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center items-center">
                <Button className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                    View More
                </Button>
            </div>
        </section>
    );
};

export default BlogSection;
