import './styles.scss'

import React from "react";
import type { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import {
    Table,
    Columns,
    Rows,
    Merge,
    Split,
    Trash2,
    SquarePlus,
    SquareMinus,
} from "lucide-react";

interface SectionThreeProps {
    editor: Editor | null;
}

export const TableSection: React.FC<SectionThreeProps> = ({ editor }) => {
    if (!editor) return null;

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="px-2 py-1 rounded-md hover:bg-gray-100">
                        <Table size={18} />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Create Table</TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-48">
                <DropdownMenuItem
                    onClick={() =>
                        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                    }
                >
                    <SquarePlus className="mr-2 h-4 w-4" /> Insert Table
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={!editor.can().addColumnBefore()}
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                    <Columns className="mr-2 h-4 w-4" /> Column Before
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={!editor.can().addColumnAfter()}
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                    <Columns className="mr-2 h-4 w-4" /> Column After
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={!editor.can().deleteColumn()}
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                    <SquareMinus className="mr-2 h-4 w-4" /> Delete Column
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={!editor.can().addRowBefore()}
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                    <Rows className="mr-2 h-4 w-4" /> Row Before
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={!editor.can().addRowAfter()}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                    <Rows className="mr-2 h-4 w-4" /> Row After
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={!editor.can().deleteRow()}
                    onClick={() => editor.chain().focus().deleteRow().run()}
                >
                    <SquareMinus className="mr-2 h-4 w-4" /> Delete Row
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={!editor.can().mergeCells()}
                    onClick={() => editor.chain().focus().mergeCells().run()}
                >
                    <Merge className="mr-2 h-4 w-4" /> Merge Cells
                </DropdownMenuItem>

                <DropdownMenuItem
                    disabled={!editor.can().splitCell()}
                    onClick={() => editor.chain().focus().splitCell().run()}
                >
                    <Split className="mr-2 h-4 w-4" /> Split Cells
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={!editor.can().deleteTable()}
                    onClick={() => editor.chain().focus().deleteTable().run()}
                >
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Delete Table
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TableSection;
