import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { MinimalTiptapEditor } from "./minimal-tiptap";
// import RichTextEditor from "react-rte";

interface TextEditorProps {
    markup: string;
    onChange: (value: string) => void;
    placeholder?: string
}

const TextEditor: React.FC<TextEditorProps> = ({ markup, onChange, placeholder }) => {
    const [, setValue] = useState<string>();
    const [content, setContent] = React.useState(markup);

    React.useEffect(() => {
        setContent(markup);
    }, [markup]);

    React.useEffect(() => {
        setContent(markup);
    }, [markup]);

    const editorRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (newValue: any) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue.toString("html"));
        }
    };

    return (
        <div ref={editorRef}>
            <MinimalTiptapEditor
                throttleDelay={2000}
                className={cn("h-full min-h-56 w-full rounded-lg")}
                editorContentClassName="overflow-auto h-full"
                output="html"
                placeholder={`${placeholder ? placeholder : "Type your description here..."}`}
                editable={true}
                editorClassName="focus:outline-none px-5 py-4 h-full"
                value={content}
                onChange={(value) => {
                    handleChange(value);
                }}
            />
        </div>
    );
};

export default TextEditor;
