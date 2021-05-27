import  { Document, model, Schema } from 'mongoose'

interface CompanyDocument extends Document {
    companyName: string
    companyAddress: string
    companyPhone: string
    companyType: string
}

export enum ECompanyType {
    Vendor = 'Vendor',
    Buyer = 'Buyer',
    BuyerAndSeller = 'BuyerAndSeller'
}
 
const companySchema = new Schema <CompanyDocument> ( { 
        companyName: String,
        companyAddress: String,
        companyPhone: String,
        companyEmail: String,
        companyType: {
            type: String,
            default: ECompanyType.Buyer,
            enum: Object.values(ECompanyType)
        },
        users: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        toJSON : {
            transform( doc , ret ) {
                ret.id = ret._id
                delete ret._id         
                delete ret.__v
                delete ret.createdAt,
                delete ret.updatedAt
            }
        }
    } 
)

export const Company = model <CompanyDocument> ( 'Company', companySchema )