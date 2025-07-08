import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addTermscondition, updateTermscondition } from "@/services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const schema = z.object({
    id: z.number().optional(), // Allow id for edit mode
    title: z.string().min(1, "Title is required"),
    descriptions: z.array(
        z.object({
            text: z.string().min(1, "Description is required"),
        })
    ).min(1, "At least one description is required"),
});


type FormData = z.infer<typeof schema>;

export default function AdminTermsCondition() {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            descriptions: [{ text: "" }],
        },
    });

    const { control, handleSubmit, formState } = form;
    const { isSubmitting } = formState;
    // Inside your component
    const location = useLocation();
    const navigate = useNavigate();

    // Get passed term data if present
    const existingTerm = location.state as FormData | undefined;

    // Prefill form if editing
    useEffect(() => {
        if (existingTerm) {
            form.reset({
                title: existingTerm.title,
                descriptions: Array.isArray(existingTerm.descriptions)
                    ? existingTerm.descriptions.map((desc) =>
                        typeof desc === "string" ? { text: desc } : desc
                    )
                    : [],
            });
        }
    }, [existingTerm, form]);


    const {
        fields: descriptionFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "descriptions",
    });

    const onSubmit = async (data: FormData) => {
        const payload = {
            title: data.title,
            descriptions: data.descriptions.map((d) => d.text),
        };

        try {
            if (data.id) {
                // Update existing
                const res = await updateTermscondition(data.id, payload);
                if (res.data.status === 200) {
                    toast.success(res.data.message || "Terms & Conditions updated successfully!");
                    navigate('/admin/Termscondition'); // Redirect to dashboard
                } else {
                    toast.error(res.data.message || "Failed to update Terms & Conditions.");
                }
            } else {
                // Add new
                const res = await addTermscondition(payload);
                if (res.data.status === 200) {
                    toast.success(res.data.message || "Terms & Conditions added successfully!");
                    navigate('/admin/Termscondition');
                } else {
                    toast.error(res.data.message || "Failed to add Terms & Conditions.");
                }
            }
        } catch (error) {
            console.error("Error saving Terms & Conditions:", error);
            toast.error("An error occurred while saving Terms & Conditions.");
        }
    };


    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Add Terms And Condition</h2>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title Field */}
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title *</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description Fields */}
                    <div>
                        <FormLabel>Descriptions *</FormLabel>
                        {descriptionFields.map((field, index) => (
                            <div key={field.id} className="relative mt-2">
                                <FormField
                                    control={control}
                                    name={`descriptions.${index}.text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea {...field} placeholder={`Description ${index + 1}`} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {descriptionFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="absolute top-2 right-2 text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ text: "" })}
                            className="mt-3"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Add More
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
