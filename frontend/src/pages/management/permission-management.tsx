import apiService from "@/comon/api/apiService"
import { DashboardLayout } from "@/comon/dashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

  type Meta = {
    currentPage?: number;
    lastPage?: number;
    limit?: number;
    nextPage?: number;
    total?: number;
  };
  const [data, setData] = useState<User[]>([]);
  const [loading, isLoading] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);

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

  function permanentDelete() {

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

                              <Dialog>
                                <DialogTrigger className="rounded border border-red-700 bg-red-950 p-2">
                                  <Trash2Icon size={16} />
                                </DialogTrigger>
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
                                    <Button variant="secondary" onClick={permanentDelete}>
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
