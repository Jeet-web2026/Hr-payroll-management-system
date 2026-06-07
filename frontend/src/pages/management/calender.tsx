import { DashboardLayout } from "@/comon/dashboardLayout"
import { Calendar } from "@/components/ui/calendar"
import { addDays } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export const Calender = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 12),
        to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
    })
    return (
        <DashboardLayout sideHeader="Holiday Management">
            <div className="p-5">
                <Card className="mx-auto w-full h-screen p-0">
                    <CardContent className="p-0">
                        <Calendar
                            className="w-full h-full"
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
