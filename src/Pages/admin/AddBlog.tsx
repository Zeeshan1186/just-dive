import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addBlog, getBlogById, updateBlog, getBlogscategories } from "@/services/apiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import type { IBlog } from "@/interface/blog";

type BlogCategory = {
    id: number;
    name: string;
};

const AddBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // detect edit mode
    const isEditMode = !!id;

    const blogImageInputRef = useRef<HTMLInputElement>(null);
    const authorImageInputRef = useRef<HTMLInputElement>(null);
    const handleBlogImageClick = () => blogImageInputRef.current?.click();
    const handleAuthorImageClick = () => authorImageInputRef.current?.click();

    // const handleRemoveBlogImage = () => {
    //     setForm((prev) => ({ ...prev, blog_image: null }));
    //     setBlog((prev) => prev ? { ...prev, blog_image: "" } : undefined);
    //     setImage(undefined);
    // }
    // const handleRemoveAuthorImage = () => {
    //     setForm((prev) => ({ ...prev, author_image: null }));
    //     setBlog((prev) => prev ? { ...prev, author_image: "" } : undefined);
    //     setAuthorImage(undefined);
    // }

    const [form, setForm] = useState({
        title: "",
        author_name: "",
        description: "",
        category_id: "", // 🆕 Added category_id
        blog_image: null as File | null,
        author_image: null as File | null,
    });
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [image, setImage] = useState<File | undefined>(undefined);
    const [authorImage, setAuthorImage] = useState<File | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState<IBlog>();

    // 🆕 Fetch all categories for dropdown
    const fetchCategories = async () => {
        try {
            const res = await getBlogscategories();
            if (res.data.status === 200) {
                setCategories(res.data.data || []);
            }
        } catch (error) {
            toast.error("Failed to load categories.");
        }
    };

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            loadBlogData();
        }
    }, [id]);

    const loadBlogData = async () => {
        setLoading(true);
        try {
            const res = await getBlogById(id!);
            const data = res.data.data;
            setBlog(data);
            setForm({
                title: data.title,
                author_name: data.author_name,
                description: data.description,
                category_id: String(data.category_id), // 🆕 pre-select category
                blog_image: null, // user can re-upload
                author_image: null,
            });
        } catch (err) {
            toast.error("Failed to load blog data.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setImage(file);
            setForm((prev) => ({
                ...prev,
                [name]: file,
            }));
        }
    };

    const handleAuthorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            setAuthorImage(file);
            setForm((prev) => ({
                ...prev,
                [name]: file,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.author_name || !form.description || !form.category_id) {
            toast.error("Please fill all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("author_name", form.author_name);
        formData.append("description", form.description);
        formData.append("category_id", form.category_id); // 🆕 Add category_id
        formData.append("blog_image", form.blog_image ? form.blog_image : "");
        formData.append("author_image", form.author_image ? form.author_image : "");

        setLoading(true);
        try {
            if (isEditMode) {
                const res = await updateBlog(id!, formData);
                if (res.data.status === 200) {
                    toast.success("Blog updated successfully!");
                } else {
                    toast.error(res.data.message || "Failed to update blog.");
                }
            } else {
                const res = await addBlog(formData);
                if (res.data.status === 200) {
                    toast.success("Blog added successfully!");
                } else {
                    toast.error(res.data.message || "Failed to add blog.");
                }
            }
            navigate("/admin/blogs");
        } catch (error) {
            toast.error("An error occurred. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="m-5">
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? "Edit Blog" : "Add New Blog"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-6">
                    <div className="w-full">
                        <label className="block mb-1 font-medium">Title</label>
                        <Input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="block mb-1 font-medium">Author Name</label>
                        <Input
                            type="text"
                            name="author_name"
                            value={form.author_name}
                            onChange={handleChange}
                            placeholder="Enter author name"
                            required
                        />
                    </div>
                </div>

                {/* 🆕 Categories Dropdown */}
                <div>
                    <label className="block mb-1 font-medium">Select Category</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <Textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter blog description"
                        rows={6}
                        required
                    />
                </div>

                {/* ✅ Blog Image Upload */}
                <div className="w-full mb-4">
                    <label className="block mb-1 font-medium">Blog Image</label>
                    <div
                        className="border border-[#2A85FF] mt-2 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                        onClick={handleBlogImageClick}
                    >
                        <input
                            type="file"
                            name="blog_image"
                            accept="image/jpeg, image/png, image/jpg"
                            ref={blogImageInputRef}
                            className="absolute w-0 h-0 opacity-0 pointer-events-none"
                            onChange={handleFileChange}
                        />
                        {image || blog?.blog_image ? (
                            <img
                                src={image ? URL.createObjectURL(image) : blog?.blog_image}
                                alt="Selected"
                                className="h-52 w-full object-contain"
                            />
                        ) : (
                            <div className="text-center space-y-1 px-4 text-gray-500">
                                <p className="Poppins">File type: JPEG, PNG, JPG</p>
                                <p className="Poppins">Recommended Size: 240x350px</p>
                                {isEditMode && (
                                    <p className="text-sm text-gray-500">
                                        Current image will remain if not changed.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {form.blog_image && (
                        <div className="mt-3 flex justify-center">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={handleRemoveBlogImage}
                                className="text-[#152259] mr-2 bg-white"
                            >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button> */}
                            <Button
                                type="button"
                                className="bg-[#509CDB] cursor-pointer hover:bg-[#509CDB] text-white"
                                onClick={handleBlogImageClick}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Change Image
                            </Button>
                        </div>
                    )}
                </div>

                {/* ✅ Author Image Upload */}
                <div className="w-full mb-4">
                    <label className="block mb-1 font-medium">Author Image</label>
                    <div
                        className="border border-[#2A85FF] mt-2 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                        onClick={handleAuthorImageClick}
                    >
                        <input
                            type="file"
                            name="author_image"
                            accept="image/jpeg, image/png, image/jpg"
                            ref={authorImageInputRef}
                            className="absolute w-0 h-0 opacity-0 pointer-events-none"
                            onChange={handleAuthorFileChange}
                        />
                        {authorImage || blog?.author_image ? (
                            <img
                                src={authorImage ? URL.createObjectURL(authorImage) : blog?.author_image}
                                alt="Selected"
                                className="h-52 w-full object-contain"
                            />
                        ) : (
                            <div className="text-center space-y-1 px-4 text-gray-500">
                                <p className="Poppins">File type: JPEG, PNG, JPG</p>
                                <p className="Poppins">Recommended Size: 240x350px</p>
                                {isEditMode && (
                                    <p className="text-sm text-gray-500">
                                        Current image will remain if not changed.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {form.author_image && (
                        <div className="mt-3 flex justify-center">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={handleRemoveAuthorImage}
                                className="text-[#152259] mr-2 bg-white"
                            >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </Button> */}
                            <Button
                                type="button"
                                className="bg-[#509CDB] cursor-pointer hover:bg-[#509CDB] text-white"
                                onClick={handleAuthorImageClick}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Change Image
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/blogs")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        ) : isEditMode ? "Update Blog" : "Add Blog"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AddBlog;
