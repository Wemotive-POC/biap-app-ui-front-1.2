import { getCall } from "./axios";

/**
 * function to get all brands
 * @returns
 */
export const getAllOffersRequest = (
  lat,
  lng,
  domain = "",
  provider = "",
  location = ""
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = `/clientApis/v2/offers?latitude=${lat}&longitude=${lng}${
        domain ? `&domain=${domain}` : ""
      }${provider ? `&provider=${provider}` : ""}${
        location ? `&location=${location}` : ""
      }`;
      const data = await getCall(url);
      console.log(data);
      return resolve(data.response.data);
    } catch (err) {
      return reject(err);
    }
  });
};
