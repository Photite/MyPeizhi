// iios.club Loon 定时签到（WASM 原算法版）
// 逆向自 2026-08-06 站点前端。请仅用于自己的账号。

const IIOS = {
  tokenKey: 'iios.club.token',
  uaKey: 'iios.club.ua',
  cookieKey: 'iios.club.cookie',
  wasmUrl: 'https://www.iios.club/static/media/web_wasm_bg.534e8f19399f44e1496d.wasm',
  apiUrl: 'https://www.iios.club/api/task',
  manualToken: '', // 可选：只填 Basic 后面的 token，不要带 "Basic "。
  decryptResponse: false, // Loon 未公开保证 WebCrypto；默认只按 HTTP 状态判断。
  defaultUA: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
};

function getHeader(headers, name) {
  const wanted = name.toLowerCase();
  for (const key of Object.keys(headers || {})) {
    if (key.toLowerCase() === wanted) return headers[key];
  }
  return undefined;
}

function notify(subtitle, body) {
  console.log('[iios.club] ' + subtitle + ': ' + body);
  if (typeof $notification !== 'undefined') {
    $notification.post('iios.club 签到', subtitle, body);
  }
}

function finish() {
  if (typeof $done === 'function') $done({});
}

function captureCredential() {
  const authorization = getHeader($request.headers, 'authorization') || '';
  const match = /^Basic\s+(.+)$/i.exec(authorization);
  if (match) {
    $persistentStore.write(match[1], IIOS.tokenKey);
    const ua = getHeader($request.headers, 'user-agent');
    if (ua) $persistentStore.write(ua, IIOS.uaKey);
    console.log('[iios.club] 已捕获并保存登录 token');
  }
  finish();
}

// Loon 未公开保证这些 Web API；补齐请求加密实际需要的最小环境。
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = class {
    encode(text) {
      const escaped = unescape(encodeURIComponent(String(text)));
      const out = new Uint8Array(escaped.length);
      for (let i = 0; i < escaped.length; i++) out[i] = escaped.charCodeAt(i);
      return out;
    }
    encodeInto(text, target) {
      const bytes = this.encode(text);
      const written = Math.min(bytes.length, target.length);
      target.set(bytes.subarray(0, written));
      return { read: String(text).length, written };
    }
  };
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = class {
    decode(input) {
      if (!input) return '';
      const bytes = input instanceof Uint8Array ? input : new Uint8Array(input.buffer || input);
      let binary = '';
      for (let i = 0; i < bytes.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
      }
      try { return decodeURIComponent(escape(binary)); } catch (_) { return binary; }
    }
  };
}
if (typeof globalThis.crypto === 'undefined') globalThis.crypto = {};
if (typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto.getRandomValues = (array) => {
    for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 256);
    return array;
  };
}
if (typeof globalThis.Window === 'undefined') globalThis.Window = Object;

const _0x244811 = globalThis.TextDecoder;
const _0x593d58 = globalThis.TextEncoder;
let _iiosRuntimeUA = IIOS.defaultUA;
function a0_0x29af() { return undefined; }
const _0x2dedaa = a0_0x29af;
const _0x38483d = a0_0x29af;
let _0x122b4b;function _0x3e46a6(_0x45d955){var _0x4a06e9=_0x2dedaa,_0x2051fd=_0x2dedaa;_0x486487===_0x167787["length"]&&_0x167787['push'](_0x167787["length"]+0x1);const _0x43dbdd=_0x486487;return _0x486487=_0x167787[_0x43dbdd],_0x167787[_0x43dbdd]=_0x45d955,_0x43dbdd;}const _0x5ef886='undefined'===typeof FinalizationRegistry?{'register':()=>{},'unregister':()=>{}}:new FinalizationRegistry(_0x575492=>_0x575492["dtor"](_0x575492['a'],_0x575492['b']));function _0x4cfe66(_0x5861c4){var _0x533822=_0x38483d,_0x45c6fa=_0x2dedaa;const _0x3041a3=typeof _0x5861c4;if("number"==_0x3041a3||"boolean"==_0x3041a3||null==_0x5861c4)return''["concat"](_0x5861c4);if('string'==_0x3041a3)return'\x22'["concat"](_0x5861c4,'\x22');if("symbol"==_0x3041a3){const _0x1c1729=_0x5861c4["description"];return null==_0x1c1729?"Symbol":'Symbol('["concat"](_0x1c1729,')');}if("function"==_0x3041a3){const _0x252aa6=_0x5861c4["name"];return "string"==typeof _0x252aa6&&_0x252aa6["length"]>0x0?'Function('["concat"](_0x252aa6,')'):'Function';}if(Array["isArray"](_0x5861c4)){const _0x583c01=_0x5861c4["length"];let _0x597b80='[';_0x583c01>0x0&&(_0x597b80+=_0x4cfe66(_0x5861c4[0x0]));for(let _0x58e2d0=0x1;_0x58e2d0<_0x583c01;_0x58e2d0++)_0x597b80+=',\x20'+_0x4cfe66(_0x5861c4[_0x58e2d0]);return _0x597b80+=']',_0x597b80;}const _0x1429c9=/\[object ([^\]]+)\]/["exec"](toString["call"](_0x5861c4));let _0x53ce61;if(!(_0x1429c9&&_0x1429c9["length"]>0x1))return toString['call'](_0x5861c4);if(_0x53ce61=_0x1429c9[0x1],"Object"==_0x53ce61)try{return "Object("+JSON['stringify'](_0x5861c4)+')';}catch(_0x14bab2){return "Object";}return _0x5861c4 instanceof Error?''['concat'](_0x5861c4['name'],':\x20')['concat'](_0x5861c4["message"],'\x0a')['concat'](_0x5861c4["stack"]):_0x53ce61;}function _0x4cee11(_0x52c1e2,_0x4f7d7f){return _0x52c1e2>>>=0x0,_0x3dad75()['subarray'](_0x52c1e2/0x1,_0x52c1e2/0x1+_0x4f7d7f);}let _0x4a6714=null;function _0x56869b(){var _0x3d30b2=_0x2dedaa,_0xdec932=_0x38483d;return(null===_0x4a6714||!0x0===_0x4a6714["buffer"]["detached"]||void 0x0===_0x4a6714["buffer"]['detached']&&_0x4a6714["buffer"]!==_0x122b4b["memory"]['buffer'])&&(_0x4a6714=new DataView(_0x122b4b["memory"]["buffer"])),_0x4a6714;}function _0x38d53c(_0x568599,_0x15fe1c){return function(_0x270490,_0x45b1a8){var _0x32514b=a0_0x29af,_0x418a20=a0_0x29af;return _0x1da724+=_0x45b1a8,_0x1da724>=_0x426a85&&(_0x2b80c6=new _0x244811("utf-8",{'ignoreBOM':!0x0,'fatal':!0x0}),_0x2b80c6["decode"](),_0x1da724=_0x45b1a8),_0x2b80c6['decode'](_0x3dad75()["subarray"](_0x270490,_0x270490+_0x45b1a8));}(_0x568599>>>=0x0,_0x15fe1c);}let _0x5cce3a=null;function _0x3dad75(){var _0x292281=_0x2dedaa,_0x8b972f=_0x2dedaa;return null!==_0x5cce3a&&0x0!==_0x5cce3a['byteLength']||(_0x5cce3a=new Uint8Array(_0x122b4b["memory"]["buffer"])),_0x5cce3a;}function _0x5cd516(_0x56efcb){return _0x167787[_0x56efcb];}function _0x4cebf4(_0x1615c2,_0x4a05f4){var _0xc13f97=_0x2dedaa,_0x210a1b=_0x2dedaa;try{return _0x1615c2["apply"](this,_0x4a05f4);}catch(_0x8772a){_0x122b4b["f54"](_0x3e46a6(_0x8772a));}}let _0x167787=new Array(0x80)["fill"](void 0x0);_0x167787['push'](void 0x0,null,!0x0,!0x1);let _0x486487=_0x167787["length"];function _0x21c699(_0x48a166){return void 0x0===_0x48a166||null===_0x48a166;}function _0x121b57(_0x59fe18,_0x4c9f28,_0x2064e5){var _0x5b8d3c=_0x2dedaa,_0x1d2607=_0x2dedaa;if(void 0x0===_0x2064e5){const _0x16a19a=_0x454b8a["encode"](_0x59fe18),_0xfb3a63=_0x4c9f28(_0x16a19a["length"],0x1)>>>0x0;return _0x3dad75()["subarray"](_0xfb3a63,_0xfb3a63+_0x16a19a["length"])["set"](_0x16a19a),_0x262b55=_0x16a19a["length"],_0xfb3a63;}let _0x22048d=_0x59fe18['length'],_0x3cfc7b=_0x4c9f28(_0x22048d,0x1)>>>0x0;const _0x8dec07=_0x3dad75();let _0x4908d1=0x0;for(;_0x4908d1<_0x22048d;_0x4908d1++){const _0x4f8acc=_0x59fe18['charCodeAt'](_0x4908d1);if(_0x4f8acc>0x7f)break;_0x8dec07[_0x3cfc7b+_0x4908d1]=_0x4f8acc;}if(_0x4908d1!==_0x22048d){0x0!==_0x4908d1&&(_0x59fe18=_0x59fe18["slice"](_0x4908d1)),_0x3cfc7b=_0x2064e5(_0x3cfc7b,_0x22048d,_0x22048d=_0x4908d1+0x3*_0x59fe18["length"],0x1)>>>0x0;const _0x4e149e=_0x3dad75()["subarray"](_0x3cfc7b+_0x4908d1,_0x3cfc7b+_0x22048d);_0x4908d1+=_0x454b8a["encodeInto"](_0x59fe18,_0x4e149e)["written"],_0x3cfc7b=_0x2064e5(_0x3cfc7b,_0x22048d,_0x4908d1,0x1)>>>0x0;}return _0x262b55=_0x4908d1,_0x3cfc7b;}function _0x2cba0b(_0x401d6c){const _0x4dc483=_0x5cd516(_0x401d6c);return function(_0x4dd21d){_0x4dd21d<0x84||(_0x167787[_0x4dd21d]=_0x486487,_0x486487=_0x4dd21d);}(_0x401d6c),_0x4dc483;}let _0x2b80c6=new _0x244811("utf-8",{'ignoreBOM':!0x0,'fatal':!0x0});_0x2b80c6['decode']();const _0x426a85=0x7ff00000;let _0x1da724=0x0;const _0x454b8a=new _0x593d58();'encodeInto'in _0x454b8a||(_0x454b8a["encodeInto"]=function(_0x111186,_0x4bf0f1){var _0x578c4b=_0x38483d,_0x9c53eb=_0x2dedaa;const _0x292c44=_0x454b8a["encode"](_0x111186);return _0x4bf0f1["set"](_0x292c44),{'read':_0x111186["length"],'written':_0x292c44["length"]};});let _0x262b55=0x0;function _0x2d71a6(_0x2bcadd,_0x65a1fd,_0x103b28){_0x122b4b['f51'](_0x2bcadd,_0x65a1fd,_0x3e46a6(_0x103b28));}function _0x1387e6(_0x5e9fbe){return _0x2cba0b(_0x122b4b['d'](_0x3e46a6(_0x5e9fbe)));}const _0x399459=new Set(["basic","cors",'default']);function _0x18de2d(){var _0x4c5032=_0x38483d,_0x4a112b=_0x38483d;const _0x4c5180={'wbg':{}};return _0x4c5180['wbg']["f39"]=function(_0x3e84fb,_0x1902a9){var _0x3b16c3=_0x4c5032,_0x563601=_0x4c5032;const _0x4cea51=_0x121b57(_0x4cfe66(_0x5cd516(_0x1902a9)),_0x122b4b["f56"],_0x122b4b["f55"]),_0x5b4840=_0x262b55;_0x56869b()["setInt32"](_0x3e84fb+0x4,_0x5b4840,!0x0),_0x56869b()["setInt32"](_0x3e84fb+0x0,_0x4cea51,!0x0);},_0x4c5180["wbg"]["f41"]=function(_0x342094){var _0x24ddb6=_0x4a112b;return "function"===typeof _0x5cd516(_0x342094);},_0x4c5180["wbg"]["f40"]=function(_0xd323f0){var _0xab2389=_0x4a112b;const _0x3b9626=_0x5cd516(_0xd323f0);return "object"===typeof _0x3b9626&&null!==_0x3b9626;},_0x4c5180["wbg"]['f21']=function(_0x3f01b4){return'string'===typeof _0x5cd516(_0x3f01b4);},_0x4c5180["wbg"]["f26"]=function(_0x29c2ea){return void 0x0===_0x5cd516(_0x29c2ea);},_0x4c5180["wbg"]["f38"]=function(_0x2147d1,_0x46a0f3){var _0x43f6a4=_0x4a112b,_0x412028=_0x4c5032;const _0x330023=_0x5cd516(_0x46a0f3),_0x4c75df="number"===typeof _0x330023?_0x330023:void 0x0;_0x56869b()["setFloat64"](_0x2147d1+0x8,_0x21c699(_0x4c75df)?0x0:_0x4c75df,!0x0),_0x56869b()["setInt32"](_0x2147d1+0x0,!_0x21c699(_0x4c75df),!0x0);},_0x4c5180['wbg']["f37"]=function(_0x9a663f,_0x12bf23){var _0x4256dc=_0x4c5032,_0x371233=_0x4c5032;const _0x5bef3b=_0x5cd516(_0x12bf23),_0x2bdc10='string'===typeof _0x5bef3b?_0x5bef3b:void 0x0;var _0x290a27=_0x21c699(_0x2bdc10)?0x0:_0x121b57(_0x2bdc10,_0x122b4b["f56"],_0x122b4b['f55']),_0x113d59=_0x262b55;_0x56869b()["setInt32"](_0x9a663f+0x4,_0x113d59,!0x0),_0x56869b()['setInt32'](_0x9a663f+0x0,_0x290a27,!0x0);},_0x4c5180["wbg"]["f36"]=function(_0x426aee,_0x4ce832){throw new Error(_0x38d53c(_0x426aee,_0x4ce832));},_0x4c5180["wbg"]['f44']=function(_0x3cb0c9){var _0x2e173d=_0x4c5032;_0x5cd516(_0x3cb0c9)["_wbg_cb_unref"]();},_0x4c5180["wbg"]["f33"]=function(){return _0x4cebf4(function(_0x3e3792,_0x32861c,_0x3f7747){var _0x328c33=a0_0x29af;return _0x3e46a6(_0x5cd516(_0x3e3792)["call"](_0x5cd516(_0x32861c),_0x5cd516(_0x3f7747)));},arguments);},_0x4c5180['wbg']['f28']=function(){return _0x4cebf4(function(_0x56f760,_0x580188){var _0x4f39c1=a0_0x29af;return _0x3e46a6(_0x5cd516(_0x56f760)["call"](_0x5cd516(_0x580188)));},arguments);},_0x4c5180["wbg"]["f17"]=function(_0x256606){return _0x3e46a6(_0x5cd516(_0x256606)['crypto']);},_0x4c5180["wbg"]['f5']=function(){return _0x4cebf4(function(_0x2ea95f){var _0x35fdc2=a0_0x29af;return _0x3e46a6(_0x5cd516(_0x2ea95f)["crypto"]);},arguments);},_0x4c5180["wbg"]["f10"]=function(){return _0x4cebf4(function(_0x5293bb,_0x57a1f4,_0xc4769b,_0x1420e8,_0x212da9){return _0x3e46a6(_0x5cd516(_0x5293bb)['decrypt'](_0x5cd516(_0x57a1f4),_0x5cd516(_0xc4769b),_0x4cee11(_0x1420e8,_0x212da9)));},arguments);},_0x4c5180["wbg"]["f16"]=function(){return _0x4cebf4(function(_0x4b9fad,_0x56cd13){_0x5cd516(_0x4b9fad)['getRandomValues'](_0x5cd516(_0x56cd13));},arguments);},_0x4c5180['wbg']["f25"]=function(){return _0x4cebf4(function(_0x3288c6,_0x591eef){return _0x3e46a6(Reflect['get'](_0x5cd516(_0x3288c6),_0x5cd516(_0x591eef)));},arguments);},_0x4c5180["wbg"]['f49']=function(){return _0x4cebf4(function(_0x4b2e3d,_0x17a684){var _0x5a417f=a0_0x29af,_0x3d5f17=a0_0x29af;const _0x1312e5=_0x121b57(_0x5cd516(_0x17a684)["host"],_0x122b4b["f56"],_0x122b4b["f55"]),_0x371656=_0x262b55;_0x56869b()['setInt32'](_0x4b2e3d+0x4,_0x371656,!0x0),_0x56869b()["setInt32"](_0x4b2e3d+0x0,_0x1312e5,!0x0);},arguments);},_0x4c5180["wbg"]['f9']=function(){return _0x4cebf4(function(_0x1fc4e0,_0x2245e9,_0x4e5baa,_0x133204,_0x5be7bd,_0x31e0fa,_0x3b6999,_0x28ef8e){var _0xd2f109=a0_0x29af;return _0x3e46a6(_0x5cd516(_0x1fc4e0)["importKey"](_0x38d53c(_0x2245e9,_0x4e5baa),_0x5cd516(_0x133204),_0x38d53c(_0x5be7bd,_0x31e0fa),0x0!==_0x3b6999,_0x5cd516(_0x28ef8e)));},arguments);},_0x4c5180["wbg"]['f48']=function(_0x194f68){let _0x5d3f38;try{_0x5d3f38=_0x5cd516(_0x194f68)instanceof Window;}catch(_0x17e3e8){_0x5d3f38=!0x1;}return _0x5d3f38;},_0x4c5180['wbg']["f12"]=function(_0x27e82d){var _0x21429a=_0x4c5032;return _0x5cd516(_0x27e82d)["length"];},_0x4c5180["wbg"]['f1']=function(_0x2348fb){var _0x176744=_0x4a112b;return _0x3e46a6({host:"www.iios.club"});},_0x4c5180["wbg"]["f23"]=function(_0xdb285e){return _0x3e46a6(_0x5cd516(_0xdb285e)['msCrypto']);},_0x4c5180["wbg"]['f0']=function(_0x16bad4){return _0x3e46a6({userAgent:_iiosRuntimeUA});},_0x4c5180['wbg']['f2']=function(){return _0x3e46a6(new Object());},_0x4c5180["wbg"]['f11']=function(_0x1821cc){return _0x3e46a6(new Uint8Array(_0x5cd516(_0x1821cc)));},_0x4c5180["wbg"]["f13"]=function(_0x1cbb74,_0x3dd42e){try{var _0xd0a357={'a':_0x1cbb74,'b':_0x3dd42e};const _0x209022=new Promise((_0x1634ac,_0x2dd07f)=>{const _0x2848ee=_0xd0a357['a'];_0xd0a357['a']=0x0;try{return function(_0x29342f,_0x24f4ab,_0x3d37b1,_0x24e53b){var _0x56ea44=a0_0x29af;_0x122b4b["f53"](_0x29342f,_0x24f4ab,_0x3e46a6(_0x3d37b1),_0x3e46a6(_0x24e53b));}(_0x2848ee,_0xd0a357['b'],_0x1634ac,_0x2dd07f);}finally{_0xd0a357['a']=_0x2848ee;}});return _0x3e46a6(_0x209022);}finally{_0xd0a357['a']=_0xd0a357['b']=0x0;}},_0x4c5180["wbg"]['f7']=function(_0xb6c491,_0x3a897d){return _0x3e46a6(new Uint8Array(_0x4cee11(_0xb6c491,_0x3a897d)));},_0x4c5180["wbg"]["f27"]=function(_0xbd31d6,_0x958d85){return _0x3e46a6(new Function(_0x38d53c(_0xbd31d6,_0x958d85)));},_0x4c5180["wbg"]["f24"]=function(_0x2e5426){return _0x3e46a6(new Uint8Array(_0x2e5426>>>0x0));},_0x4c5180["wbg"]["f20"]=function(_0x5e23b7){var _0x35ac0c=_0x4c5032;return _0x3e46a6(_0x5cd516(_0x5e23b7)["node"]);},_0x4c5180["wbg"]['f3']=function(){var _0x557428=_0x4c5032;return Date["now"]();},_0x4c5180["wbg"]['f8']=function(_0x176aa0,_0x149ce7){return _0x3e46a6(Array['of'](_0x5cd516(_0x176aa0),_0x5cd516(_0x149ce7)));},_0x4c5180["wbg"]["f18"]=function(_0x247566){var _0x257e25=_0x4a112b;return _0x3e46a6(_0x5cd516(_0x247566)["process"]);},_0x4c5180["wbg"]["f35"]=function(_0x4c019f,_0x2c097b,_0x1d1f30){var _0x34a08b=_0x4a112b,_0x159bcf=_0x4c5032;Uint8Array["prototype"]["set"]["call"](_0x4cee11(_0x4c019f,_0x2c097b),_0x5cd516(_0x1d1f30));},_0x4c5180["wbg"]["f42"]=function(_0x57d213){var _0x1a8fa0=_0x4c5032;return _0x3e46a6(_0x5cd516(_0x57d213)["queueMicrotask"]);},_0x4c5180["wbg"]["f46"]=function(_0x5c6a7b){queueMicrotask(_0x5cd516(_0x5c6a7b));},_0x4c5180['wbg']["f14"]=function(){return _0x4cebf4(function(_0x8d2776,_0x4ed883){_0x5cd516(_0x8d2776)['randomFillSync'](_0x2cba0b(_0x4ed883));},arguments);},_0x4c5180['wbg']["f22"]=function(){return _0x4cebf4(function(){var _0x540f9d=a0_0x29af;return _0x3e46a6(module["require"]);},arguments);},_0x4c5180["wbg"]['f43']=function(_0x483243){var _0x54846a=_0x4a112b;return _0x3e46a6(Promise["resolve"](_0x5cd516(_0x483243)));},_0x4c5180["wbg"]['f4']=function(_0x51aaba,_0x299290,_0x508a28){_0x5cd516(_0x51aaba)[_0x2cba0b(_0x299290)]=_0x2cba0b(_0x508a28);},_0x4c5180['wbg']["f34"]=function(){return _0x4cebf4(function(_0x2e84c8,_0x3547a4,_0x3d4f78){var _0x49657e=a0_0x29af;return Reflect["set"](_0x5cd516(_0x2e84c8),_0x5cd516(_0x3547a4),_0x5cd516(_0x3d4f78));},arguments);},_0x4c5180["wbg"]["f29"]=function(){var _0x29231f=_0x4a112b;const _0x530d30="undefined"===typeof global?null:global;return _0x21c699(_0x530d30)?0x0:_0x3e46a6(_0x530d30);},_0x4c5180['wbg']["f30"]=function(){var _0x3970f4=_0x4c5032;const _0x41ac0e="undefined"===typeof globalThis?null:globalThis;return _0x21c699(_0x41ac0e)?0x0:_0x3e46a6(_0x41ac0e);},_0x4c5180["wbg"]["f32"]=function(){const _0x2cb318='undefined'===typeof self?null:self;return _0x21c699(_0x2cb318)?0x0:_0x3e46a6(_0x2cb318);},_0x4c5180["wbg"]["f31"]=function(){var _0xb4095d=_0x4a112b;const _0x21e8dd="undefined"===typeof window?null:window;return _0x21c699(_0x21e8dd)?0x0:_0x3e46a6(_0x21e8dd);},_0x4c5180["wbg"]['f15']=function(_0x1033d0,_0x303f90,_0x1906e1){var _0x4d2b6b=_0x4a112b;return _0x3e46a6(_0x5cd516(_0x1033d0)["subarray"](_0x303f90>>>0x0,_0x1906e1>>>0x0));},_0x4c5180["wbg"]['f6']=function(_0x57961a){var _0x4528bd=_0x4a112b;return _0x3e46a6(_0x5cd516(_0x57961a)["subtle"]);},_0x4c5180["wbg"]["f47"]=function(_0xf21dd9,_0x343c15,_0x335f0a){var _0x86b91c=_0x4c5032;return _0x3e46a6(_0x5cd516(_0xf21dd9)["then"](_0x5cd516(_0x343c15),_0x5cd516(_0x335f0a)));},_0x4c5180["wbg"]["f45"]=function(_0x5059fa,_0x20ec6e){var _0x380309=_0x4c5032;return _0x3e46a6(_0x5cd516(_0x5059fa)["then"](_0x5cd516(_0x20ec6e)));},_0x4c5180["wbg"]["f50"]=function(){return _0x4cebf4(function(_0x2da205,_0x509239){var _0x1c56d3=a0_0x29af,_0x635c56=a0_0x29af;const _0x577d27=_0x121b57(_0x5cd516(_0x509239)['userAgent'],_0x122b4b["f56"],_0x122b4b["f55"]),_0x4a9601=_0x262b55;_0x56869b()['setInt32'](_0x2da205+0x4,_0x4a9601,!0x0),_0x56869b()["setInt32"](_0x2da205+0x0,_0x577d27,!0x0);},arguments);},_0x4c5180["wbg"]["f19"]=function(_0x194ae3){var _0x5747a1=_0x4c5032;return _0x3e46a6(_0x5cd516(_0x194ae3)["versions"]);},_0x4c5180['wbg']["f57"]=function(_0x581d75,_0x2d46bb){return _0x3e46a6(_0x38d53c(_0x581d75,_0x2d46bb));},_0x4c5180["wbg"]["f58"]=function(_0x223b46,_0x1897ce){return _0x3e46a6(_0x4cee11(_0x223b46,_0x1897ce));},_0x4c5180["wbg"]['f59']=function(_0xe24bc1,_0x22b49a){const _0x4306a2=function(_0x3d2779,_0x1390c1,_0x4cf46c,_0x4f9fca){var _0x24f993=a0_0x29af,_0x36d79e=a0_0x29af;const _0x1a151d={'a':_0x3d2779,'b':_0x1390c1,'cnt':0x1,'dtor':_0x4cf46c},_0x122b4e=function(){var _0x23b048=a0_0x29af,_0x521820=a0_0x29af;_0x1a151d["cnt"]++;const _0x49c727=_0x1a151d['a'];_0x1a151d['a']=0x0;try{for(var _0x3d65f1=arguments['length'],_0x287158=new Array(_0x3d65f1),_0x54a3db=0x0;_0x54a3db<_0x3d65f1;_0x54a3db++)_0x287158[_0x54a3db]=arguments[_0x54a3db];return _0x4f9fca(_0x49c727,_0x1a151d['b'],..._0x287158);}finally{_0x1a151d['a']=_0x49c727,_0x122b4e["_wbg_cb_unref"]();}};return _0x122b4e["_wbg_cb_unref"]=()=>{var _0x23a8d0=_0x24f993,_0x142b04=_0x24f993;0x0===--_0x1a151d["cnt"]&&(_0x1a151d["dtor"](_0x1a151d['a'],_0x1a151d['b']),_0x1a151d['a']=0x0,_0x5ef886["unregister"](_0x1a151d));},_0x5ef886["register"](_0x122b4e,_0x1a151d,_0x1a151d),_0x122b4e;}(_0xe24bc1,_0x22b49a,_0x122b4b['f52'],_0x2d71a6);return _0x3e46a6(_0x4306a2);},_0x4c5180["wbg"]["f60"]=function(_0x3f2de8){return _0x3e46a6(_0x5cd516(_0x3f2de8));},_0x4c5180["wbg"]['f61']=function(_0x1fc29d){_0x2cba0b(_0x1fc29d);},_0x4c5180;}function _0x46d7ca(_0x4f5740,_0x50fde1){var _0x4ad1ad=_0x2dedaa;return _0x122b4b=_0x4f5740['exports'],_0x5b4602["__wbindgen_wasm_module"]=_0x50fde1,_0x4a6714=null,_0x5cce3a=null,_0x122b4b;}async function _0x5b4602(_0x45bcd4){var _0x4d2cbf=_0x2dedaa,_0x1ca951=_0x2dedaa;if(void 0x0!==_0x122b4b)return _0x122b4b;"undefined"!==typeof _0x45bcd4&&(Object['getPrototypeOf'](_0x45bcd4)===Object["prototype"]?{module_or_path:_0x45bcd4}=_0x45bcd4:console["warn"]("using deprecated parameters for the initialization function; pass a single object instead")),"undefined"===typeof _0x45bcd4&&(_0x45bcd4=new URL(_0x4c6a8b(0x23f6),_0x4c6a8b['b']));const _0x7a836e=_0x18de2d();("string"===typeof _0x45bcd4||'function'===typeof Request&&_0x45bcd4 instanceof Request||"function"===typeof URL&&_0x45bcd4 instanceof URL)&&(_0x45bcd4=fetch(_0x45bcd4));const {instance:_0x3b005e,module:_0x128cc0}=await async function(_0x3ca91f,_0x23e7c2){var _0x14b6cf=_0x4d2cbf,_0x18ae29=_0x4d2cbf;if("function"===typeof Response&&_0x3ca91f instanceof Response){if("function"===typeof WebAssembly['instantiateStreaming'])try{return await WebAssembly["instantiateStreaming"](_0x3ca91f,_0x23e7c2);}catch(_0xa74626){if(!_0x3ca91f['ok']||!_0x399459["has"](_0x3ca91f["type"])||"application/wasm"===_0x3ca91f['headers']['get']("Content-Type"))throw _0xa74626;console["warn"]("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",_0xa74626);}const _0x283de8=await _0x3ca91f["arrayBuffer"]();return await WebAssembly["instantiate"](_0x283de8,_0x23e7c2);}{const _0x5bc812=await WebAssembly['instantiate'](_0x3ca91f,_0x23e7c2);return _0x5bc812 instanceof WebAssembly["Instance"]?{'instance':_0x5bc812,'module':_0x3ca91f}:_0x5bc812;}}(await _0x45bcd4,_0x7a836e);return _0x46d7ca(_0x3b005e,_0x128cc0);}const _0x5642a5=_0x5b4602;

function getBinary(url) {
  return new Promise((resolve, reject) => {
    $httpClient.get({ url, timeout: 20000, 'binary-mode': true }, (error, response, data) => {
      if (error) return reject(new Error(String(error)));
      if (!response || response.status !== 200) return reject(new Error('WASM HTTP ' + (response && response.status)));
      if (data instanceof Uint8Array) return resolve(data);
      if (data instanceof ArrayBuffer) return resolve(new Uint8Array(data));
      if (data && data.buffer instanceof ArrayBuffer) {
        return resolve(new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength));
      }
      reject(new Error('Loon 未返回二进制 WASM'));
    });
  });
}

function postTask(headers, body) {
  return new Promise((resolve, reject) => {
    $httpClient.post({
      url: IIOS.apiUrl,
      timeout: 20000,
      headers,
      body,
      'auto-cookie': false,
    }, (error, response, data) => {
      if (error) reject(new Error(String(error)));
      else resolve({ response, data });
    });
  });
}

async function decryptResponse(response, data, requestConfig) {
  if (!globalThis.crypto || !globalThis.crypto.subtle || typeof globalThis.crypto.subtle.decrypt !== 'function') {
    throw new Error('Loon 没有 WebCrypto subtle.decrypt');
  }
  const headers = response.headers || {};
  const signature = getHeader(headers, 'x-signature');
  if (!signature) throw new Error('响应没有 x-signature');
  const result = await _0x1387e6({
    status: response.status,
    headers: { 'x-signature': signature },
    data,
    config: requestConfig,
  });
  return JSON.parse(result.d);
}

async function checkIn() {
  if (typeof WebAssembly === 'undefined' || typeof WebAssembly.instantiate !== 'function') {
    throw new Error('当前 Loon 脚本引擎不支持 WebAssembly');
  }
  const token = IIOS.manualToken || $persistentStore.read(IIOS.tokenKey);
  if (!token) throw new Error('尚未捕获 token；请先在浏览器登录 iios.club 并访问任一页面');
  const ua = $persistentStore.read(IIOS.uaKey) || IIOS.defaultUA;
  const cookie = $persistentStore.read(IIOS.cookieKey) || '';

  // Loon Tunnel 将 location / navigator 定义为不可重新配置属性。
  // 不修改运行时全局对象，改由下方 WASM 适配层提供站点环境值。
  _iiosRuntimeUA = ua;

  const wasmBytes = await getBinary(IIOS.wasmUrl);
  await _0x5642a5(wasmBytes);

  const timestamp = Date.now();
  // 与网页中的 Axios 请求拦截器保持一致；UA、Origin、Referer、Cookie
  // 均由浏览器在网络层附加，不应参与 WASM 签名。
  const signingHeaders = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'text/plain',
    'Authorization': 'Basic ' + token,
    'X-Timestamp': timestamp,
  };
  const config = {
    baseURL: '/api',
    url: '/task',
    method: 'post',
    timeout: 120000,
    toast: true,
    showError: true,
    headers: signingHeaders,
    // 网站前端在从 iPhone 主屏幕 Web App 运行时会发送 webapp: true，奖励为每日 2 积分。
    data: JSON.stringify({ type: 2, webapp: true }),
  };
  const encrypted = await function (value) {
    return _0x2cba0b(_0x122b4b.e(_0x3e46a6(value)));
  }(config);
  signingHeaders['X-Signature'] = encrypted.s;
  config.data = encrypted.d;

  const requestHeaders = Object.assign({}, signingHeaders, {
    'User-Agent': ua,
    'Origin': 'https://www.iios.club',
    'Referer': 'https://www.iios.club/',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
  });
  if (cookie) requestHeaders['Cookie'] = cookie;

  const { response, data } = await postTask(requestHeaders, encrypted.d);
  if (!response) throw new Error('无 HTTP 响应');

  if (IIOS.decryptResponse) {
    try {
      const decoded = await decryptResponse(response, data, config);
      const message = decoded.message || (decoded.result && decoded.result.message) || JSON.stringify(decoded);
      if (response.status >= 200 && response.status < 300) notify('请求成功', message);
      else notify('请求失败 ' + response.status, message);
      return;
    } catch (decryptError) {
      console.log('[iios.club] 响应解密失败：' + decryptError.message);
    }
  }
  if (response.status >= 200 && response.status < 300) {
    notify('请求已被服务器接受', 'HTTP ' + response.status + '；响应正文为加密数据');
  } else {
    throw new Error('HTTP ' + response.status + '；响应正文为加密数据');
  }
}

if (typeof $request !== 'undefined') {
  captureCredential();
} else {
  checkIn().catch((error) => notify('执行失败', error.message || String(error))).finally(finish);
}
