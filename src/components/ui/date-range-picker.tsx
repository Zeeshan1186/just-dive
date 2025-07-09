import { type FC, useState, useEffect, useRef, type JSX } from 'react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'
import { Label } from './label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './select'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { Switch } from './switch'
import { DateInput } from './date-input'

export interface DateRangePickerProps {
    onUpdate?: (values: { range: DateRange, rangeCompare?: DateRange, data?: any }) => void
    initialDateFrom?: Date | string
    initialDateTo?: Date | string
    initialCompareFrom?: Date | string
    initialCompareTo?: Date | string
    align?: 'start' | 'center' | 'end'
    locale?: string
    showCompare?: boolean,
    btnStyle?: any;
}

const formatDate = (date: Date, locale: string = 'en-us'): string => {
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
    if (typeof dateInput === 'string') {
        const parts = dateInput.split('-').map((part) => parseInt(part, 10))
        const date = new Date(parts[0], parts[1] - 1, parts[2])
        return date
    } else {
        return dateInput
    }
}

interface DateRange {
    from: Date
    to: Date | undefined
}

interface Preset {
    name: string
    label: string
}

// Define presets
const PRESETS: Preset[] = [
    { name: 'thisMonth', label: 'This Month' },
    { name: 'today', label: 'Today' },
    { name: 'thisWeek', label: 'This Week' },
    { name: 'lastWeek', label: 'Last Week' },
    { name: 'lastMonth', label: 'Last Month' },
    { name: 'lastYear', label: 'Last Year' },
    { name: 'thisYear', label: 'This Year' },
]

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> & {
    filePath: string
} = ({
    initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
    initialDateTo,
    initialCompareFrom,
    initialCompareTo,
    onUpdate,
    align = 'end',
    locale = 'en-US',
    showCompare = true,
    btnStyle,
}): JSX.Element => {
        const [isOpen, setIsOpen] = useState(false)
        const [presetData, setPresetData] = useState<string>("");

        const [range, setRange] = useState<DateRange>({
            from: getDateAdjustedForTimezone(initialDateFrom),
            to: initialDateTo
                ? getDateAdjustedForTimezone(initialDateTo)
                : getDateAdjustedForTimezone(initialDateFrom),
        })
        const [rangeCompare, setRangeCompare] = useState<DateRange | undefined>(
            initialCompareFrom
                ? {
                    from: new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0)),
                    to: initialCompareTo
                        ? new Date(new Date(initialCompareTo).setHours(0, 0, 0, 0))
                        : new Date(new Date(initialCompareFrom).setHours(0, 0, 0, 0))
                }
                : undefined
        )

        // Refs to store the values of range and rangeCompare when the date picker is opened
        const openedRangeRef = useRef<DateRange | undefined>(undefined)
        const openedRangeCompareRef = useRef<DateRange | undefined>(undefined)

        const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined)

        const [isSmallScreen, setIsSmallScreen] = useState(
            typeof window !== 'undefined' ? window.innerWidth < 960 : false
        )

        useEffect(() => {
            const handleResize = (): void => {
                setIsSmallScreen(window.innerWidth < 960)
            }

            window.addEventListener('resize', handleResize)

            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        const getPresetRange = (presetName: string): DateRange => {
            const preset = PRESETS.find(({ name }) => name === presetName)
            if (!preset) throw new Error(`Unknown date range preset: ${presetName}`)
            const from = new Date()
            const to = new Date()

            switch (preset.name) {
                case 'today':
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break;
                case 'thisWeek':
                    from.setDate(from.getDate() - from.getDay() + 1); // Monday
                    to.setDate(from.getDate() + 6); // Sunday
                    from.setHours(0, 0, 0, 0);
                    to.setHours(23, 59, 59, 999);
                    break;
                case 'lastWeek':
                    from.setDate(from.getDate() - 7 - from.getDay())
                    to.setDate(to.getDate() - to.getDay() - 1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisMonth':
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastMonth':
                    from.setMonth(from.getMonth() - 1)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setDate(0)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'lastYear':
                    from.setFullYear(from.getFullYear() - 1);
                    from.setMonth(0)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setFullYear(to.getFullYear() - 1);
                    to.setMonth(11);
                    to.setDate(31)
                    to.setHours(23, 59, 59, 999)
                    break
                case 'thisYear':
                    from.setMonth(0)
                    from.setDate(1)
                    from.setHours(0, 0, 0, 0)
                    to.setHours(23, 59, 59, 999)
                    break
            }

            return { from, to }
        }

        const setPreset = (preset: string): void => {
            const range = getPresetRange(preset)
            setRange(range)
            if (rangeCompare) {
                const rangeCompare = {
                    from: new Date(
                        range.from.getFullYear() - 1,
                        range.from.getMonth(),
                        range.from.getDate()
                    ),
                    to: range.to
                        ? new Date(
                            range.to.getFullYear() - 1,
                            range.to.getMonth(),
                            range.to.getDate()
                        )
                        : undefined
                }
                setRangeCompare(rangeCompare)
            }
        }

        const checkPreset = (): void => {
            for (const preset of PRESETS) {
                const presetRange = getPresetRange(preset.name)

                const normalizedRangeFrom = new Date(range.from);
                normalizedRangeFrom.setHours(0, 0, 0, 0);
                const normalizedPresetFrom = new Date(
                    presetRange.from.setHours(0, 0, 0, 0)
                )

                const normalizedRangeTo = new Date(range.to ?? 0);
                normalizedRangeTo.setHours(0, 0, 0, 0);
                const normalizedPresetTo = new Date(
                    presetRange.to?.setHours(0, 0, 0, 0) ?? 0
                )

                if (
                    normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
                    normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
                ) {
                    setSelectedPreset(preset.name)
                    return
                }
            }

            setSelectedPreset(undefined)
        }

        const resetValues = (): void => {
            setRange({
                from:
                    typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom,
                to: initialDateTo
                    ? typeof initialDateTo === 'string'
                        ? getDateAdjustedForTimezone(initialDateTo)
                        : initialDateTo
                    : typeof initialDateFrom === 'string'
                        ? getDateAdjustedForTimezone(initialDateFrom)
                        : initialDateFrom
            })
            setRangeCompare(
                initialCompareFrom
                    ? {
                        from:
                            typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom,
                        to: initialCompareTo
                            ? typeof initialCompareTo === 'string'
                                ? getDateAdjustedForTimezone(initialCompareTo)
                                : initialCompareTo
                            : typeof initialCompareFrom === 'string'
                                ? getDateAdjustedForTimezone(initialCompareFrom)
                                : initialCompareFrom
                    }
                    : undefined
            )
        }

        useEffect(() => {
            checkPreset()
        }, [range])

        const PresetButton = ({
            preset,
            label,
            isSelected
        }: {
            preset: string
            label: string
            isSelected: boolean
        }): JSX.Element => (
            <Button
                className={cn(isSelected && 'pointer-events-none')}
                variant="ghost"
                onClick={() => {
                    setPreset(preset);
                    setPresetData(preset);
                }}
            >
                <>
                    <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
                        <CheckIcon width={18} height={18} />
                    </span>
                    {label}
                </>
            </Button>
        )

        // Helper function to check if two date ranges are equal
        const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
            if (!a || !b) return a === b // If either is undefined, return true if both are undefined
            return (
                a.from.getTime() === b.from.getTime() &&
                (!a.to || !b.to || a.to.getTime() === b.to.getTime())
            )
        }

        useEffect(() => {
            if (isOpen) {
                openedRangeRef.current = range
                openedRangeCompareRef.current = rangeCompare
            }
        }, [isOpen])

        useEffect(() => {
            setPreset("thisMonth");
            setSelectedPreset("thisMonth");
            setPresetData("thisMonth");
        }, []);

        return (
            <Popover
                // modal={true}
                open={isOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        resetValues()
                    }
                    setIsOpen(open)
                }}
            >
                <PopoverTrigger asChild className='border-gray-300'>
                    <Button size={'lg'} variant="outline"
                        className={`text-black bg-transparent  hover:bg-gray-100 ${btnStyle}`}>
                        <div className="text-right">
                            <div className="py-1">
                                <div>{`${formatDate(range.from, locale)}${range.to != null ? ' - ' + formatDate(range.to, locale) : ''
                                    }`}</div>
                            </div>
                            {rangeCompare != null && (
                                <div className="opacity-60 text-xs -mt-1">
                                    <>
                                        vs. {formatDate(rangeCompare.from, locale)}
                                        {rangeCompare.to != null
                                            ? ` - ${formatDate(rangeCompare.to, locale)}`
                                            : ''}
                                    </>
                                </div>
                            )}
                        </div>
                        <div className="pl-1 opacity-60 -mr-2 scale-125">
                            {isOpen ? (<ChevronUpIcon width={24} />) : (<ChevronDownIcon width={24} />)}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align={align}
                    className="w-auto max-h-[90vh] overflow-y-auto border-gray-300">
                    <div className="flex pt-2">
                        <div className="flex">
                            <div className="flex flex-col">
                                <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                                    {showCompare && (
                                        <div className="flex items-center space-x-2 pr-4 py-1">
                                            <Switch
                                                defaultChecked={Boolean(rangeCompare)}
                                                onCheckedChange={(checked: boolean) => {
                                                    if (checked) {
                                                        if (!range.to) {
                                                            setRange({
                                                                from: range.from,
                                                                to: range.from
                                                            })
                                                        }
                                                        setRangeCompare({
                                                            from: new Date(
                                                                range.from.getFullYear(),
                                                                range.from.getMonth(),
                                                                range.from.getDate() - 365
                                                            ),
                                                            to: range.to
                                                                ? new Date(
                                                                    range.to.getFullYear() - 1,
                                                                    range.to.getMonth(),
                                                                    range.to.getDate()
                                                                )
                                                                : new Date(
                                                                    range.from.getFullYear() - 1,
                                                                    range.from.getMonth(),
                                                                    range.from.getDate()
                                                                )
                                                        })
                                                    } else {
                                                        setRangeCompare(undefined)
                                                    }
                                                }}
                                                id="compare-mode"
                                            />
                                            <Label htmlFor="compare-mode">Compare</Label>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <DateInput
                                                value={range.from}
                                                onChange={(date) => {
                                                    const toDate =
                                                        range.to == null || date > range.to ? date : range.to
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: date,
                                                        to: toDate
                                                    }))
                                                    setPresetData("");
                                                }}
                                            />
                                            <div className="py-1">-</div>
                                            <DateInput
                                                value={range.to}
                                                onChange={(date) => {
                                                    const fromDate = date < range.from ? date : range.from
                                                    setRange((prevRange) => ({
                                                        ...prevRange,
                                                        from: fromDate,
                                                        to: date
                                                    }))
                                                    setPresetData("");
                                                }}
                                            />
                                        </div>
                                        {rangeCompare != null && (
                                            <div className="flex gap-2">
                                                <DateInput
                                                    value={rangeCompare?.from}
                                                    onChange={(date) => {
                                                        if (rangeCompare) {
                                                            const compareToDate =
                                                                rangeCompare.to == null || date > rangeCompare.to
                                                                    ? date
                                                                    : rangeCompare.to
                                                            setRangeCompare((prevRangeCompare) => ({
                                                                ...prevRangeCompare,
                                                                from: date,
                                                                to: compareToDate
                                                            }))
                                                        } else {
                                                            setRangeCompare({
                                                                from: date,
                                                                to: new Date()
                                                            })
                                                        }
                                                    }}
                                                />
                                                <div className="py-1">-</div>
                                                <DateInput
                                                    value={rangeCompare?.to}
                                                    onChange={(date) => {
                                                        if (rangeCompare && rangeCompare.from) {
                                                            const compareFromDate =
                                                                date < rangeCompare.from
                                                                    ? date
                                                                    : rangeCompare.from
                                                            setRangeCompare({
                                                                ...rangeCompare,
                                                                from: compareFromDate,
                                                                to: date
                                                            })
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isSmallScreen && (
                                    <Select defaultValue={selectedPreset} onValueChange={
                                        (value) => {
                                            setPreset(value);
                                            setPresetData(value);
                                        }}>
                                        <SelectTrigger className="w-[180px] mx-auto mb-2">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent className='border-gray-300'>
                                            {PRESETS.map((preset) => (
                                                <SelectItem key={preset.name} value={preset.name}>
                                                    {preset.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <div>
                                    <Calendar
                                        mode="range"
                                        onSelect={(value: { from?: Date, to?: Date } | undefined) => {
                                            if (value?.from != null) {
                                                setRange({ from: value.from, to: value?.to })
                                            }
                                        }}
                                        selected={range}
                                        numberOfMonths={isSmallScreen ? 1 : 2}
                                        defaultMonth={
                                            new Date(
                                                new Date().setMonth(
                                                    new Date().getMonth() - (isSmallScreen ? 0 : 1)
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        {!isSmallScreen && (
                            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                                    {PRESETS.map((preset) => (
                                        <PresetButton
                                            key={preset.name}
                                            preset={preset.name}
                                            label={preset.label}
                                            isSelected={selectedPreset === preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-0 pt-0 gap-2 pr-4">
                        <Button
                            onClick={() => {
                                setIsOpen(false)
                                resetValues()
                            }}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                setIsOpen(false)
                                if (
                                    !areRangesEqual(range, openedRangeRef.current) ||
                                    !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                                ) {
                                    onUpdate?.({
                                        range, rangeCompare, data: selectedPreset !== undefined ? presetData : "",
                                    })
                                }
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        )
    }

DateRangePicker.displayName = 'DateRangePicker'
DateRangePicker.filePath =
    'libs/shared/ui-kit/src/lib/date-range-picker/date-range-picker.tsx'