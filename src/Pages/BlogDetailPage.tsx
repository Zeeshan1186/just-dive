import {
    CalendarDays,
    Folder,
    User,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, getBlogs } from "@/services/apiService";
import { Link } from "react-router-dom";

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blogPost, setBlogPost] = useState<any>(null);
    const [latestBlogs, setLatestBlogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await getBlogById(id as string);
                setBlogPost(res.data.data);
            } catch (err) {
                console.error("Failed to fetch blog", err);
            }
        };

        const fetchLatestBlogs = async () => {
            try {
                const res = await getBlogs();
                // Exclude current blog and sort by creation date descending
                const sorted = res.data.data
                    .filter((blog: any) => blog.id !== Number(id))
                    .sort(
                        (a: any, b: any) =>
                            new Date(b.creation_date).getTime() -
                            new Date(a.creation_date).getTime()
                    );
                setLatestBlogs(sorted.slice(0, 4)); // Take latest 4 blogs
            } catch (err) {
                console.error("Failed to fetch latest blogs", err);
            }
        };

        fetchBlog();
        fetchLatestBlogs();
    }, [id]);

    if (!blogPost) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="flex flex-col md:flex-col max-w-6xl mx-auto px-4 py-8 gap-8">
            <div className="flex gap-10">
                {/* Left - Blog Content */}
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <CalendarDays size={16} />
                            <span>{blogPost.creation_date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Folder size={16} />
                            <span>Blog</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>By {blogPost.author_name}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-3xl capitalize Poppins font-bold mb-3">{blogPost.title}</h1>

                    <img
                        src={blogPost.blog_image}
                        alt="Blog"
                        className="rounded-lg mb-6 w-full object-cover"
                    />

                    <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                        {blogPost.description}
                    </div>
                </div>

                {/* Right - Sidebar */}
                <aside className="w-[22%] space-y-8 mt-22">

                    {/* Author Card */}
                    <div className="bg-white p-6 border-1 border-[#e5e5e5] rounded-md shadow text-center">
                        <img
                            src={blogPost.author_image}
                            alt={blogPost.author_name}
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-lg">{blogPost.author_name}</h3>
                        <p className="text-sm text-gray-500 mb-4">Author</p>
                        <p className="text-sm text-gray-600 mb-4">
                            Passionate writer sharing travel & dive adventures in Goa.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Facebook className="w-5 h-5 text-gray-600" />
                            <Twitter className="w-5 h-5 text-gray-600" />
                            <Instagram className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold Poppins mb-3">Categories</h4>
                        <ul className="space-y-2">
                            <li className="text-sm text-gray-600 hover:text-[#0191e9] cursor-pointer">Blog</li>
                            {/* You can make this dynamic if needed */}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Related Posts (Placeholder for now) */}
            <div className="w-full mt-8 flex flex-col items-center px-2">
                <div className="flex justify-center items-center my-5 mb-10">
                    <span className="w-100 border-t border-dotted border-[#C3A357]"></span>
                    <span className="relative z-10 p-4 text-black text-4xl font-normal Trirong">
                        Related Posts
                    </span>
                    <span className="w-100 border-t border-dotted border-[#C3A357]"></span>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                    {/* You can fetch related posts by category later */}
                    {latestBlogs.map((blog) => (
                        <Link
                            to={`/blog/${blog.id}`}
                            key={blog.id}
                            className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition block"
                        >
                            <img
                                src={blog.blog_image}
                                alt={blog.title}
                                className="h-40 w-full object-cover"
                            />
                            <div className="p-4">
                                <h4 className="font-semibold text-[#171717] leading-6 Poppins line-clamp-2 text-lg mb-2">
                                    {blog.title}
                                </h4>
                                <p className="font-normal text-gray-700 Poppins text-sm mb-2 line-clamp-3">
                                    {blog.description}
                                </p>
                                <p className="text-sm text-gray-500">{blog.creation_date}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
