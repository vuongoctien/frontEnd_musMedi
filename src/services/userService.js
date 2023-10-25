import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { nickName: userEmail, password: userPassword }) // đổi email thành nickName thôi

}

const loginClinic = (userEmail, userPassword) => {
    return axios.post('/api/login-clinic', { nickName: userEmail, password: userPassword }) // đổi email thành nickName thôi

}


const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-user?id=${inputId}`)
}

const createNewUserService = (data) => {
    console.log('check data services', data)
    return axios.post('/api/create-new-user', data)
}

const deleteUserService = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    })
}

const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData)
}

const getAllcodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`)
}

/****************************DOCTOR */

const createDoctor = (data) => { //ok
    return axios.post(`/api/create-new-doctor`, data)
}

const getAllDoctorByClinicId = (idClinic) => { //ok
    return axios.get(`/api/get-all-doctor-by-clinicId?idClinic=${idClinic}`)
}

const editDoctorOfClinic = (newData) => { //ok
    return axios.put(`/api/edit-doctor-of-clinic`, newData)
}

//viết gộp MediPackage vào đây
const createMediPackage = (data) => { //ok
    return axios.post(`/api/create-new-medipackage`, data)
}

const getAllMediPackageByClinicId = (idClinic) => { //ok
    return axios.get(`/api/get-all-medipackage-by-clinicId?idClinic=${idClinic}`)
}

const editMediPackageOfClinic = (newData) => { //ok
    return axios.put(`/api/edit-medipackage-of-clinic`, newData)
}








/***********************SCHEDULE**************************** */
const createSchedule = (data) => { //ok
    return axios.post(`/api/create-schedule`, data)
}

const deleteSchedule = (data) => { //ok wow cú pháp dị biệt, quên
    return axios.delete(`/api/delete-schedule`, {
        data
    })
}

const getSchedule = (query) => { //ok
    return axios.get(`/api/get-schedule?clinicID=${query.clinicID}&dr_or_pk=${query.dr_or_pk}&dr_or_pk_ID=${query.dr_or_pk_ID}`)
}

const getDoctorByIdClinicAndIdDoctor = (query) => { //ok
    return axios.get(`/api/get-doctor-by-idclinic-and-iddoctor?doctorID=${query.doctorID}&clinicID=${query.clinicID}`)
}

const getMediPkByIdClinicAndIdDoctor = (query) => { //ok
    return axios.get(`/api/get-medipk-by-idclinic-and-iddoctor?medi_packageID=${query.medi_packageID}&clinicID=${query.clinicID}`)
}

/*********************************************************** */





////////////////////////////////
const getTopDoctorHomeServices = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorServices = (data) => {
    return axios.post(`/api/save-info-doctors`, data)
}

const getDetailInfoDoctor = (inputId) => { //ok
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const getDetailMediPackageById = (inputId) => { //ok
    return axios.get(`/api/get-detail-medipackage-by-id?id=${inputId}`)
}

const saveBulkCheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInfoDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDocTorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}

/*********SPECIALTY *****************************************************************************/
const createNewSpeciatly = (data) => {
    return axios.post(`/api/create-new-specialty`, data)
}

const getAllSpecialty = () => { //ok
    return axios.get(`/api/get-specialty`)
}

const getDetailSpecialtyById = (id) => { //ok
    return axios.get(`/api/get-detail-speciatly-by-id?id=${id}`)
}

const editSpecialty = (newData) => { //ok
    return axios.put(`/api/edit-specialty`, newData)
}

const deleteSpecialty = (deleteData) => { //ok
    return axios.delete(`/api/delete-specialty`, {
        data: { // mình không hiểu tại sao lại viết thế này, nhưng kệ, chạy được rồi
            id: deleteData
        }
    })
}
/********************************************************************************************** */

/*********CLINIC *****************************************************************************/
const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinic`, data)
}

const getAllClinic = () => {//ok
    return axios.get(`/api/get-clinic`)
}

const getAllDetailClinicById = (id) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${id}`)
}

const editClinic = (newData) => { //ok
    return axios.put(`/api/edit-clinic`, newData)
}

const deleteClinic = (deleteData) => { //ok
    return axios.delete(`/api/delete-clinic`, {
        data: { // mình không hiểu tại sao lại viết thế này, nhưng kệ, chạy được rồi
            id: deleteData
        }
    })
}
/********************************************************************************************** */



export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllcodeService,
    getTopDoctorHomeServices,
    getAllDoctors,
    saveDetailDoctorServices,
    getDetailInfoDoctor,
    getDetailMediPackageById,
    saveBulkCheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInfoDoctorById,
    getProfileDocTorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpeciatly,
    getAllSpecialty,
    getDetailSpecialtyById,
    createNewClinic,
    getAllClinic,
    getAllDetailClinicById,
    editSpecialty,
    deleteSpecialty,
    editClinic,
    deleteClinic,
    loginClinic,
    createDoctor,
    getAllDoctorByClinicId,
    editDoctorOfClinic,
    createMediPackage,
    getAllMediPackageByClinicId,
    editMediPackageOfClinic,
    createSchedule,
    deleteSchedule,
    getSchedule,
    getDoctorByIdClinicAndIdDoctor,
    getMediPkByIdClinicAndIdDoctor,

}
