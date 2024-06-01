import { z } from "zod"


export const creditCardSchema = z.object({
  cardNumber: z.string().length(16),
  expDate: z.string().length(5),
  CCV: z.string().length(3),
  cardHolder: z.string()
})

export const handleProductPurchaseSchema = z.object({
  price: z.number(),
  productId : z.number(),
  userId : z.string(),
  creditCardInfo:  creditCardSchema
})

export const makePaymentWithCreditCardSchema = z.object(
  {
    transactionId : z.number(),
  },
).and(handleProductPurchaseSchema)


export const grantPaymentToUserSchema = z.object(
  {
    productId : z.number(),
    userId : z.string(),
  }
)

export type HandleProductPurchaseType = z.infer<
  typeof handleProductPurchaseSchema
>

export type MakePaymentWithCreditCardType = z.infer<
  typeof makePaymentWithCreditCardSchema
>

export type GrantPaymentToUserType =  z.infer<
  typeof grantPaymentToUserSchema
>
