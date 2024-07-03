import { z } from "zod"



export const updateBillingInfoSchema =  z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber : z.string().regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  billingAddress: z.string(),
  billingCity: z.string(),
  billingState: z.string().optional(),
  billingPostalCode: z.string(),
  billingCountry: z.string(),
  title: z.string(),
  isCorporate: z.boolean(),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
  taxOffice: z.string().optional(),
  companyTitle: z.string().optional(),
}).refine(data => !(data.isCorporate && !data.companyName), {
  message: "companyNameIsRequiredForCorporateAccounts",
  path: ["companyName"],
}).refine(data => !(data.isCorporate && !data.taxId), {
  message: "taxIdIsRequiredForCorporateAccounts",
  path: ["taxId"],
}).refine(data => !(data.isCorporate && !data.companyTitle), {
  message: "companyTitleIsRequiredForCorporateAccounts",
  path: ["taxId"],
});


export type UpdateBillingInfo = z.infer<typeof updateBillingInfoSchema>
