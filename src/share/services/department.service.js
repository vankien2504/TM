import LibCommonService from './lib-common.service';
import CommonService from './common.service';
import { hasValue, findItem } from './ultility';
const GLOBAL = require('../global.js');
const API = require('../api.js');
const DepartmentService = {
  GetData: function (params) {
    let api = API.TM.DanhSachBoPhan
    return CommonService.GetData(api, params)
  },
  EditData: function (params) {
    let api = API.TM.CapNhatCongViec
    return CommonService.EditData(api, params)
  },
  LayDanhSachTrangThai: function (params) {
    let api = API.TM.LayDanhSachTrangThai
    return CommonService.GetData(api, params)
  },
  LayDanhSachDoUuTien: function (params) {
    let api = API.TM.DanhSachUuTien
    return CommonService.GetData(api, params)
  },
  LayDanhSachPhanLoai: function (params) {
    let api = API.TM.DanhSachPhanLoai
    return CommonService.GetData(api, params)
  },
  LayDanhSachNhan: function (params) {
    let api = API.TM.DanhSachNhan
    return CommonService.GetData(api, params)
  },
  DanhSachTrangThaiTheoTask: function (item) {
    let lst = [];
    let res = [];
    //chưa giao
    if (!item.GiaoCongViec) {
      lst.push(GLOBAL.defaultTrangThai.MoiMo);
      lst.push(GLOBAL.defaultTrangThai.TamDung);
      lst.push(GLOBAL.defaultTrangThai.Khoa);
      lst.push(GLOBAL.defaultTrangThai.Huy);
    }
    //đã giao
    else {
      //là người tạo
      if (item.IsOwner) {
        //là người thực hiện
        if (item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.MoiMo) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.DangThucHien) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.ChoDuyet);
            lst.push(GLOBAL.defaultTrangThai.Dong);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.MoLai) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.Dong) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.Dong);
          }
        }
        //không phài người thực hiện
        else {
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.MoiMo) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.DangThucHien) {
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat) {
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.ChoDuyet);
            lst.push(GLOBAL.defaultTrangThai.Dong);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.MoLai) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
          }
          if (item.IDTrangThai == GLOBAL.defaultTrangThai.Dong) {
            lst.push(GLOBAL.defaultTrangThai.MoLai);
            lst.push(GLOBAL.defaultTrangThai.TamDung);
            lst.push(GLOBAL.defaultTrangThai.Khoa);
            lst.push(GLOBAL.defaultTrangThai.Huy);
            lst.push(GLOBAL.defaultTrangThai.Dong);
          }
        }
      } else {
        //là người thực hiện
        if (item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
          let lstTT = [GLOBAL.defaultTrangThai.DangThucHien,
          GLOBAL.defaultTrangThai.MoiMo,
          GLOBAL.defaultTrangThai.HoanTat];
          if (lstTT.indexOf(item.IDTrangThai) > -1) {
            lst.push(GLOBAL.defaultTrangThai.MoiMo);
            lst.push(GLOBAL.defaultTrangThai.DangThucHien);
            lst.push(GLOBAL.defaultTrangThai.HoanTat);
          } else {
            if (item.IDTrangThai == GLOBAL.defaultTrangThai.MoLai) {
              lst.push(GLOBAL.defaultTrangThai.MoLai);
              lst.push(GLOBAL.defaultTrangThai.DangThucHien);
              lst.push(GLOBAL.defaultTrangThai.HoanTat);
            }
          }
        }
      }
    }


    if (lst.length > 0) {
      lst.sort(function (a, b) { return a - b });
      lst.forEach(s => {
        let temp = findItem(GLOBAL.lstTrangThai, s, "ID");
        if (hasValue(temp) && temp.length > 0) {
          res = res.concat(temp);
        }
      });
    }
    return res;
  },
  helper3: function (param1, param2) {

  }
}

export default DepartmentService;



