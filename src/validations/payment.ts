import { z } from "zod"


export const creditCardSchema = z.object({
  cardNumber: z.string().length(16),
  expDate: z.string().length(5),
  CCV: z.string().length(3),
  cardHolder: z.string(),
  is3DSecure: z.boolean().default(false).optional()
})

export const handleProductPurchaseSchema = z.object({
  price: z.string(),
  productId : z.number(),
  userId : z.string(),
  creditCardInfo:  creditCardSchema
})

export const makePaymentWithCreditCardSchema = z.object(
  {
    transactionId : z.number(),
  },
).and(handleProductPurchaseSchema)

export const makePaymentForeinCurrencySchema = z.object(
  {
    currency : z.enum(["TRL", "USD", "EUR", "GBP"]),
}).and(makePaymentWithCreditCardSchema)


export const grantPaymentToUserSchema = z.object(
  {
    productId : z.number(),
    userId : z.string(),
  }
)

export const confirm3DSecurePaymentSchema = z.object(
  {
    md : z.string(),
    mdStatus: z.number(),
    orderId: z.string(),
    transactionAmount: z.string(),
    islemGUID: z.string(),
    islemHash: z.string(),
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

export type Confirm3DSecurePaymentType = z.infer<
  typeof confirm3DSecurePaymentSchema
>

export type MakePaymentForeinCurrencyType = z.infer<
  typeof makePaymentForeinCurrencySchema
>
