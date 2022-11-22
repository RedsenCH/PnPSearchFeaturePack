import "@pnp/common";
// import * as _ from "lodash";
import { Md5 } from "ts-md5";
import CachingConstants from "../../constants/Caching";

/**
 * Useful articles :
 * https://spknowledge.com/2020/07/01/spfx-using-pnp-caching/
 * https://pnp.github.io/pnpjs/odata/caching/
 * https://blog.velingeorgiev.com/sharepoint-framework-performance-optimization
 * https://www.eliostruyf.com/right-approach-cache-data-solution-solution/
 */

export interface ICachevalue {
  value: any;
  expiry: number;
}

class CachingService {
  public static putLocalStorage(key: string, value: any, siteurl: string, ttl: number = CachingConstants.TTL.DefaultTTL) {
    if (siteurl && siteurl.length) {
      key += "_" + Md5.hashStr(siteurl);
    }

    const now = new Date();
    const valueToStore: ICachevalue = {
      value,
      expiry: now.getTime() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(valueToStore));
  }

  public static getLocalStorage(key: string, siteurl: string) {
    if (siteurl && siteurl.length) {
      key += "_" + Md5.hashStr(siteurl);
    }

    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  public static clearCacheEntry(key: string, siteurl: string) {
    if (siteurl && siteurl.length) {
      key += "_" + Md5.hashStr(siteurl);
    }

    localStorage.removeItem(key);
  }

  public static clearCache() {
    localStorage.clear();
  }

  // private static instance: CachingService;
  // private _context: BaseComponentContext;

  // private constructor(context: BaseComponentContext) {
  //   this._context = context;
  //   pnpSetup({
  //     spfxContext: context,
  //   });
  // }
}

export default CachingService;
