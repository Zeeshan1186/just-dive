import { useEffect, useState } from "react";
import { getBlogs } from "@/services/apiService";
import banner from "../assets/images/blog2.png";
import waves from "../assets/images/Waves.png";
import { Link } from "react-router-dom";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


const Blogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 9;

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

    // Pagination Logic
    const totalPages = Math.ceil(blogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const displayedBlogs = blogs.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0); // scroll to top on page change
        }
    };

    return (
        <>
            {/* Hero Banner */}
            <div
                className="relative flex justify-center items-center h-[65vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl Trirong md:text-5xl font-normal leading-tight mb-6">
                        Blogs
                    </h1>
                </div>
            </div>

            {/* Blogs Grid */}
            <section className="px-4 py-4 max-w-7xl mx-auto my-8">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage - 1);
                                        }}
                                    />
                                </PaginationItem>

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

                                {totalPages > 4 && currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}

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

export default Blogs;
