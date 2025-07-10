import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from './ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Loader2 } from 'lucide-react';

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#A700FF",
    },
} satisfies ChartConfig

export default function RevenueChart({ chartData, isLoading }: { chartData?: any, isLoading: boolean }) {
    const hasChartData = chartData?.some((chart: any) => chart.revenue > 0);

    return (
        <Card className='mx-2 border-gray-300'>
            <CardHeader>
                <CardTitle>Package Wise Revenue</CardTitle>
            </CardHeader>
            {!isLoading ?
                <CardContent className='border-gray-300'>
                    {hasChartData ? (
                        <ChartContainer config={chartConfig} className='h-80 w-full'>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 6)}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            className="w-[150px]"
                                        />
                                    }
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Line
                                    dataKey="revenue"
                                    type="monotone"
                                    stroke="var(--color-revenue)"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-revenue)",
                                    }}
                                    activeDot={{
                                        r: 6,
                                    }}
                                />
                            </LineChart>
                        </ChartContainer>
                    ) : (
                        <div className="h-40 flex justify-center items-center text-lg text-gray-500">
                            No data found
                        </div>
                    )}
                </CardContent>
                : <div className='h-40 flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div>
            }
        </Card>
    )
}
