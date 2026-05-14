//tenant extract domain 
import { parse } from "tldts";

export const extractDomain = (req) => {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    console.log("[EXTRACT DOMAIN] raw", host);
    if (!host) return null;
    const parsed =
        parse(host).subdomain || parse(host).domainWithoutSuffix || host;

    console.log("[EXTRACT DOMAIN] parsed", parsed);
    if (!parsed) return null;
    return parsed;
};