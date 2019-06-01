const GLOBAL = require('./global');
module.exports = {
    TM: {
        LayDanhSachTatCaCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachTatCaCongViec"
        },
        LayDanhSachCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachCongViec"
        },
        CapNhatCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CapNhatCongViec"
        },
        LayDanhSachTrangThai: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachTrangThai"
        },
        ThemMoiCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoiCongViec"
        },
        DanhSachNhanSu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachNhanSu"
        },
        DanhSachNhanSuKhongTheoCoCau: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachNhanSuKhongThuocCoCau"
        },
        DanhSachBoPhan: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachBoPhan"
        },
        DanhSachBoPhanKhongThuocCoCau: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachBoPhanKhongThuocCoCau"
        },
        DanhSachNhanSuAll: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachNhanSuAll"
        },
        DanhSachBoPhanAll: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachBoPhanAll"
        },
        DanhSachNhan: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachNhan"
        },
        ThemMoiNhan: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoiNhan"
        },
        CapNhatNhan: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CapNhatNhan"
        },
        XoaNhan: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/XoaNhan"
        },
        DanhSachPhanLoai: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachPhanLoai"
        },
        DanhSachUuTien: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachUuTien"
        },
        LayDanhSachCongViecCha: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachCongViecCha"
        },

        CopyCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CopyCongViec"
        },

        LayDanhSachCongViec_KetQuaDauRa: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachCongViec_KetQuaDauRa"
        },

        ThemMoi_UploadFile: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoi_UploadFile"
        },
        ThemMoi_UploadFileHinhDuLieuBase64: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoi_UploadFileHinhDuLieuBase64"
        },
        CapNhatCongViec_KetQuaDauRa: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CapNhatCongViec_KetQuaDauRa"
        },
        ThemMoiCongViec_KetQuaDauRa: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoiCongViec_KetQuaDauRa"
        },
        XoaCongViec_KetQuaDauRa: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/XoaCongViec_KetQuaDauRa"
        },
        XoaFileDinhKem: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/XoaFileDinhKem"
        },
        LayDanhSachCongViec_KetQuaDauRa_TaiLieu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachCongViec_KetQuaDauRa_TaiLieu"
        },
        ThemMoiCongViec_KetQuaDauRa_TaiLieu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoiCongViec_KetQuaDauRa_TaiLieu"
        },
        CapNhatCongViec_KetQuaDauRa_TaiLieu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CapNhatCongViec_KetQuaDauRa_TaiLieu"
        },
        LayDanhSachFileTaiLieuCongViec: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/LayDanhSachFileTaiLieuCongViec"
        },
        CapNhatFILETaiLieu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CapNhatFILETaiLieu"
        },
        ThemMoiFileTaiLieuTheoLink: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/ThemMoiFileTaiLieuTheoLink"
        },
        XoaCongViec_KetQuaDauRa_TaiLieu: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/XoaCongViec_KetQuaDauRa_TaiLieu"
        },
        DashboardStatusChart: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/DashboardStatusChart"
        },
        DashboardStaffStatusChart: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/DashboardStaffStatusChart"
        },
        DashboardStaffPriorityChart: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/DashboardStaffPriorityChart"
        },
        CalendarTimelineChart: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/CalendarTimelineChart"
        },
        DashboardTimelineChart: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/DashboardTimelineChart"
        },
        //danh sách task theo độ ưu tiên
        StaffPriority: {
            method: "POST",
            url: GLOBAL.serviceURL.tm + "TM/StaffPriority"
        },
    }

};