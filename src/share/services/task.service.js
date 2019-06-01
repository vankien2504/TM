import LibCommonService from './lib-common.service';
import CommonService from './common.service';
import { hasValue, findItem } from './ultility';
const GLOBAL = require('../global.js');
const API = require('../api.js');
const TaskService = {
  GetData: function (params) {
    let api = API.TM.LayDanhSachTatCaCongViec
    return CommonService.GetData(api, params)
  },
  EditData: function (params) {
    let api = API.TM.CapNhatCongViec
    return CommonService.EditData(api, params)
  },
  DeleteData: function (params) {
    let api = API.TM.CapNhatCongViec
    return CommonService.DeleteData(api, params)
  },
  ThemMoiNhan: function (params) {
    let api = API.TM.ThemMoiNhan
    return CommonService.GetData(api, params)
  },
  LayDanhSachTrangThai: function (params) {
    let api = API.TM.LayDanhSachTrangThai
    return CommonService.GetData(api, params)
  },
  LayDanhSachDoUuTien: function (params) {
    let api = API.TM.DanhSachUuTien
    return CommonService.GetData(api, params)
  },
  LayDanhSachThongBao: function (params) {
    // let api = API.TM.DanhSachPhanLoai
    let api = {
      method: "POST",
      url: 'https://noti.ooc.vn/api/noti/LayDanhSachThongBao'
    }
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
  LayDanhSachBoPhan: function (params) {
    let api = API.TM.DanhSachBoPhan
    return CommonService.GetData(api, params)
  },
  LayDanhSachBoPhanKhongThuocCoCau: function (params) {
    let api = API.TM.DanhSachBoPhanKhongThuocCoCau
    return CommonService.GetData(api, params)
  },

  DashboardStaffStatusChart: function (params) {
    let api = API.TM.DashboardStaffStatusChart
    return CommonService.GetDataObject(api, params)
  },
  LayDanhSachNhanSu: function (params) {
    let api = API.TM.DanhSachNhanSu
    return CommonService.GetData(api, params)
  },
  LayDanhSachNhanSuKhongTheoCoCau: function (params) {
    let api = API.TM.DanhSachNhanSuKhongTheoCoCau
    return CommonService.GetData(api, params)
  },
  LayDanhKetQuaDauRa: function (params) {
    let api = API.TM.LayDanhSachCongViec_KetQuaDauRa
    return CommonService.GetData(api, params)
  },
  CapNhatKetQuaDauRa: function (params) {
    let api = API.TM.CapNhatCongViec_KetQuaDauRa
    return CommonService.GetData(api, params)
  },
  CapNhatFILETaiLieu: function (params) {
    let api = API.TM.CapNhatFILETaiLieu
    return CommonService.GetData(api, params)
  },
  XoaCongViec_KetQuaDauRa: function (params) {
    let api = API.TM.XoaCongViec_KetQuaDauRa
    return CommonService.GetData(api, params)
  },
  XoaFileDinhKem: function (params) {
    let api = API.TM.XoaFileDinhKem
    return CommonService.GetData(api, params)
  },
  ThemMoiCongViec_KetQuaDauRa: function (params) {
    let api = API.TM.ThemMoiCongViec_KetQuaDauRa
    return CommonService.GetData(api, params)
  },
  ThemMoiFileTaiLieuTheoLink: function (params) {
    let api = API.TM.ThemMoiFileTaiLieuTheoLink
    return CommonService.GetData(api, params)
  },
  ThemMoiCongViec: function (params) {
    let api = API.TM.ThemMoiCongViec
    return CommonService.CreateData(api, params)
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
  ThemMoi_UploadFileHinhDuLieuBase64(params) {
    let api = API.TM.ThemMoi_UploadFileHinhDuLieuBase64;
    return CommonService.UploadFile(api, params);
  },
  helper3: function (param1, param2) {

  }
}

export default TaskService;



