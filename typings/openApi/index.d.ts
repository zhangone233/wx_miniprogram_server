/**
 * code2Session
 * @description 小程序登录。登录成功不会返回errcode等字段，只会返回session_key与openid
 */
interface Code2SessionResp {
  /** 错误码 0:成功，其它失败 */
  errcode?: number;
  /** 用户唯一标识 */
  openid?: string;
  /** 错误信息 */
  errmsg?: string;
  /** 用户在开放平台的唯一标识符，若当前小程序已绑定到微信开放平台账号下会返回，详见 [UnionID 机制说明](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/union-id.html)。 */
  unionid?: string;
  /** 会话密钥 */
  session_key?: string;
}
