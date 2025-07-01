// BlogDetailPage.tsx
import {
    CalendarDays,
    Folder,
    User,
    Search,
    Facebook,
    Instagram,
    Twitter,
} from "lucide-react";
import { blogPost, categories, relatedPosts } from "./data";

const BlogDetailPage = () => {
    return (
        <div className="flex flex-col md:flex-col max-w-6xl mx-auto px-4 py-8 gap-8">
            {/* Left - Blog Content */}

            <div className="flex gap-10">
                <div className="flex-1 w-full">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <CalendarDays size={16} />
                            <span>{blogPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Folder size={16} />
                            <span>{blogPost.categories.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>By {blogPost.author.name}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h1>

                    <img
                        src={blogPost.image}
                        alt="Blog"
                        className="rounded-lg mb-6 w-full object-cover"
                    />

                    <div className="text-gray-700 leading-relaxed space-y-4">
                        {blogPost.content.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>

                {/* Right - Sidebar */}
                <aside className="w-[25%] space-y-8">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Enter your keywords..."
                            className="w-full border rounded-md py-2 px-4 pr-10"
                        />
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Author Card */}
                    <div className="bg-white p-6 rounded-md shadow text-center">
                        <img
                            src={blogPost.author.image}
                            alt={blogPost.author.name}
                            className="w-20 h-20 rounded-full mx-auto mb-4"
                        />
                        <h3 className="font-semibold text-lg">{blogPost.author.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{blogPost.author.role}</p>
                        <p className="text-sm text-gray-600 mb-4">{blogPost.author.bio}</p>
                        <div className="flex justify-center gap-4">
                            <Facebook className="w-5 h-5 text-gray-600" />
                            <Twitter className="w-5 h-5 text-gray-600" />
                            <Instagram className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Categories</h4>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li
                                    key={cat}
                                    className="text-sm text-gray-600 hover:text-[#b89d53] cursor-pointer"
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* Related Posts */}
            <div className="w-full mt-12">
                <h3 className="text-2xl font-bold mb-4">Related Posts</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
                        <div
                            key={post.id}
                            className="rounded-md shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="h-40 w-full object-cover"
                            />
                            <div className="p-4">
                                <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                                <p className="text-sm text-gray-500">{post.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;