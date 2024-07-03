"use server"

import { withValidation } from "@/lib/utils"
import {
  confirm3DSecurePaymentSchema,
  Confirm3DSecurePaymentType,
  grantPaymentToUserSchema,
  GrantPaymentToUserType,
  handleProductPurchaseSchema,
  HandleProductPurchaseType,
  makePaymentForeinCurrencySchema, MakePaymentForeinCurrencyType,
  makePaymentWithCreditCardSchema,
  MakePaymentWithCreditCardType,
} from "@/validations/payment"
import { createUUID, paymentProvider } from "@/providers/payment-provider"
import { prisma } from "@/db"
import { env } from "@/env.mjs"

type MakePaymentResult =
  | {  Sonuc: "success";  Siparis_ID: string; Islem_ID : string; UCD_HTML?: never; UCD_MD?: never; Islem_GUID?: never; }
  | { UCD_HTML: string; Sonuc: "3D"; UCD_MD: string; Islem_GUID: string; Siparis_ID: string ; Islem_ID : string; }
  | {Sonuc: "error"; message: string | "paymentFailed"};


const makePaymentImpl  = async (input : MakePaymentWithCreditCardType) : Promise<MakePaymentResult> => {

  const year = input.creditCardInfo.expDate.split("/")[1]
  const month = input.creditCardInfo.expDate.split("/")[0]


  const paymentTool = await paymentProvider
  let result = null
  try {
    result = await paymentTool.TP_WMD_UCDAsyncImpl({

      KK_Sahibi: input.creditCardInfo.cardHolder,
      KK_No: input.creditCardInfo.cardNumber,
      KK_SK_Ay: month,
      KK_SK_Yil: year,
      KK_CVC: input.creditCardInfo.CCV,
      KK_Sahibi_GSM: '',
      Hata_URL: `${env.NEXT_PUBLIC_APP_URL}/api/payment/confirm`,
      Basarili_URL: `${env.NEXT_PUBLIC_APP_URL}/api/payment/confirm`,
      Siparis_ID: createUUID(),
      Taksit: '1',
      Siparis_Aciklama: 'ITRANSL8 kredi satın alma işlemi',
      Toplam_Tutar: input.price.toString(),
      Islem_Tutar:  input.price.toString(),
      Islem_Guvenlik_Tip: "3D" || input.creditCardInfo.is3DSecure ? '3D' : 'NS',
      IPAdr: 'some-ip-address',
    })
    console.log(result)
  } catch (e : any) {
    console.log(e)
    let errorMessage = '';
    if (e instanceof Error) {
      // If e is an Error object, use its message property
      errorMessage = e.message;
    } else {
      // Otherwise, convert e to a string
      errorMessage = String(e);
    }
    return {
      Sonuc : "error",
      message : errorMessage
    }
  }

  if (!result) {
    throw new Error("Internal Server Error")
  } else if (result[0].TP_WMD_UCDResult && result[0].TP_WMD_UCDResult.Sonuc === "1" && result[0].TP_WMD_UCDResult.UCD_HTML === "NONSECURE") {
    return {
      Sonuc: "success",
      Siparis_ID: result[0].TP_WMD_UCDResult.Siparis_ID as string,
      Islem_ID: result[0].TP_WMD_UCDResult.Islem_ID as string,
    }
  } else if(result[0].TP_WMD_UCDResult && Number(result[0].TP_WMD_UCDResult.Sonuc) <= 0 ) {
    const errorMessage = result[0].TP_WMD_UCDResult.Sonuc_Str
    return {
      Sonuc: "error",
      message: errorMessage ? errorMessage : "paymentFailed"
    }
  } else if (result[0].TP_WMD_UCDResult && Number(result[0].TP_WMD_UCDResult.Sonuc) > 0 && result[0].TP_WMD_UCDResult.UCD_HTML !== "NONSECURE") {
    return {
      UCD_HTML: result[0].TP_WMD_UCDResult.UCD_HTML as string,
      Sonuc: "3D",
      Siparis_ID: result[0].TP_WMD_UCDResult.Siparis_ID as string,
      UCD_MD: result[0].TP_WMD_UCDResult.UCD_MD as string,
      Islem_GUID: result[0].TP_WMD_UCDResult.Islem_GUID as string,
      Islem_ID : result[0].TP_WMD_UCDResult.Islem_ID as string
    }
  }
  return {
    Sonuc : "error",
    message : "paymentFailed"
  }
}

type MakePaymentForeinCurrencyResult = {
  Sonuc: "success";
  Islem_ID: string;
  UCD_URL?: never;
  Islem_GUID?: never;
} | {
  UCD_URL: string;
  Sonuc: "3D";
  Islem_ID: string;
} | {
  Sonuc: "error";
  message: string | "paymentFailed"
}

const Doviz_Kodu = {
  "TRL": "1000",
  "USD": "1001",
  "EUR": "1002",
  "GBP": "1003"
}

const makePaymentWithForeinCurrencyImpl = async (input : MakePaymentForeinCurrencyType) : Promise<MakePaymentForeinCurrencyResult> => {
  const year = input.creditCardInfo.expDate.split("/")[1]
  const month = input.creditCardInfo.expDate.split("/")[0]

  const paymentTool = await paymentProvider
  let result = null
  try {
    result = await paymentTool.TP_Islem_Odeme_WDAsyncImpl({

      KK_Sahibi: input.creditCardInfo.cardHolder,
      KK_No: input.creditCardInfo.cardNumber,
      KK_SK_Ay: month,
      KK_SK_Yil: year,
      KK_CVC: input.creditCardInfo.CCV,
      KK_Sahibi_GSM: '',
      Hata_URL: `${env.NEXT_PUBLIC_APP_URL}/api/payment/confirm`,
      Basarili_URL: `${env.NEXT_PUBLIC_APP_URL}/api/payment/confirm`,
      Siparis_ID: createUUID(),
      Doviz_Kodu : Doviz_Kodu[input.currency ? input.currency : "TRL"],
      Siparis_Aciklama: 'ITRANSL8 kredi satın alma işlemi',
      Toplam_Tutar: input.price.toString(),
      Islem_Tutar:  input.price.toString(),
      Islem_Guvenlik_Tip: input.creditCardInfo.is3DSecure ? '3D' : 'NS',
      IPAdr: 'some-ip-address',
    })
    console.log(result)
  } catch (e : any) {
    console.log(e)
    let errorMessage = '';
    if (e instanceof Error) {
      // If e is an Error object, use its message property
      errorMessage = e.message;
    } else {
      // Otherwise, convert e to a string
      errorMessage = String(e);
    }
    return {
      Sonuc : "error",
      message : errorMessage
    }
  }

  if (!result) {
    throw new Error("Internal Server Error")
  } else if (result[0].TP_Islem_Odeme_WDResult && result[0].TP_Islem_Odeme_WDResult.Sonuc === "1" && result[0].TP_Islem_Odeme_WDResult.UCD_URL === "NONSECURE") {
    return {
      Sonuc: "success",
      Islem_ID: result[0].TP_Islem_Odeme_WDResult.Islem_ID as string,
    }
  }else if(result[0].TP_Islem_Odeme_WDResult && Number(result[0].TP_Islem_Odeme_WDResult.Sonuc) <= 0) {
      return {
        Sonuc: "error",
        message: result[0].TP_Islem_Odeme_WDResult.Sonuc_Str || "somethingWentWrong"
      }
  } else if (result[0].TP_Islem_Odeme_WDResult && Number(result[0].TP_Islem_Odeme_WDResult.Sonuc) > 0 && result[0].TP_Islem_Odeme_WDResult.UCD_URL !== "NONSECURE") {
    return {
      UCD_URL: result[0].TP_Islem_Odeme_WDResult.UCD_URL as string,
      Sonuc: "3D",
      Islem_ID : result[0].TP_Islem_Odeme_WDResult.Islem_ID as string
    }
  }
  return {
    Sonuc : "error",
    message : "paymentFailed"
  }
}

type ConfirmPaymentResult =
  |{ result: "success" ; message?: never }
  |{ result: "failure" ; message: "somethingWentWrong" | "verificationFailed" | string}

const confirmPaymentImpl = async (input : Confirm3DSecurePaymentType) : Promise<ConfirmPaymentResult> => {

  if (input.mdStatus === 1
    || input.mdStatus === 2
    || input.mdStatus === 3
    || input.mdStatus === 4  ) {
      const provider = await paymentProvider
      const result = await provider.TP_WMD_PayAsync({
        UCD_MD: input.md,
        Islem_GUID : input.islemGUID,
        Siparis_ID : input.orderId,
      })
      // Sonuc > 0 ve Dekont_ID > 0 ise işlem başarılıdır. Aksi halde işlem başarısızdır
      if (result[0].TP_WMD_PayResult && Number(result[0].TP_WMD_PayResult.Sonuc) > 0 && Number(result[0].TP_WMD_PayResult.Dekont_ID) > 0) {
        try {
          const update = await prisma.paymentTransaction.update({
            where : {
              islem_GUID : input.islemGUID
            },
            data : {
              status : "COMPLETED",
              islemId : input.islemGUID,
              UCD_MD : input.md
            }
          })
          const grant = await grantCreditToUser({
            productId: update.productId,
            userId: update.userId
          })
        } catch (e) {
          console.log(e)
        }
        return {
          result : "success"
        }
      } else if(result[0].TP_WMD_PayResult ) {
        try {
          await prisma.paymentTransaction.update({
            where: {
              islem_GUID: input.islemGUID
            },
            data: {
              status: "FAILED",
              message: result[0].TP_WMD_PayResult.Sonuc_Ack
            }
          })
        } catch (e) {
          console.log(e)
        }
        return {
          result: "failure",
          message: result[0].TP_WMD_PayResult.Sonuc_Ack ? result[0].TP_WMD_PayResult.Sonuc_Ack : "somethingWentWrong"
        }
      }
  } else if(input.mdStatus === 0) {
    try {
      await prisma.paymentTransaction.update({
        where : {
          islem_GUID : input.islemGUID
        },
        data : {
          status : "FAILED",
          message : "verificationFailed"
        }
      })
    } catch (e) {
      console.log(e)
    }
    return {
      result : "failure",
      message : "verificationFailed"
    }
  }

  try {
    await prisma.paymentTransaction.update({
      where : {
        islem_GUID : input.islemGUID
      },
      data : {
        status : "FAILED",
        message : "somethingWentWrong"
      }
    })
  } catch (e) {
    console.log(e)
  }

  return {
    result : "failure",
    message : "somethingWentWrong"
  }
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

  console.log("creditExist will be added: " , product.credits_amount , " to " , creditExist)

  return !! await prisma.user.update({
    where : {
      id : user.id
    },
    data : {
      credit : creditExist + product.credits_amount
    }
  })
}

type HandleProductPurchaseResult =
  | { UCD_HTML: string; UCD_URL?: never; Sonuc: "3D"; message?: never}
  | { UCD_URL: string; UCD_HTML?: never; Sonuc: "3D"; message?: never}
  | { UCD_HTML?: never; UCD_URL?: never; Sonuc: "success"; message?: never }
  | { UCD_HTML?: never; UCD_URL?: never; Sonuc: "error"; message: "priceMismatch" | "paymentFailed" | string }

export const handleProductPurchaseImpl = async (input : HandleProductPurchaseType) : Promise<HandleProductPurchaseResult> => {

  const product = await prisma.product.findUnique({
    where : {
      id : input.productId
    },
    include:{
      country : true
    }
  })

  if(!product || product.price.toString() !== input.price) {
    return {
      Sonuc : "error",
      message: "priceMismatch"
    }
  }

  const paymentTransaction =
    await prisma.paymentTransaction.create({
      data : {
        paymentMethod : "CreditCard",
        userId : input.userId,
        amountPaid : parseFloat(input.price),
        status : "PROCESSING",
        productId : product.id
      }
    })

  let makePaymentResult : MakePaymentResult | MakePaymentForeinCurrencyResult | undefined | null= undefined
  if (product.country.payment_code === "TRL") {
    makePaymentResult = await makePayment({
      ...input,
      transactionId: paymentTransaction.id ,
      price: formatPrice(input.price)
    })
  } else {
    makePaymentResult = await makePaymentWithForeinCurrency({
      ...input,
      transactionId: paymentTransaction.id,
      currency: product.country.payment_code as "TRL" | "USD" | "EUR" | "GBP",
    })
  }


  if (!makePaymentResult) {
    await prisma.paymentTransaction.update({
      where : {
        id : paymentTransaction.id
      },
      data : {
        status : "FAILED"
      }
    })
    return {
      Sonuc : "error",
      message : "paymentFailed"
    }
  }
  if(makePaymentResult && makePaymentResult.Sonuc === "success") {
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
          status : "COMPLETED",
          siparisId : 'Siparis_ID' in makePaymentResult ? String(makePaymentResult.Siparis_ID) : null,
          islemId : String(makePaymentResult.Islem_ID)
        }
      })
      console.log("Success")
      return {
        Sonuc : "success"
      }
    }
  } else if (makePaymentResult && makePaymentResult.Sonuc === "3D") {
    await prisma.paymentTransaction.update({
      where : {
        id : paymentTransaction.id
      },
      data : {
        siparisId : 'Siparis_ID' in makePaymentResult ? String(makePaymentResult.Siparis_ID) : null,
        islem_GUID : 'Islem_GUID' in makePaymentResult ? makePaymentResult.Islem_GUID : null,
        islemId : String(makePaymentResult.Islem_ID)
      }
    })
    if ('UCD_HTML' in makePaymentResult) {
        return {
        Sonuc : "3D",
        UCD_HTML : makePaymentResult.UCD_HTML
      }
    }else {
      return {
        Sonuc : "3D",
        UCD_URL : makePaymentResult.UCD_URL
      }
    }
  }
  await prisma.paymentTransaction.update({
    where : {
      id : paymentTransaction.id
    },
    data : {
      status : "FAILED",
      message : makePaymentResult.Sonuc === "error" &&  makePaymentResult.message
        ? makePaymentResult.message : "paymentFailed"
    }
  })
  return {
    Sonuc : "error",
    message : makePaymentResult.Sonuc === "error" &&  makePaymentResult.message
      ? makePaymentResult.message : "paymentFailed"
  }
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

export const confirmPayment = withValidation(
  confirm3DSecurePaymentSchema,
  confirmPaymentImpl
)

export const makePaymentWithForeinCurrency = withValidation(
  makePaymentForeinCurrencySchema,
  makePaymentWithForeinCurrencyImpl
)


function formatPrice(price : number | string) {
  // Convert price to string
  price = price.toString();

  // Check if price contains a decimal
  if (!price.includes(',')) {
    // If not, add ".00" to the end
    price += ',00';
  }

  return price;
}
