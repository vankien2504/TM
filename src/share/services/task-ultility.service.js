import { AsyncStorage } from "react-native";
import LibCommonService from './lib-common.service';
import CommonService from './common.service';
import { hasValue, findItem } from './ultility';
import TaskService from "./task.service";
const GLOBAL = require('../global.js');
const API = require('../api.js');
import moment from 'moment';
const TaskUltilityService = {
    TaskListAll: function () {
        return new Promise((resolve, reject) => {
            let today = new Date();
            let date2 = new Date(new Date().setDate(today.getDate() - 30));
            let dateStart = moment(date2).format('YYYY-MM-DDT00-00-01');
            let dateEnd = moment(today).format('YYYY-MM-DDT23-59-59');
            let param = {
                "request": [
                    { "Page": 1, "PageSize": 50, "GroupType": 1, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                    { "Page": 1, "PageSize": 50, "GroupType": 2, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                    { "Page": 1, "PageSize": 50, "GroupType": 4, "Filter": "(Today~eq~true~or~Trehan~eq~true)~and~(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "NgayDoiTinhTrang-asc" },
                    { "Page": 1, "PageSize": 50, "GroupType": 8, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" },
                    { "Page": 1, "PageSize": 50, "GroupType": 3, "Filter": "(IDTrangThai~neq~8~and~IDTrangThai~neq~4~and~IDTrangThai~neq~3~and~IDTrangThai~neq~10~and~IDTrangThai~neq~9)", "Sort": "LevelCode-asc" },
                    { "Page": 1, "PageSize": 50, "GroupType": 7, "Filter": "NgayDuyet~gte~datetime'" + dateStart + "'~and~NgayDuyet~lt~datetime'" + dateEnd + "'", "Sort": "LevelCode-asc" }
                ]
            }
            TaskService.GetData(param).then((res) => {
                let taskWaitingObject = JSON.parse(res)

                try {
                    AsyncStorage.setItem('task', res);
                    resolve(true);
                } catch (error) {
                    console.log("Error saving data" + error);
                    reject('Error')
                }
            });



        })

    },
    TaskFilter: function (taskWaitingObject) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('filterTask').then((res, error) => {
                if (res) {
                    let filterTaskObject = JSON.parse(res)
                    if (filterTaskObject.departmentList && filterTaskObject.departmentList.length > 0) {
                        for (i = 0; i < taskWaitingObject.length; i++) {

                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.IDDonVi || filterTaskObject.departmentList.indexOf(f.IDDonVi) < 0)
                            });
                        }
                    }
                    if (filterTaskObject.employeeList && filterTaskObject.employeeList.length > 0) {
                        for (i = 0; i < taskWaitingObject.length; i++) {

                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.IDNhanSuThucHienChinh || filterTaskObject.employeeList.indexOf(f.IDNhanSuThucHienChinh) < 0)
                            });
                        }
                    }
                    if (filterTaskObject.statusList && filterTaskObject.statusList.length > 0) {
                        for (i = 0; i < taskWaitingObject.length; i++) {
                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.IDTrangThai || filterTaskObject.statusList.indexOf(f.IDTrangThai) < 0)
                            });
                        }
                    }
                    if (filterTaskObject.priorityList && filterTaskObject.priorityList.length > 0) {
                        for (i = 0; i < taskWaitingObject.length; i++) {
                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.IDUuTien || filterTaskObject.priorityList.indexOf(f.IDUuTien) < 0)
                            });
                        }
                    }
                    if (filterTaskObject.tagList && filterTaskObject.tagList.length > 0) {

                        for (i = 0; i < taskWaitingObject.length; i++) {
                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.lstNhan || !this.FindArrayInArray(f.lstNhan, filterTaskObject.tagList))
                            });
                        }
                    }
                    if (filterTaskObject.fromDate && filterTaskObject.toDate) {
                        for (i = 0; i < taskWaitingObject.length; i++) {
                            taskWaitingObject[i].ListTask.Data = taskWaitingObject[i].ListTask.Data.filter(f => {
                                return !(!f.KetThucEst || !(moment(f.KetThucEst).format('YYYY-MM-DD') >= moment(filterTaskObject.fromDate).format('YYYY-MM-DD') && moment(f.KetThucEst).format('YYYY-MM-DD') <= moment(filterTaskObject.toDate).format('YYYY-MM-DD')))
                            });
                        }
                    }
                    resolve(taskWaitingObject);
                } else {
                    reject('Error')
                }
            });
        })
    },
    TaskSort: function (taskWaitingObject) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('sortTask').then((res, error) => {
                if (res) {
                    let sortTaskObject = JSON.parse(res);
                    if (sortTaskObject.sortBy) {
                        if (sortTaskObject.sortType == 1) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.MoTaCongViec > b.MoTaCongViec) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 2) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.IDUuTien > b.IDUuTien) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 3) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.MucDoHoanThanh > b.MucDoHoanThanh) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 4) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.BatDau > b.BatDau) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 5) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.KetThucEst > b.KetThucEst) ? 1 : -1)
                            }
                        }

                    } else {
                        if (sortTaskObject.sortType == 1) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.MoTaCongViec < b.MoTaCongViec) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 2) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.IDUuTien < b.IDUuTien) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 3) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.MucDoHoanThanh < b.MucDoHoanThanh) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 4) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.BatDau < b.BatDau) ? 1 : -1)
                            }
                        }
                        if (sortTaskObject.sortType == 5) {
                            for (i = 0; i < taskWaitingObject.length; i++) {
                                taskWaitingObject[i].ListTask.Data.sort((a, b) => (a.KetThucEst < b.KetThucEst) ? 1 : -1)
                            }
                        }

                    }
                    resolve(taskWaitingObject);
                } else {
                    reject('Error')
                }

            });
        })
    },
}
export default TaskUltilityService