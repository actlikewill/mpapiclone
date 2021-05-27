import  { Document, model, Schema, ObjectId } from 'mongoose'
import { compare, hash } from 'bcryptjs'
import { BCRYPT_WORK_FACTOR } from '../../config'

export interface UserDocument extends Document {
    email: string
    name: string
    password: string
    isEmailVerified: boolean
    company: ObjectId | null
    role: string
    matchesPassword: ( password: string ) => Promise<boolean>
}

export enum EUserRoles {
    Admin = 'Admin',
    Employee = 'Employee',
    Unassigned = 'Unassigned'
}
 
const userSchema = new Schema <UserDocument> ( { 
        email: String,
        name: String,
        password: String,
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            default: null,
            required: false
        },
        role: {
            type: String,
            default: EUserRoles.Unassigned,
            enum: Object.values(EUserRoles)
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform( doc , ret ) {
                ret.id = ret._id
                delete ret._id
                delete ret.password
                delete ret.__v
                delete ret.createdAt,
                delete ret.updatedAt
            },
        },
    } 
)

userSchema.pre ( 'save', async function () { 
    if ( this.isModified ( 'password') ) {
        this.password = await hash ( this.password, BCRYPT_WORK_FACTOR )
    }
} )

userSchema.methods.matchesPassword  = function ( password : string ) {
    return compare ( password, this.password ) 
}

export const User = model <UserDocument> ( 'User', userSchema )