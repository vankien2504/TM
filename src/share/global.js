module.exports = {
    strSaveLocalFilter: "FilterOptions",
    CheckLogin: false,
    Token: {
        access_token: "",
        expires_in: 0,
        token_type: "",
        refresh_token: ""
    },
    userNews: {
        profile: "",
        rId: [],
        role: [],
        company: "",
        listPermission: [],
        preferred_username: "",
        sub: "",
        id: ""
    },
    userInfo: {
        IDCongTy: 0,
        IDNhanSu: 0,
        Roles: [],
        StaffCode: "",
        UserId: 0,
        UserName: "",
        companyInfo: {},
        listPermission: []
    }
    ,
    serviceURL: {
        //--Demo--
        // urlIDServer: "http://id.cst.3ps.vn/",
        // idapi: "http://id.cst.3ps.vn/api/",
        // base: "http://base.cst.3ps.vn/api/base/",
        // ost: "http://id.cst.3ps.vn/api/ost/",
        // cat: "http://id.cst.3ps.vn/api/cat/",
        // hrm: "http://hrm.cst.3ps.vn/api/v001/",
        // sale: "http://id.cst.3ps.vn/api/sale/",
        // bsc: "http://id.cst.3ps.vn/api/bsc/",
        // tm: "http://id.cst.3ps.vn/api/tm/",

        // urlIDServer: "http://id.hrs.demo.3ps.vn:89/",
        // idapi: "http://id.hrs.demo.3ps.vn:89/api/",
        // base: "http://base.hrs.demo.3ps.vn:89/api/base/",
        // ost: "http://id.hrs.demo.3ps.vn:89/api/ost/",
        // cat: "http://id.hrs.demo.3ps.vn:89/api/cat/",
        // hrm: "http://hrm.demo.3ps.vn:89/api/v001/",
        // sale: "http://id.hrs.demo.3ps.vn:89/api/sale/",
        // bsc: "http://id.hrs.demo.3ps.vn:89/api/bsc/",
        // tm: "http://id.hrs.demo.3ps.vn:89/api/tm/",

        urlIDServer: "https://id.ooc.vn/",
        base: "https://base.ooc.vn/api/base/",
        ost: "https://id.ooc.vn/api/ost/",
        cat: "https://id.ooc.vn/api/cat/",
        hrm: "https://hrm.cst.ooc.vn/api/v001/",
        web: "https://id.ooc.vn/api/web/",
        sale: "https://id.ooc.vn/api/sale/",
        bsc: "https://id.ooc.vn/api/bsc/",
        tm: "https://id.ooc.vn/api/tm/",

        ////--Offline--
        // urlIDServer: "http://localhost:12460/",
        // idapi: "http://localhost:12460/api/",
        // base: "http://localhost:1304/api/base/",
        // ost: "http://localhost:12460/api/ost/",
        // cat: "http://localhost:12460/api/cat/",
        // hrm: "http://localhost:4950/api/v001/",
        // sale: "http://localhost:12460/api/sale/",
        // bsc: "http://localhost:12460/api/bsc/",
        // tm: "http://localhost:12460/api/tm/",
    },
    serverURL: {
        // cat: "http://cst.3ps.vn/#/cat/",
        // ost: "http://cst.3ps.vn/#/ost/",
        // hrm: "http://hrm.cst.3ps.vn/",
        // bsc: "http://cst.3ps.vn/#/bsc/",
        // setting: "/",

        cat: "http://hrs.demo.3ps.vn:89/#/cat/",
        ost: "http://hrs.demo.3ps.vn:89/#/ost/",
        hrm: "http://hrm.demo.3ps.vn:89/",
        bsc: "http://hrs.demo.3ps.vn:89/#/bsc/",
        tm: "http://hrs.demo.3ps.vn:89/#/bsc/",
        setting: "/",
    },
    clientSecret: "bW9iaWxlOm1vYmlsZW1pc29jZA==",
    defaultTrangThai: {
        MoiMo: 1,
        DangThucHien: 2,
        TamDung: 3,
        Khoa: 4,
        MoLai: 5,
        HoanTat: 6,
        ChoDuyet: 7,
        Dong: 8,
        KhongDuyet: 9,
        Huy: 10
    },
    defaultOutputType: {
        other: 0,
        attach: 1,
        link: 2,
    },
    TrangThaiTreHan: { ID: -1, Name: "Trễ hạn", Color: "#fe3442" },
    lstTrangThai: [],
    lstPhanLoai: [],
    lstDoUuTien: [],
    lstLoaiKetQuaDauRa: [
        { ID: 0, Ten: "File đính kèm" },
        { ID: 1, Ten: "Cuộc họp" },
        { ID: 2, Ten: "Link" }
    ],
    ConfigDashboard: {
        height: 350
    },
    lstThoiGian: [
        { ID: 0, Ten: "Phút" },
        { ID: 1, Ten: "Giờ" },
        { ID: 2, Ten: "Ngày" },
        { ID: 3, Ten: "Tuần" },
        { ID: 4, Ten: "Tháng" },
    ],
    lstNhan: [],
    defaultUuTien: {
        P1: 1,
        P2: 2,
        P3: 3,
        P4: 4,
    }

};
