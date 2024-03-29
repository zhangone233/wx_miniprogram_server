import BaseService from '@app/base/_service';
import { decrypt } from '@app/utils/decryptData';
import https, { type RequestOptions } from 'https';
import { APP_ID, APP_SECRET } from '@app/constant/app';

import querystring from 'querystring';

import type {
  UserLoginReq,
  UserLoginResp,
  UserSensitiveDataProcessingReq,
  UserSensitiveDataProcessingResp,
} from '@app/types/user';

export class IndexService extends BaseService {
  async userLogin(req: UserLoginReq): Promise<UserLoginResp> {
    return new Promise((resolve, reject) => {
      const { code } = req;
      const queryParams = querystring.stringify({
        appid: APP_ID,
        secret: APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code',
      });

      const options: RequestOptions = {
        method: 'GET',
        path: `/sns/jscode2session?${queryParams}`,
        host: 'api.weixin.qq.com',
        headers: {
          'Content-Type': 'application/json',
          // 'Content-Length': Buffer.byteLength(body),
        },
      };

      const request = https.request(options, (res) => {
        let dataJson = '';
        res.on('data', (chunkStream: Buffer) => {
          dataJson += chunkStream.toString();
        });
        res.once('end', () => {
          const { errcode, errmsg, session_key, openid }: Code2SessionResp =
            JSON.parse(dataJson);

          console.log(openid);

          if (!errcode && session_key) {
            return resolve({
              token: session_key,
            });
          }
          reject(
            this._Err.FETCH_FAILED_CODE(errmsg, 'code2Session result fail')
          );
        });
      });

      request.once('error', (err: Error) => {
        reject(
          this._Err.FETCH_FAILED_CODE(
            err.message,
            'code2Session request fail',
            err
          )
        );
      });

      request.end(() => {
        console.log('request end');
      });
    });
  }

  async userSensitiveDataProcessing(
    req: UserSensitiveDataProcessingReq,
    sessionKey: string
  ): Promise<UserSensitiveDataProcessingResp> {
    return new Promise((resolve, reject) => {
      try {
        const { iv, encryptedData } = req;
        const dataJson = decrypt(encryptedData, sessionKey, iv);
        const data = JSON.parse(dataJson) as UserSensitiveDataProcessingResp;
        resolve(data);
      } catch (err) {
        reject(
          this._Err.UNKNOWN_ERROR_CODE('解密失败', JSON.stringify(err), err)
        );
      }
    });
  }
}

export default IndexService;
