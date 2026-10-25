import { useState } from "react";
import { DashboardLayout } from "@/comon/dashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LinkIcon, MoreHorizontal } from "lucide-react";

type RequestStatus = "new" | "approved" | "rejected";

interface JoiningRequest {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status: RequestStatus;
    createdAt: string;
}

const STATIC_REQUESTS: JoiningRequest[] = [
    { id: "1", name: "Rahul Sharma", email: "rahul.sharma@example.com", phone: "9876543210", status: "new", createdAt: "2026-10-24T09:15:00Z" },
    { id: "2", name: "Priya Das", email: "priya.das@example.com", phone: "9123456780", status: "approved", createdAt: "2026-10-23T14:40:00Z" },
    { id: "3", name: "Amit Banerjee", email: "amit.b@example.com", phone: null, status: "rejected", createdAt: "2026-10-22T11:05:00Z" },
    { id: "4", name: "Sneha Roy", email: "sneha.roy@example.com", phone: "9988776655", status: "new", createdAt: "2026-10-21T17:30:00Z" },
    { id: "5", name: "Arjun Mehta", email: "arjun.mehta@example.com", phone: "9090909090", status: "approved", createdAt: "2026-10-20T08:20:00Z" },
    { id: "6", name: "Neha Gupta", email: "neha.gupta@example.com", phone: null, status: "new", createdAt: "2026-10-19T19:50:00Z" },
];

const STATUS_STYLES: Record<RequestStatus, string> = {
    new: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    approved: "bg-green-100 text-green-700 hover:bg-green-100",
    rejected: "bg-red-100 text-red-700 hover:bg-red-100",
};

const COLUMNS = 6;

export const JoininRequests = () => {
    const [data, setData] = useState<JoiningRequest[]>(STATIC_REQUESTS);
    const [selected, setSelected] = useState<JoiningRequest | null>(null);
    const [copied, setCopied] = useState(false);
    const isLoading = false;

    const setStatus = (id: string, status: RequestStatus) =>
        setData((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    const onView = (row: JoiningRequest) => setSelected(row);
    const onApprove = (row: JoiningRequest) => setStatus(row.id, "approved");
    const onReject = (row: JoiningRequest) => setStatus(row.id, "rejected");

    const generateLink = async () => {
        const link = `${window.location.origin}/join/demo-link`;
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <DashboardLayout sideHeader="Manage Joining Requests">
            <div className="p-5">
                <Card>
                    <CardContent>
                        <div className="mb-4 flex justify-end">
                            <Button className="cursor-pointer" onClick={generateLink}>
                                <LinkIcon />
                                {copied ? "Link copied!" : "Generate link"}
                            </Button>
                        </div>

                        <Table>
                            <TableCaption className="mb-2 text-start">
                                {data.length} out of 10 joining request{data.length === 1 ? "" : "s"}
                            </TableCaption>

                            <TableHeader>
                                <TableRow className="border">
                                    <TableHead className="w-12 border-r">Sl. No.</TableHead>
                                    <TableHead className="border-r">Company Name</TableHead>
                                    <TableHead className="border-r">Email</TableHead>
                                    <TableHead className="border-r">Submitted</TableHead>
                                    <TableHead className="border-r">Status</TableHead>
                                    <TableHead className="w-16 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isLoading &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={`sk-${i}`}>
                                            {Array.from({ length: COLUMNS }).map((__, j) => (
                                                <TableCell key={j}>
                                                    <Skeleton className="h-4 w-full" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}

                                {!isLoading && data.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={COLUMNS}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            No joining requests yet.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {!isLoading &&
                                    data.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            className="cursor-pointer border-x"
                                            onClick={() => onView(row)}
                                        >
                                            <TableCell className="text-muted-foreground border-x border-b">{index + 1}</TableCell>
                                            <TableCell className="font-medium border-x border-b">{row.name}</TableCell>
                                            <TableCell className=" border-x border-b">{row.email}</TableCell>
                                            <TableCell className=" border-x border-b">
                                                {new Date(row.createdAt).toLocaleDateString(undefined, {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell className=" border-x border-b">
                                                <Badge variant="secondary" className={STATUS_STYLES[row.status]}>
                                                    {row.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell
                                                className="text-right border-x border-b"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => onView(row)}>
                                                            View details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            disabled={row.status === "approved"}
                                                            onClick={() => onApprove(row)}
                                                        >
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            disabled={row.status === "rejected"}
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => onReject(row)}
                                                        >
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {selected && (
                    <Card className="mt-4">
                        <CardContent className="space-y-1 pt-6 text-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold">{selected.name}</h3>
                                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                                    Close
                                </Button>
                            </div>
                            <p>Email: {selected.email}</p>
                            <p>Phone: {selected.phone ?? "—"}</p>
                            <p>Status: {selected.status}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
};