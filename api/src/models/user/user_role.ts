import  { Document, model, Schema } from 'mongoose'

interface UserRoleDocument extends Document {
    userRole: string
}

enum EUserRoles {
    SiteAdmin = 'SiteAdmin',
    CompanyAdmin = 'CompanyAdmin',
    CompanyEmployee = 'CompanyEmployee',
    Unassigned = 'Unassigned'
}
const userRoleSchema = new Schema <UserRoleDocument> ( { 
    userRole: String

    }
)

export const UserRole = model <UserRoleDocument> ( 'UserRole', userRoleSchema )