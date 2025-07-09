import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
    online: {
        label: "Online",
        color: "var(--chart-1)",
    },
    offline: {
        label: "Offline",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

export default function BookingChart({ chartData, isLoading }: { chartData: any, isLoading: boolean }) {
    const hasChartData = chartData?.some((item: any) => item.online > 0 || item.offline > 0);

    return (
        <Card className='border-gray-300 mx-2'>
            <CardHeader>
                <CardTitle>Total Bookings</CardTitle>
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
                                    label={{
                                        value: 'Number Of Booking',
                                        angle: -90,
                                        position: 'insideLeft',
                                        offset: 10,
                                        style: {
                                            textAnchor: 'middle',
                                            fontWeight: 600,
                                            fontSize: 13,
                                            fontFamily: 'inherit',
                                        },
                                    }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent indicator="dashed" />}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="online" fill="var(--color-online)" radius={4}
                                    maxBarSize={60}
                                />
                                <Bar dataKey="offline" fill="var(--color-offline)" radius={4}
                                    maxBarSize={60}
                                />
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
