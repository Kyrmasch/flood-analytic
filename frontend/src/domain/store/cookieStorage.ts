import { CookieAttributes } from "../../../node_modules/typescript-cookie/dist/types";
import { Cookies } from "typescript-cookie";

export class CookieStorage {
  private readonly cookies;
  private readonly keyPrefix;
  private readonly indexKey;
  private readonly expiration;
  private readonly setCookieOptions: CookieAttributes;

  constructor(options: CookieAttributes) {
    this.cookies = Cookies;
    options = options || {};

    this.keyPrefix = options.keyPrefix || "";
    this.indexKey = options.indexKey || "flood";
    this.expiration = options.expiration || {};
    if (!this.expiration.default) {
      this.expiration.default = null;
    }

    this.setCookieOptions = options;
  }

  getItem = (key: string, callback: (a: any, b: any) => void) => {
    var item = this.cookies.get(this.keyPrefix + key) || null;
    if (callback) {
      callback(null, item);
    }
    return Promise.resolve(item);
  };

  setItem = (key: string, value: string, callback: (a: any) => void) => {
    var options = Object.assign({}, this.setCookieOptions);

    var expires = this.expiration.default;
    if (typeof this.expiration[key] !== "undefined") {
      expires = this.expiration[key];
    }
    if (expires) {
      options.expires = expires;
    }

    this.cookies.set(this.keyPrefix + key, value.toString(), options);

    var indexOptions = Object.assign({}, this.setCookieOptions);
    if (this.expiration.default) {
      indexOptions.expires = this.expiration.default;
    }

    return this.getAllKeys().then((allKeys: string[]) => {
      if (allKeys.indexOf(key) === -1) {
        allKeys.push(key);
        this.cookies.set(this.indexKey, JSON.stringify(allKeys), indexOptions);
      }
      if (callback) {
        callback(null);
      }
      return Promise.resolve(null);
    });
  };

  removeItem = (key: string, callback: (a: any) => void) => {
    this.cookies.remove(this.keyPrefix + key);

    return this.getAllKeys().then((allKeys: string[]) => {
      allKeys = allKeys.filter((k) => {
        return k !== key;
      });

      this.cookies.set(this.indexKey, JSON.stringify(allKeys));
      if (callback) {
        callback(null);
      }
      return Promise.resolve(null);
    });
  };

  getAllKeys = (callback?: (a: any, b: string[]) => void) => {
    var cookie = this.cookies.get(this.indexKey) as string;

    var result = [];
    if (cookie) {
      result = JSON.parse(cookie);
    }

    if (callback) {
      callback(null, result);
    }
    return Promise.resolve(result);
  };
}
