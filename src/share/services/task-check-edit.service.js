import LibCommonService from './lib-common.service';
import CommonService from './common.service';
import { hasValue, findItem } from './ultility';
const GLOBAL = require('../global.js');
const API = require('../api.js');

const TaskCheckEditService = {
    checkEditOutput: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Kết quả đầu ra".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai != GLOBAL.defaultTrangThai.MoiMo && !item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Bạn chỉ cập nhật được nội dung "Kết quả đầu ra" của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai != GLOBAL.defaultTrangThai.ChoDuyet)
                && item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Bạn chỉ cập nhật được nội dung "Kết quả đầu ra" chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
        }
        if (item.GiaoCongViec) {
            title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
            description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật "Kết quả đầu ra"';
            result = false;
        }
        return { result: result, title: title, description: description };
    },
    checkDeleteOutput: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không xóa "Kết quả đầu ra"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể xóa "Kết quả đầu ra".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể xóa "Kết quả đầu ra"';
                description = 'Bạn chỉ xóa được "Kết quả đầu ra" của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai != GLOBAL.defaultTrangThai.ChoDuyet)
                && item.GiaoCongViec) {
                title = 'Không thể xóa "Kết quả đầu ra"';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ có thể xóa "Kết quả đầu ra" khi đầu việc ở tình trạng "Chờ duyệt" và không có tài liệu đính kèm của người thực hiện.';
                result = false;
            }
        }
        if (item.GiaoCongViec) {
            title = 'Không thể xóa "Kết quả đầu ra"';
            description = 'Đối với đầu việc bạn được người khác giao, bạn không thể xóa "Kết quả đầu ra"';
            result = false;
        }
        return { result: result, title: title, description: description };
    },
    checkAddOutputFile: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = ' Đối với đầu việc bạn được người khác giao, bạn chỉ thêm mới tài liệu đính kèm của kết quả đầu ra khi ở trạng thái "Mới", "Đang thực hiện", "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = 'Bạn chỉ thêm mới tài liệu đính kèm của kết quả đầu ra của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ có thể thêm mới tài liệu đính kèm của kết quả đầu ra khi đầu việc ở tình trạng "Mới", "Đang thực hiện", "Mở lại" hoặc "Chờ duyệt".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditOutputFile: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = ' Đối với đầu việc bạn được người khác giao, bạn chỉ thêm mới tài liệu đính kèm của kết quả đầu ra khi ở trạng thái "Mới", "Đang thực hiện", "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = 'Bạn chỉ thêm mới tài liệu đính kèm của kết quả đầu ra của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ có thể thêm mới tài liệu đính kèm của kết quả đầu ra khi đầu việc ở tình trạng "Mới", "Đang thực hiện", "Mở lại" hoặc "Chờ duyệt".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkDeleteOutputFile: function (item, file) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong)
                && item.GiaoCongViec
                && file.IDNhanSuTao == GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ xóa tài liệu đính kèm của kết quả đầu ra do mình upload, khi đầu việc ở trạng thái "Mới", "Đang thực hiện", "Mở lại".';
                result = false;
            }
            if (item.GiaoCongViec && file.IDNhanSuTao != GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể xóa tài liệu đính kèm của kết quả đầu ra do người giao upload.';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể xóa tài liệu đính kèm của kết quả đầu ra';
                description = 'Bạn chỉ xóa tài liệu đính kèm của kết quả đầu ra của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && item.GiaoCongViec
                && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ xóa tài liệu đính kèm của kết quả đầu ra do mình upload, khi đầu việc ở tình trạng "Mới", "Đang thực hiện", "Mở lại" hoặc "Chờ duyệt".';
                result = false;
            }
            if (item.GiaoCongViec && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm của kết quả đầu ra';
                description = 'Đối với đầu việc bạn giao cho người khác, bạn không thể xóa tài liệu đính kèm của kết quả đầu ra do người thực hiện upload.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditOtherOutputFile: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm khác';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ thêm mới tài liệu khác khi ở trạng thái "Mới", "Đang thực hiện", "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm khác';
                description = 'Bạn chỉ thêm mới tài liệu đính kèm khác của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && item.GiaoCongViec) {
                title = 'Không thể thêm mới tài liệu đính kèm khác';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ có thể thêm mới tài liệu đính kèm khác, khi đầu việc ở tình trạng "Mới", "Đang thực hiện", "Mở lại" hoặc "Chờ duyệt".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkDeleteOtherOutputFile: function (item, file) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong)
                && item.GiaoCongViec
                && file.IDNhanSuTao == GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm khác';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ xóa tài liệu đính kèm khác do mình upload, khi đầu việc ở trạng thái "Mới", "Đang thực hiện", "Mở lại".';
                result = false;
            }
            if (item.GiaoCongViec && file.IDNhanSuTao != GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm khác';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể xóa tài liệu đính kèm khác do người giao upload.';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể xóa tài liệu đính kèm khác';
                description = 'Bạn chỉ xóa tài liệu đính kèm khác của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && item.GiaoCongViec
                && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm khác';
                description = 'Đối với đầu việc đã giao cho người khác, bạn chỉ xóa tài liệu đính kèm khác do mình upload, khi đầu việc ở tình trạng "Mới", "Đang thực hiện", "Mở lại" hoặc "Chờ duyệt".';
                result = false;
            }
            if (item.GiaoCongViec && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
                title = 'Không thể xóa tài liệu đính kèm khác';
                description = 'Đối với đầu việc bạn giao cho người khác, bạn không thể xóa tài liệu đính kèm khác do người thực hiện upload.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditRelationstaff: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Nhân sự liên quan"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Nhân sự liên quan".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Nhân sự liên quan"';
                description = 'Bạn chỉ cập nhật được nội dung "Nhân sự liên quan" chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Nhân sự liên quan"';
                description = 'Đối với đầu việc đã giao cho người khác, bạn không thể cập nhật nội dung "Nhân sự liên quan".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditOutput: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Kết quả đầu ra".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai != GLOBAL.defaultTrangThai.MoiMo && !item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Bạn chỉ cập nhật được nội dung "Kết quả đầu ra" của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if ((item.IDTrangThai != GLOBAL.defaultTrangThai.ChoDuyet)
                && item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
                description = 'Bạn chỉ cập nhật được nội dung "Kết quả đầu ra" chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
        }
        if (item.GiaoCongViec) {
            title = 'Không thể cập nhật nội dung "Kết quả đầu ra"';
            description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật "Kết quả đầu ra"';
            result = false;
        }
        return { result: result, title: title, description: description };
    },
    checkEditExecuteBy: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật đối tượng chịu trách nhiệm';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật đối tượng chịu trách nhiệm.';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể cập nhật đối tượng chịu trách nhiệm';
                description = 'Bạn chỉ cập nhật được đối tượng chịu trách nhiệm của đầu việc chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật đối tượng chịu trách nhiệm';
                description = 'Đối với đầu việc đã giao cho người khác, bạn không thể cập nhật đối tượng chịu trách nhiệm.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditDepartment: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Bộ phận liên quan"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Bộ phận liên quan".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy)
                && !item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Bộ phận liên quan"';
                description = 'Bạn chỉ cập nhật được nội dung "Bộ phận liên quan" chưa được giao khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Bộ phận liên quan"';
                description = 'Đối với đầu việc đã giao cho người khác, bạn không thể cập nhật nội dung "Bộ phận liên quan".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditEndTimeBefor: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật thời gian nhắc nhở trước hạn cuối';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ cập nhật thời gian nhắc nhở trước hạn cuối khi ở tình trạng "Mới", "Đang thực hiện" hoặc "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy) {
                title = 'Không thể cập nhật thời gian nhắc nhở trước hạn cuối';
                description = 'Bạn chỉ cập nhật được thời gian nhắc nhở trước hạn cuối khi đầu việc chưa được giao.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditStartTimeBefor: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong) {
                title = 'Không thể cập nhật thời gian nhắc nhở trước bắt đầu';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ cập nhật thời gian nhắc nhở trước bắt đầu khi ở tình trạng "Mới", "Đang thực hiện" hoặc "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật thời gian nhắc nhở trước bắt đầu';
                description = 'Bạn chỉ cập nhật được thời gian nhắc nhở trước bắt đầu khi đầu việc chưa được giao.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditEndTime: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật thời gian hạn cuối';
                description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật thời gian hạn cuối của đầu việc.';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong
                || item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy) {
                title = 'Không thể cập nhật thời gian hạn cuối';
                description = 'Bạn chỉ cập nhật thời gian hạn cuối khi đầu việc ở tình trạng "Mới", "Đang thực hiện" hoặc "Mở lại"';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditStartTime: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.HoanTat
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong) {
                title = 'Không thể cập nhật thời gian bắt đầu';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ cập nhật thời gian bắt đầu khi ở tình trạng "Mới", "Đang thực hiện" hoặc "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật thời gian bắt đầu';
                description = 'Bạn chỉ cập nhật được thời gian bắt đầu khi đầu việc chưa được giao.';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditProgess: function (item) {
        let result = true;
        let title = "";
        let description = "";
        // chỉ có điều kiện đầu việc được giao
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            if ((item.IDTrangThai == GLOBAL.defaultTrangThai.TamDung
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Khoa
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Huy
                || item.IDTrangThai == GLOBAL.defaultTrangThai.ChoDuyet
                || item.IDTrangThai == GLOBAL.defaultTrangThai.Dong) && item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Mức độ hoàn thành"';
                description = 'Đối với đầu việc bạn được người khác giao, bạn chỉ cập nhật nội dung "Mức độ hoàn thành" khi ở trạng thái "Mới", "Đang thực hiện" hoặc "Mở lại".';
                result = false;
            }
        }
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Mức độ hoàn thành"';
                description = 'Đối với đầu việc bạn đã giao cho người khác, bạn không thể cập nhật nội dung "Mức độ hoàn thành".';
                result = false;
            }
            if (!item.GiaoCongViec) {
                title = 'Không thể cập nhật nội dung "Mức độ hoàn thành"';
                description = 'Đối với đầu việc chưa giao, bạn không thể cập nhật nội dung "Mức độ hoàn thành".';
                result = false;
            }
        }
        return { result: result, title: title, description: description };
    },
    checkEditName: function (item) {
        let result = true;
        let title = "";
        let description = "";
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai != GLOBAL.defaultTrangThai.MoiMo) {
                title = "Không thể cập nhật nội dung 'Tên gọi'";
                description = 'Bạn chỉ cập nhật được nội dung "Tên gọi" khi đầu việc ở tình trạng "Mới".';
                result = false;
            }
        }
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            title = "Không thể cập nhật nội dung 'Tên gọi'";
            description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Tên gọi".';
            result = false;
        }

        return { result: result, title: title, description: description };
    },
    checkEditDescription: function (item) {
        let result = true;
        let title = "";
        let description = "";
        if (item.IsOwner && item.IDNhanSuThucHienChinh != GLOBAL.userInfo.IDNhanSu) {
            if (item.IDTrangThai != GLOBAL.defaultTrangThai.MoiMo) {
                title = 'Không thể cập nhật nội dung "Mô tả"';
                description = 'Bạn chỉ cập nhật được nội dung "Mô tả" khi đầu việc ở tình trạng "Mới"';
                result = false;
            }
        }
        if (!item.IsOwner && item.IDNhanSuThucHienChinh == GLOBAL.userInfo.IDNhanSu) {
            title = 'Không thể cập nhật nội dung "Mô tả"';
            description = 'Đối với đầu việc bạn được người khác giao, bạn không thể cập nhật nội dung "Mô tả".';
            result = false;
        }
        return { result: result, title: title, description: description };
    }
}
export default TaskCheckEditService;