import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
    cancel: {
        label: "Cancel Booking",
        color: "var(--chart-1)",
    },
    confirm: {
        label: "Confirm Booking",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;


export default function BookingStatusChart({ chartData, isLoading }: { chartData: any, isLoading: boolean }) {
    const hasChartData = chartData?.some((item: any) => item.cancel > 0 || item.confirm > 0);

    return (
        <Card className='border-gray-300 mx-2'>
            <CardHeader>
                <CardTitle>Package Wise Bookings</CardTitle>
            </CardHeader>
            {!isLoading ?
                <CardContent className='border-gray-300'>
                    {hasChartData ? (
                        <ChartContainer config={chartConfig} className='h-80 w-full'>
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 6)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    domain={[0, (dataMax) => dataMax + 1]}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent
                                            className="w-40"
                                            indicator="dashed"
                                        />
                                    }
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="confirm" fill="var(--color-confirm)" radius={4} maxBarSize={60}>
                                    <LabelList dataKey="confirm" position="top" className="fill-gray-700 text-sm" />
                                </Bar>
                                <Bar dataKey="cancel" fill="var(--color-cancel)" radius={4} maxBarSize={60}>
                                    <LabelList dataKey="cancel" position="top" className="fill-gray-700 text-sm" />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    ) : (
                        <div className="h-40 flex justify-center items-center text-lg text-gray-500">
                            No data found
                        </div>
                    )}
                </CardContent>
                :
                <div className='h-40 flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div>
            }
        </Card>
    )
}
