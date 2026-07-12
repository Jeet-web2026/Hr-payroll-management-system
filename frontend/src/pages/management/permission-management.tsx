import apiService from "@/comon/api/apiService"
import { DashboardLayout } from "@/comon/dashboardLayout"
import type { UserDatatype } from "@/comon/types/userDatatype"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCurrentUser } from "@/hooks/userData"
import { BadgeAlert, BadgeCheckIcon, CirclePower, Edit, PlusCircleIcon, ScanEye } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export const PermissionManagement = () => {
  type Meta = {
    currentPage?: number;
    lastPage?: number;
    limit?: number;
    nextPage?: number;
    total?: number;
  };
  const [data, setData] = useState<UserDatatype[]>([]);
  const [loading, isLoading] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  let page = 1;
  let limit = 10;
  const { data: currentUser } = useCurrentUser();
  const canAddUser =
    currentUser?.role === 'hr'
      ? currentUser?.usersPermissionManagement?.employeeManagement
      : currentUser?.usersPermissionManagement?.manageUser;
  const fetchUsers = async () => {
    try {
      isLoading(true)
      const users = await apiService.get(`/user/all?page=${page}&limit=${limit}&activity=permission-management`, {});
      setData(users.data?.data);
      setMeta(users.data?.meta);
    } catch (error) {
      toast.error("Failed to fetch user data", { position: "top-right", richColors: true });
    } finally {
      isLoading(false);
    }
  };

  const suspendUser = async (userId: any) => {
    try {
      await apiService.delete(`/user/delete/${userId}`, {});
      await fetchUsers();

      setTimeout(() => {
        toast.success("User suspended successfully", {
          position: "top-right",
          richColors: true,
        });
      }, 500);

    } catch (error) {
      toast.error("Failed to suspend user", {
        position: "top-right",
        richColors: true,
      });
    }
  };

  const permanentDelete = async (userId: any) => {
    try {
      await apiService.delete(`/v2/user/delete/${userId}?permanentDelete=true`, {});
      await fetchUsers();

      setTimeout(() => {
        toast.success("User deleted successfully", {
          position: "top-right",
          richColors: true,
        });
      }, 500);
    } catch (error) {
      toast.error("Failed to delete user", {
        position: "top-right",
        richColors: true,
      });
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <DashboardLayout sideHeader="Permission Management">
      <div className="p-5">
        {loading &&
          <>
            <div className="flex flex-col gap-6">
              <Skeleton className="h-140 w-full rounded-md" />
            </div>
          </>
        }
        {!loading &&
          <>
            <Card>
              <CardContent>
                {canAddUser && (
                  <Link to="/user/add" className="border px-2 rounded float-end mb-3 bg-green-700 py-2 flex flex-row items-center gap-2">
                    <PlusCircleIcon className="size-4" />
                    Add user
                  </Link>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="border text-base">
                      <TableHead className="border-r">Status</TableHead>
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
                          <TableCell className={`border capitalize`}>
                            <Badge className={`${user.status && user.status === 'active' ? `bg-green-700 text-white` : `bg-zinc-700 text-white`}`}>{user.status}</Badge>
                          </TableCell>
                          <TableCell className="border capitalize">
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

                              <Dialog>
                                {user.status === "active" ? (
                                  <DialogTrigger className="rounded border border-red-700 bg-red-950 p-2 cursor-pointer">
                                    <CirclePower size={16} />
                                  </DialogTrigger>
                                ) : (
                                  <>
                                    <Button className="rounded border border-red-700 bg-red-950 p-2 py-4 text-muted-foreground cursor-not-allowed" title="User is already suspended">
                                      <CirclePower size={16} />
                                    </Button>
                                  </>
                                )}
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Suspend User Account</DialogTitle>
                                    <hr className="my-2" />
                                    <DialogDescription className="mb-3">
                                      You are about to suspend this user account.
                                      The user will no longer be able to log in, access the system, or perform any actions until the account is reactivated.

                                      Existing records, activities, and associated data will remain intact and can be restored at any time by reactivating the account.
                                    </DialogDescription>
                                  </DialogHeader>

                                  <DialogFooter>
                                    <Button variant="secondary" onClick={() => permanentDelete(user.id)}>
                                      Delete Permanently
                                    </Button>
                                    <Button variant="destructive" onClick={() => suspendUser(user.id)}>
                                      Suspend User
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
                <div className="flex flex-row justify-between items-center mt-4">
                  {meta && <span className="text-sm text-muted-foreground">
                    Showing {meta?.total} of {meta?.total} entries
                  </span>}
                </div>
              </CardContent>
            </Card>
          </>
        }
      </div>
    </DashboardLayout>
  )
}
