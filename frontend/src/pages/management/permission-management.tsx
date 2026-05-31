import { DashboardLayout } from "@/comon/dashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const PermissionManagement = () => {
  return (
    <DashboardLayout sideHeader="Permission Management">
      <div className="p-5">
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

              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
