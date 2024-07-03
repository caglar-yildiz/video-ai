import { NextRequest } from "next/server"
import { confirmPayment, grantCreditToUser } from "@/actions/payment"
import { permanentRedirect } from 'next/navigation'
import { prisma } from "@/db"

export async function  POST(request: NextRequest) {

  const fd = await request.formData()

  // turkish payment gateway
  const md = fd.get("md")
  const mdStatus = fd.get("mdStatus")
  const orderId = fd.get("orderId")
  const transactionAmount = fd.get("transactionAmount")
  const islemGUID = fd.get("islemGUID")
  const islemHash = fd.get("islemHash")

  // forein payment gateway
  const sonuc = fd.get("TURKPOS_RETVAL_Sonuc")
  const sonucStr = fd.get("TURKPOS_RETVAL_Sonuc_Str")
  const guid = fd.get("TURKPOS_RETVAL_GUID")
  const islemTarih = fd.get("TURKPOS_RETVAL_Islem_Tarih")
  const dekontID = fd.get("TURKPOS_RETVAL_Dekont_ID")
  const tahsilatTutari = fd.get("TURKPOS_RETVAL_Tahsilat_Tutari")
  const odemeTutari = fd.get("TURKPOS_RETVAL_Odeme_Tutari")
  const siparisID = fd.get("TURKPOS_RETVAL_Siparis_ID")
  const islemID = fd.get("TURKPOS_RETVAL_Islem_ID")
  const extData = fd.get("TURKPOS_RETVAL_Ext_Data")
  const bankaSonucKod = fd.get("TURKPOS_RETVAL_Banka_Sonuc_Kod")
  const kkNo = fd.get("TURKPOS_RETVAL_KK_No")

  if (md || mdStatus || orderId || transactionAmount || islemGUID || islemHash) {
    const result = await confirmPayment({
      md : md as string,
      mdStatus : Number(mdStatus) ,
      orderId : orderId as string,
      transactionAmount : transactionAmount as string,
      islemGUID : islemGUID as string,
      islemHash : islemHash as string
    })
    if (result && result.result === "success") {
      return permanentRedirect("/dashboard/confirm?status=success")
    } else if (result ) {
      return permanentRedirect("/dashboard/confirm?status=failed&message=" + encodeURIComponent(result.message) )
    }else {
      return permanentRedirect("/dashboard/confirm?status=failed&message=somethingWentWrong")
    }
  } else if (sonuc && sonucStr && guid && islemTarih && dekontID && islemID && tahsilatTutari && odemeTutari && siparisID && islemID && extData && bankaSonucKod && kkNo) {

    const transaction = await prisma.paymentTransaction.findUnique({
      where : {
        islemId : String(islemID)
      }
    })
    if (!transaction) {
      return permanentRedirect("/dashboard/confirm?status=failed&message=transactionNotFound")
    }
    if(Number(dekontID) > 0){
      try {
        await prisma.paymentTransaction.update({
          where : {
            islemId : String(islemID)
          },
          data : {
            amountPaid : Number(odemeTutari),
            status : "COMPLETED",

          }
        })
      } catch (error) {
        console.log(error)
      }
      const grant = await grantCreditToUser({
        userId : transaction?.userId,
        productId: transaction?.productId
      })

      if (!grant){
        try {
          await prisma.paymentTransaction.update({
            where : {
              islemId : String(islemID)
            },
            data : {
              amountPaid : Number(odemeTutari),
              status : "FAILED",
              message : "Kullanıcıya kredi verilmedi, ama ödeme alındı."
            }
          })
        } catch (error) {
          console.log(error)
          return permanentRedirect("/dashboard/confirm?status=failed&message=creditNotGranted")
        }
      }
      return permanentRedirect("/dashboard/confirm?status=success")
    }else {
      try {
        await prisma.paymentTransaction.update({
          where : {
            islemId : String(islemID)
          },
          data : {
            amountPaid : Number(odemeTutari),
            status : "FAILED",
            message : "Ödeme alınamadı."
          }
        })
      }catch (error) {
        console.log(error)
      }
      return permanentRedirect("/dashboard/confirm?status=failed&message=transactionFailed")
    }
  }

}
