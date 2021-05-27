import { Document, model, Schema } from 'mongoose'

interface CompanyTypeDocument extends Document {
    companyType: string
}

enum ECompanyType {
    Vendor = 'Vendor',
    Buyer = 'Buyer',
    BuyerAndSeller = 'BuyerAndSeller'
}

const companyTypeSchema = new Schema <CompanyTypeDocument> ({
    companyType: {
        type: ECompanyType,
        required: true
    }
})

export const CompanyType = model <CompanyTypeDocument> ( 'CompanyType', companyTypeSchema )
