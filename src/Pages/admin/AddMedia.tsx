import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Trash2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addMedia, getMedia, deleteMedia } from "../../services/apiService";

interface UploadedImage {
    id: number;
    images: string; // assuming API returns { id, images: "url" }
}

const imageSchema = z.object({
    images: z
        .array(z.instanceof(File))
        .min(1, "At least one image is required")
        .superRefine((files, ctx) => {
            files.forEach((file, index) => {
                if (file.size > 5 * 1024 * 1024) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${file.name} is larger than 5MB`,
                        path: [index],
                    });
                }
            });
        }),
});

export default function AddMedia({ onMediaUploaded }: { onMediaUploaded?: () => void; }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isLoadingGallery, setIsLoadingGallery] = useState(false);

    const form = useForm<z.infer<typeof imageSchema>>({
        resolver: zodResolver(imageSchema),
        defaultValues: {
            images: [],
        },
    });

    const fetchUploadedImages = async () => {
        setIsLoadingGallery(true);
        try {
            const res = await getMedia();
            if (res.data.status === 200) {
                setUploadedImages(res.data.data || []);
            } else {
                toast.error(res.data.message || "Failed to load media.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching media.");
        } finally {
            setIsLoadingGallery(false);
        }
    };

    useEffect(() => {
        fetchUploadedImages();
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            const uniqueFiles = newFiles.filter(
                (file) => !images.some((img) => img.name === file.name && img.size === file.size)
            );

            if (uniqueFiles.length < newFiles.length) {
                toast.error("Some duplicate images were skipped.");
            }

            const updatedImages = [...images, ...uniqueFiles];
            setImages(updatedImages);
            form.setValue("images", updatedImages, { shouldValidate: true });
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        form.setValue("images", updatedImages, { shouldValidate: true });
    };

    const onSubmit = async () => {
        if (images.length === 0) {
            toast.error("Please select at least one image to upload.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            images.forEach((file) => {
                formData.append("images[]", file); // adjust key if API needs "images" not "images[]"
            });

            const res = await addMedia(formData);
            if (res.data.status === 200 || res.data.status === 201) {
                toast.success(res.data.message || "Images uploaded successfully!");
                setImages([]); // Clear local selected files
                form.reset();
                fetchUploadedImages(); // Refresh gallery
                if (onMediaUploaded) onMediaUploaded(); // Refresh Media page too
            } else {
                toast.error(res.data.message || "Failed to upload images.");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const res = await deleteMedia(id);
            if (res.data.status === 200) {
                toast.success(res.data.message || "Image deleted.");
                fetchUploadedImages(); // Refresh gallery
                if (onMediaUploaded) onMediaUploaded();
            } else {
                toast.error(res.data.message || "Failed to delete image.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting image.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Media</h2>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                            <FormItem>
                                <FormLabel className="Poppins">Select and Upload Images *</FormLabel>
                                <div
                                    className="border border-black mt-2 rounded-2xl border-dashed flex flex-wrap gap-2 p-4 bg-gray-50 cursor-pointer"
                                    onClick={handleClick}
                                >
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg"
                                        multiple
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {images.length > 0 ? (
                                        images.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`Selected ${index}`}
                                                    className="object-cover rounded h-28 w-28"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="absolute -top-2 -right-2 p-1 cursor-pointer bg-white rounded-full shadow"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage(index);
                                                    }}
                                                >
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center Poppins text-gray-500 w-full">
                                            Click to add images (JPEG, PNG, JPG)
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={onSubmit}
                            disabled={isUploading}
                            className="mt-4 bg-[#232323] cursor-pointer text-white hover:bg-white hover:text-[#232323] uppercase tracking-wide font-medium border hover:cursor-pointer"
                        >
                            {isUploading ? "Uploading..." : "Upload Images"}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* 🔥 Uploaded Images Gallery */}
            <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Uploaded Images</h3>
                {isLoadingGallery ? (
                    <p>Loading gallery...</p>
                ) : uploadedImages.length === 0 ? (
                    <p className="text-gray-500">No images uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {uploadedImages.map((img) => (
                            <div key={img.id} className="relative group">
                                <img
                                    src={img.images}
                                    alt={`Uploaded ${img.id}`}
                                    className="object-cover rounded-lg w-full h-40"
                                />
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="absolute cursor-pointer top-2 right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 className="text-red-500 h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
