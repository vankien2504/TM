import LibCommonService from './lib-common.service';
const GLOBAL = require('../global.js');
const API = require('../api.js');
import Moment from 'moment';
import { AsyncStorage } from 'react-native';
const CommonService = {
  GetData: function (api, params) {
    if (params) {
      params = JSON.stringify(params);
    } else {
      params = ""
    }
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: params
        })
          .then(

            function (response) {
              if (response.ok) {

                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  CreateData: function (api, params) {
    if (params) {
      params = JSON.stringify(params);
    } else {
      params = ""
    }
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: params
        })
          .then(

            function (response) {
              if (response.ok) {
                let item = JSON.parse(response._bodyText);
                AsyncStorage.getItem('task').then((res, error) => {
                  if (res) {
                    let taskGroup = JSON.parse(res);
                    taskGroup[0].ListTask.Data.unshift(item.Data[0]);
                    debugger
                    try {
                      AsyncStorage.setItem('task', JSON.stringify(taskGroup));
                    } catch (error) {
                      console.log("Error saving data" + error);
                    }
                  } else {

                  }
                });
                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  GetDataObject: function (api, params) {
    if (params) {
      params = JSON.stringify(params);
    } else {
      params = ""
    }
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: params
        })
          .then(

            function (response) {
              if (response.ok) {

                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  EditData: function (api, params) {
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: JSON.stringify(params)
        })
          .then(
            function (response) {
              if (response.ok) {
                let item = JSON.parse(response._bodyText);
                AsyncStorage.getItem('task').then((res, error) => {
                  if (res) {
                    let taskGroup = JSON.parse(res);
                    for (i = 0; i < taskGroup.length; i++) {
                      for (j = 0; j < taskGroup[i].ListTask.Data.length; j++) {
                        if (taskGroup[i].ListTask.Data[j].ID == item.Data[0].ID) {
                          taskGroup[i].ListTask.Data[j] = item.Data[0];
                        }
                      }
                    }
                    try {
                      AsyncStorage.setItem('task', JSON.stringify(taskGroup));
                    } catch (error) {
                      console.log("Error saving data" + error);
                    }
                  } else {

                  }
                });
                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  DeleteData: function (api, params) {
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: JSON.stringify(params)
        })
          .then(
            function (response) {
              if (response.ok) {
                let item = JSON.parse(response._bodyText);
                AsyncStorage.getItem('task').then((res, error) => {
                  if (res) {
                    let taskGroup = JSON.parse(res);
                    for (i = 0; i < taskGroup.length; i++) {
                      for (j = 0; j < taskGroup[i].ListTask.Data.length; j++) {
                        if (taskGroup[i].ListTask.Data[j].ID == item.Data[0].ID) {
                          taskGroup[i].ListTask.Data.splice(j, 1);
                        }
                      }
                    }
                    try {
                      AsyncStorage.setItem('task', JSON.stringify(taskGroup));
                    } catch (error) {
                      console.log("Error saving data" + error);
                    }
                  } else {

                  }
                });
                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  GetUser: function (api) {
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Data-type": "json",
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token,
            "AppDomain": "tm"
          })
        })
          .then(
            function (response) {
              if (response.ok) {

                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
  UploadFile: function (api, params) {
    return new Promise(
      function (resolve, reject) {
        fetch(api.url, {
          method: api.method,
          headers: new Headers({
            "Authorization": 'Bearer ' + GLOBAL.Token.access_token
          }),
          body: (params)
        })
          .then(
            function (response) {
              if (response.ok) {
                resolve(response.text());
              }
              else {
                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
              }
            }
          )
          .catch(
            function (error) {
              reject(new Error(`Unable to retrieve events.\n${error.message}`));
            }
          );
      }
    );
  },
}
export default CommonService;

