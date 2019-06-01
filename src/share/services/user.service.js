import LibCommonService from './lib-common.service';
import CommonService from './common.service';
const GLOBAL = require('../global.js');
const API = require('../api.js');
const UserService = {
  GetData: function () {
    let api = { url: GLOBAL.serviceURL.urlIDServer + 'api/USER/USER_UserProfile_GetCurrentUser', method: 'GET' };
    return CommonService.GetUser(api);
  },
  EditData: function (params) {
    let api = API.TM.CapNhatCongViec
    return CommonService.EditData(api, params)
  },
  helper3: function (param1, param2) {

  }
}

export default UserService;



