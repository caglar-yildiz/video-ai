"use server"

import { withValidation } from "@/lib/utils"
import {
  grantPaymentToUserSchema,
  GrantPaymentToUserType, handleProductPurchaseSchema, HandleProductPurchaseType,
  makePaymentWithCreditCardSchema,
  MakePaymentWithCreditCardType,
} from "@/validations/payment"
import { createUUID, paymentProvider } from "@/providers/payment-provider"
import { prisma } from "@/db"
import Parampos  from "@caglar-yildiz/parampos"

const makePaymentImpl  = async (input : MakePaymentWithCreditCardType) : Promise<boolean> => {

  const year = input.creditCardInfo.expDate.split("/")[1]
  const month = input.creditCardInfo.expDate.split("/")[0]

  const param = new Parampos({
    CLIENT_CODE : "10738",
    CLIENT_USERNAME :"Test",
    CLIENT_PASSWORD : "Test",
    MODE : "test"
  })

  const paymentTool = await param.getClient()

  try{
    const result = await paymentTool.TP_WMD_UCDAsyncImpl({
      GUID: createUUID(),
      KK_Sahibi: 'test',
      KK_No: '4022774022774026',
      KK_SK_Ay: '12',
      KK_SK_Yil: "2026",
      KK_CVC: "000",
      KK_Sahibi_GSM: '5551231212',
      Hata_URL: 'https://dev.param.com.tr/tr',
      Basarili_URL: 'https://dev.param.com.tr/tr',
      Siparis_ID: '1',
      Taksit: '1',
      Siparis_Aciklama: 'some-description',
      Toplam_Tutar: '100.00',
      Islem_Tutar: '100.00',
      Islem_Guvenlik_Tip: 'NS',
      IPAdr: 'some-ip-address'
    })
    console.log(result)
  } catch(e){

    console.log(e)

  }

  return false
/*  const payment =
    await paymentTool.TP_WMD_UCDAsyncImpl({
    GUID : createUUID(),
    KK_No : input.creditCardInfo.cardNumber,
    KK_Sahibi : input.creditCardInfo.cardHolder,
    KK_CVC : input.creditCardInfo.CCV,
    KK_SK_Ay : month,
    KK_SK_Yil : year,
    Islem_Tutar : input.price.toString(),
    Islem_Guvenlik_Tip : "NS",
    Siparis_ID : input.transactionId.toString(),
  })

  return payment[0]
    && Number(payment[0].TP_WMD_UCDResult?.Sonuc) > 0
    && payment[0].TP_WMD_UCDResult?.UCD_HTML === 'NONSECURE';*/
}


const grantCreditToUserImpl = async (input : GrantPaymentToUserType) : Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where : {
      id : input.userId
    }
  })
  if (!user) return false
  const product = await prisma.product.findUnique({
    where : {
      id : input.productId
    }
  })
  if (!product) return false

  const creditExist = user.credit ? user.credit : 0

  return !!prisma.user.update({
    where : {
      id : user.id
    },
    data : {
      credit : creditExist+ product.credits_amount
    }
  })
}

export const handleProductPurchaseImpl = async (input : HandleProductPurchaseType) : Promise<boolean> => {

  const product = await prisma.product.findUnique({
    where : {
      id : input.productId
    }
  })

  console.log(product, input.price)
  if(!product || product.price === input.price) {
    return false
  }

  const paymentTransaction =
    await prisma.paymentTransaction.create({
      data : {
        paymentMethod : "CreditCard",
        userId : input.userId,
        amountPaid : input.price,
        status : "PROCESSING",
        productId : product.id
      }
    })

  console.log(paymentTransaction)
  const makePaymentResult = await makePayment({ ...input, transactionId: paymentTransaction.id })
  if(makePaymentResult) {
    const grant = await grantCreditToUser({
      productId: input.productId,
      userId: input.userId,
    })
    if (grant) {
      await prisma.paymentTransaction.update({
        where : {
          id : paymentTransaction.id
        },
        data : {
          status : "COMPLETED"
        }
      })
      console.log("Success")
      return true
    }
  }
  console.log("Failed")
  await prisma.paymentTransaction.update({
    where : {
      id : paymentTransaction.id
    },
    data : {
      status : "FAILED"
    }
  })
  return false
}

export const grantCreditToUser = withValidation(
  grantPaymentToUserSchema,
  grantCreditToUserImpl
)

export const makePayment = withValidation(
  makePaymentWithCreditCardSchema,
  makePaymentImpl
)

export const handleProductPurchase = withValidation(
  handleProductPurchaseSchema,
  handleProductPurchaseImpl
)
