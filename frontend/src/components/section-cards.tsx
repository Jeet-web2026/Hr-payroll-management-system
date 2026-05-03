"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import apiService from "@/comon/api/apiService";
import { toast } from "sonner";

export function SectionCards() {

  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState({
    totalEmployees: 0,
    newJoinees: 0,
    activeEmployees: 0,
    joiningRate: 0,
    employeeGrowthRate: 0,
    newJoineesRate: 0,
  });

  const fetchDashboardData = async () => {
    setIsPending(true);
    try {
      const res = await apiService.get('/dashboard', {});
      setData(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data", { position: "top-right", richColors: true });
    } finally {
      setIsPending(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {isPending ?
        <>
          <Skeleton className="h-35 w-full rounded-md" />
          <Skeleton className="h-35 w-full rounded-md" />
          <Skeleton className="h-35 w-full rounded-md" />
          <Skeleton className="h-35 w-full rounded-md" />
        </>
        :
        <>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Employees</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.totalEmployees}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUpIcon
                  />
                  {data.employeeGrowthRate > 0 ? `+${data.employeeGrowthRate}%` : `${data.employeeGrowthRate}%`}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Trending up this month{" "}
                <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Visitors for the last 6 months
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>New Joinees</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.newJoinees}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingDownIcon
                  />
                  {data.newJoineesRate > 0 ? `+${data.newJoineesRate}%` : `${data.newJoineesRate}%`}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Down 20% this period{" "}
                <TrendingDownIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Acquisition needs attention
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Active Employees</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.activeEmployees}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUpIcon
                  />
                  +12.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Strong user retention{" "}
                <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Engagement exceed targets</div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Joining Rate</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.joiningRate}%
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendingUpIcon
                  />
                  +4.5%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Steady performance increase{" "}
                <TrendingUpIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">Meets growth projections</div>
            </CardFooter>
          </Card>
        </>
      }
    </div>
  )
}
