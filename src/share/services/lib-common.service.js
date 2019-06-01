const LibCommonService = {
    connect: function (pmethod, URL, data) {
        fetch(URL, {
            method: pmethod,
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Authorization": 'Basic ' + 'bW9iaWxlOm1vYmlsZW1pc29jZA=='
            }),
            body: data

        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })

    },
    connectWithAuth: function (pmethod, URL, data, token) {
        let headers = new HttpHeaders({
            "Data-type": "json",
            'Content-type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + token,
            //'withCredentials': true
        });
        let options = { headers: headers, withCredentials: true, params: undefined };

        if (pmethod == "GET") {
            options.params = data;
            return this.http.get(URL, options).toPromise();
        }
        else if (pmethod == "POST") {
            return this.http.post(URL, JSON.stringify(data), options).toPromise();
        }
        else if (pmethod == "PUT") {
            return this.http.put(URL, data, options).toPromise();
        }
        else if (pmethod == "DELETE") {
            return this.http.delete(URL, options).toPromise();
        }
    }
}

export default LibCommonService;



// export function connectWithAuthUploadFile(pmethod, URL, data, token) {

//     let headers = new HttpHeaders({
//         // 'Content-type': undefined,
//         'Authorization': 'Bearer ' + token,
//     });
//     let options = { headers: headers, withCredentials: true, params: undefined };

//     if (pmethod == "GET") {
//         options.params = data;
//         return this.http.get(URL, options).toPromise();
//     }
//     else if (pmethod == "POST") {
//         return this.http.post(URL, data, options).toPromise();
//     }
//     else if (pmethod == "PUT") {
//         return this.http.put(URL, data, options).toPromise();
//     }
//     else if (pmethod == "DELETE") {
//         return this.http.delete(URL, options).toPromise();
//     }
// }

// connectSync(pmethod, URL, pdata) {
//     let that = this;
//     return new Promise(function (resolve, reject) {
//         that.connect(pmethod, URL, pdata)
//             .then(data => {
//                 resolve(data);
//             }).catch(err => {
//                 reject(err);
//                 return Promise.reject(err.message || err);
//             });
//     });
// }

// connectServer(pmethod, URL, pdata, withCredentials = true) {
//     let that = this;
//     if (withCredentials) {
//         return new Promise((resolve, reject) => {
//             //get token
//             that.getLocal("token", function (localToken) {

//                 if (localToken != undefined) {
//                     var bearToken = JSON.parse(localToken);
//                     if (bearToken != undefined && bearToken != "") {
//                         that.connectWithAuth(pmethod, URL, pdata, bearToken.access_token)
//                             .then((data) => {
//                                 resolve(data);
//                             }).catch(error => {
//                                 console.log(error);
//                                 if (error.status == 401) {
//                                     that.saveLocal('token', "");
//                                     //$state.go('account.login');
//                                     //defer.resolve({ status: error.status, error: error.statusText, errorCode: "NotAuthorized" });
//                                 } else if (error.status == 403) {
//                                     //notify({ message: 'Bạn không có quyền truy cập/cập nhật...', classes: 'alert-warning', templateUrl: app_setting.template.notify });
//                                     //defer.resolve(error.data);
//                                 } else if (error.status == 404) {
//                                     //notify({ message: 'Không tìm thấy dữ liệu...', classes: 'alert-warning', templateUrl: app_setting.template.notify });
//                                     // defer.reject(error.data);
//                                 }
//                                 reject(error);
//                             })
//                     } else {
//                         that.saveLocal('token', "");
//                         //chuyển về trang đăng nhập
//                         //  $state.go('account.login');
//                         reject({ status: 403 });
//                     }
//                 } else {
//                     that.saveLocal('token', "");
//                     //chuyển về trang đăng nhập
//                     //  $state.go('account.login');
//                     reject({ status: 403 });
//                 }
//             });

//         });
//     } else {
//         return this.connectSync(pmethod, URL, pdata);
//     }

// }
// connectServerUploadFile(pmethod, URL, pdata) {
//     let that = this;
//     return new Promise((resolve, reject) => {
//         //get token
//         that.getLocal("token", function (localToken) {
//             if (localToken != undefined) {
//                 var bearToken = JSON.parse(localToken);
//                 if (bearToken != undefined && bearToken != "") {
//                     that.connectWithAuthUploadFile(pmethod, URL, pdata, bearToken.access_token)
//                         .then((data) => {
//                             resolve(data);
//                         }).catch(error => {
//                             console.log(error);
//                             if (error.status == 401) {
//                                 that.saveLocal('token', "");
//                                 //$state.go('account.login');
//                                 //defer.resolve({ status: error.status, error: error.statusText, errorCode: "NotAuthorized" });
//                             } else if (error.status == 403) {
//                                 //notify({ message: 'Bạn không có quyền truy cập/cập nhật...', classes: 'alert-warning', templateUrl: app_setting.template.notify });
//                                 //defer.resolve(error.data);
//                             } else if (error.status == 404) {
//                                 //notify({ message: 'Không tìm thấy dữ liệu...', classes: 'alert-warning', templateUrl: app_setting.template.notify });
//                                 // defer.reject(error.data);
//                             }
//                             reject(error);
//                         })
//                 } else {
//                     that.saveLocal('token', "");
//                     //chuyển về trang đăng nhập
//                     //  $state.go('account.login');
//                 }
//             } else {
//                 that.saveLocal('token', "");
//                 //chuyển về trang đăng nhập
//                 //  $state.go('account.login');
//             }
//         });

//     });


// }

// //lấy dữ liệu lưu trên client
// getLocal(key, callback) {
//     var result = null;
//     callback(localStorage.getItem(key));
// }
// //lưu dữ liệu  trên client
// saveLocal(key, value) {
//     // var saveItem = {
//     //   date: new Date(),
//     //   value: value
//     // };
//     const saveItem = value;
//     localForage.setItem(key, JSON.stringify(saveItem));
// }


