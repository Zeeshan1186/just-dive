import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, MoreHorizontal } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import type { IPackage } from '@/interface/package';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { toast } from 'sonner';
import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import { enableDisablePackage } from '@/services/apiService';

export default function PackageRowActions({ row }: { row: Row<IPackage> }) {
    const navigate = useNavigate();
    const packageId = row.original.id;
    const [isDisabled, setIsDisabled] = useState<boolean>(row.original?.is_active);

    const disablePackage = async (value: boolean) => {
        try {
            const res = await enableDisablePackage(packageId, value);
            if (res.data.status === HTTP_CODE.SUCCESS_CODE) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    }

    const handleSwitchChange = async (value: boolean) => {
        setIsDisabled(value);
        await disablePackage(value);
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='border border-gray-200'>
                    <DropdownMenuItem
                        className="mb-1 Poppins"
                        onClick={() => {
                            navigate(`/admin/package/edit/${row.original.id}`);
                        }}
                    >
                        <Edit className="h-2 w-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-b border border-gray-200" />
                    <DropdownMenuItem className="px-0" >
                        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                            <Switch id="enabled" className="scale-75 data-[state=checked]:bg-black"
                                checked={isDisabled}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="enabled" className='Poppins'>{isDisabled ? "Enabled" : "Disabled"}</Label>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}
