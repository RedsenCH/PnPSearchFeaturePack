import { FetchClient } from "@pnp/common";

enum ETokenAquisitionStatus {
  startingBlocks,
  pending,
  finished,
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class TokenService {
  public static getInstance(): TokenService {
    if (!this._instance) {
      this._instance = new TokenService();
    }
    return this._instance;
  }

  private static _instance: TokenService = null;
  private _tokenAquisitionStatus: ETokenAquisitionStatus;
  private _token: any;

  private constructor() {
    this._tokenAquisitionStatus = ETokenAquisitionStatus.startingBlocks;
  }

  public async getToken(url: string): Promise<any> {
    if (!this._token && this._tokenAquisitionStatus === ETokenAquisitionStatus.startingBlocks) {
      this._tokenAquisitionStatus = ETokenAquisitionStatus.pending;
      const client = new FetchClient();
      const fetchToken = await client.fetch(url, { headers: { accept: "application/json" } });
      const { Token } = await fetchToken.json();
      this._token = Token;
      this._tokenAquisitionStatus = ETokenAquisitionStatus.finished;
    }
    while (this._tokenAquisitionStatus !== ETokenAquisitionStatus.finished) {
      await sleep(500);
    }
    return this._token;
  }
}
