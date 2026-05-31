import apiService from "@/comon/api/apiService"
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BadgeAlert, BadgeCheckIcon, Edit, ScanEye, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export const PermissionManagement = () => {
  type User = {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    id?: string;
    loginStatus?: string;
    designation?: string;
    experience?: number;
    isEmailVerified?: boolean;
  };
  const [data, setData] = useState<User[]>([]);
  const [loading, isLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        isLoading(true)
        const users = await apiService.get('/user/all?page=1&limit=10', {});
        setData(users.data?.data);
        setMeta(users.data?.meta);
      } catch (error) {
        toast.error("Failed to fetch user data", { position: "top-right", richColors: true });
      } finally {
        isLoading(false);
      }
    };

    fetchUsers();
  }, []);
  return (
    <DashboardLayout sideHeader="Permission Management">
      <div className="p-5">
        {loading &&
          <>
            <div className="p-5 flex flex-col gap-6">
              <Skeleton className="h-140 w-full rounded-md" />
            </div>
          </>
        }
        {!loading &&
          <>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border text-base">
                      <TableHead className="border-r">Name</TableHead>
                      <TableHead className="border-r">Email</TableHead>
                      <TableHead className="border-r">Role</TableHead>
                      <TableHead className="border-r">Designation</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.length > 0 ? (
                      data.map((user) => (
                        <TableRow key={user.id} className="border">
                          <TableCell className="border">
                            {user.firstName} {user.lastName}
                          </TableCell>

                          <TableCell className="border">
                            <div className="flex items-center gap-1.5">
                              {user.isEmailVerified ? (
                                <BadgeCheckIcon size={15} className="text-blue-400" />
                              ) : (
                                <BadgeAlert size={15} className="text-red-400" />
                              )}
                              {user.email}
                            </div>
                          </TableCell>

                          <TableCell className="border capitalize">
                            {user.role}
                          </TableCell>

                          <TableCell className="border">
                            {user.designation || 'Not assigned'}
                          </TableCell>

                          <TableCell className="border">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/user/edit/${user.id}`}
                                className="rounded border border-blue-700 bg-blue-950 p-2"
                              >
                                <Edit size={16} />
                              </Link>

                              <Link
                                to={`/user/view/${user.id}`}
                                className="rounded border border-green-700 bg-green-950 p-2"
                              >
                                <ScanEye size={16} />
                              </Link>

                              <Link
                                to={`/user/delete/${user.id}`}
                                className="rounded border border-red-700 bg-red-950 p-2"
                              >
                                <Trash2Icon size={16} />
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        }
      </div>
    </DashboardLayout>
  )
}
