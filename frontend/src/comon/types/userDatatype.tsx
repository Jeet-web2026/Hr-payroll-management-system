export type UserDatatype = {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    id?: string;
    loginStatus?: string;
    designation?: string;
    experience?: number;
    isEmailVerified?: boolean;
    lastLogin?: Date;
    phone?: number;
    profilePicture?: string;
    status?: string;
    employment?: {
        id?: string;
        employeeId?: string;
        companyName?: string;
        department?: string;
        designation?: string;
        headOfDepartment?: string;
        manager?: string;
        joiningDate?: Date;
        leavingDate?: Date;
        salary?: number;
        employmentStatus?: string;
        employmentType?: string;
        employeeCode?: string;
        workLocation?: string;
    };
    details?: {
        id?: string;
        dob?: Date;
        address?: string;
    };
};