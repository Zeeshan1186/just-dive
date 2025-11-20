import { useEffect, useState } from "react";
import { getBlogs, getBlogscategories } from "@/services/apiService"; // 👈 Added getBlogscategories
import banner from "../assets/images/blog2.webp";
import waves from "../assets/images/Waves.webp";
import { Link } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Helmet } from "react-helmet-async";
import { formattedText } from "@/utils/common-function";

const BlogsPage = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: number; name: string; }[]>([]); // 👈 Categories state
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 9;

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await getBlogs();
                setBlogs(res.data.data || []);
            } catch (err) {
                console.error("Failed to load blogs", err);
            } finally {
                setLoading(false);
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

    // Pagination Logic
    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const displayedBlogs = blogs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    };

    const skeletonCards = Array(6).fill(0);

    return (
        <>
            <Helmet>
                <title>Just Dive Scuba Blog | Murudeshwar Diving Insights</title>
                <meta name="description" content="Read diving tips, Netrani stories, PADI course guides & marine life in our blog. Stay updated with Just Dive Scuba, Murudeshwar." />
                <meta name="keywords" content="Murudeshwar Diving Insights" />
            </Helmet>
            {/* Hero Banner */}
            <div
                className="relative flex justify-center items-center h-[50vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <img src={waves} alt="Golden wave" className="w-10 mx-auto" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-6">
                        Blogs
                    </h1>
                </div>
            </div>

            {/* Blogs Grid */}
            <section className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {loading ? skeletonCards.map((_, index) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden bg-white shadow-md animate-pulse"
                        >
                            <div className="h-48 sm:h-52 md:h-56 bg-gray-300 w-full" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))
                        : displayedBlogs.map((blog) => {
                            const categoryName =
                                categories.find((c) => c.id === blog.category_id)?.name || "No Category";

                            return (
                                <div
                                    key={blog.id}
                                    className="rounded-xl overflow-hidden bg-white shadow-md sm:shadow-none transform transition-all duration-300 sm:hover:-translate-y-2 sm:hover:shadow-2xl"
                                >
                                    <Link
                                        to={`/blog/${formattedText(blog.title)}`}
                                        state={{ blogId: blog.id }}
                                        className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition block group"
                                    >
                                        <img
                                            src={blog.blog_image}
                                            alt={blog.title}
                                            className="h-48 sm:h-52 md:h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="p-4">
                                            <h4 className="font-semibold text-[#171717] leading-6 Poppins text-lg mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-[#0191e9]">
                                                {blog.title}
                                            </h4>
                                            <p className="font-normal text-gray-700 Poppins text-sm mb-2 line-clamp-3" dangerouslySetInnerHTML={{
                                                __html: blog.description,
                                            }} />
                                            <div className="flex justify-between text-sm text-gray-500">
                                                <span>{blog.creation_date}</span>
                                                <span className="italic">{categoryName}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                        <Pagination>
                            <PaginationContent className="flex flex-wrap gap-2 justify-center">
                                {/* Previous */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage - 1);
                                        }}
                                    />
                                </PaginationItem>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={i + 1 === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(i + 1);
                                            }}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                {/* Next */}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage + 1);
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </section>
        </>
    );
};

export default BlogsPage;
