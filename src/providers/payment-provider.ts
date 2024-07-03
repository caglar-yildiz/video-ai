import Parampos  from "@caglar-yildiz/parampos"
import { ServiceTurkposClient } from "@caglar-yildiz/parampos/dist/lib/serviceturkpos/client"


const getPaymentProvider = async () => {
  console.log("init")
  const param = new Parampos({
    CLIENT_CODE : "10738",
    CLIENT_USERNAME :"Test",
    CLIENT_PASSWORD : "Test",
    MODE : "test",
    GUID : "0c13d406-873b-403b-9c09-a5766840d98c"
  })
  return await param.getClient()
}

export const createUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export let paymentProvider : Promise<ServiceTurkposClient> = getPaymentProvider();
