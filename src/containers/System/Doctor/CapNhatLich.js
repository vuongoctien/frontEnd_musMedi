import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
import './CapNhatLich.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import Select from 'react-select'
import DatePicker from '../../../components/Input/DatePicker';
import {
    getDoctorByIdClinicAndIdDoctor,
    getMediPkByIdClinicAndIdDoctor,
    createSchedule,
    deleteSchedule,
    getSchedule
} from '../../../services/userService';
import { toast } from 'react-toastify';
import FooterClinic from '../../Footer/FooterClinic';

class CapNhatLich extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedArea: { "label": "Chỉ 1 ngày", "value": 0 },
            list_Khung_Gio_Da_Tao: [],
            thisDr_or_Pk: {},
            all_schedule: [],

            getDateSelected: '',
            getMonthSelected: '',
            getFullYearSelected: '',
        }
    }

    async componentDidMount() {

        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:orange;")
        if (this.props.match.params.dr_or_pk === '1') {
            let res = await getDoctorByIdClinicAndIdDoctor({
                doctorId: this.props.match.params.dr_or_pk_ID,
                clinicID: this.props.userInfo.id
            })
            this.setState({ thisDr_or_Pk: res.doctorData })
        }
        if (this.props.match.params.dr_or_pk === '0') {
            let res = await getMediPkByIdClinicAndIdDoctor({
                medi_packageID: this.props.match.params.dr_or_pk_ID,
                clinicID: this.props.userInfo.id
            })
            this.setState({ thisDr_or_Pk: res.medi_packageData })
        }
        document.title = `${this.state.thisDr_or_Pk.name} | ${this.props.userInfo.name}`
        let res = await getSchedule({
            clinicID: this.props.userInfo.id,
            dr_or_pk: this.props.match.params.dr_or_pk,
            dr_or_pk_ID: this.state.thisDr_or_Pk.id
        })
        console.log('res', res)
        this.setState({ all_schedule: res.all_schedule })
        console.log('this.state.all_schedule', this.state.all_schedule)

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            getDateSelected: date[0].getDate(),
            getMonthSelected: +date[0].getMonth() + 1,
            getFullYearSelected: date[0].getFullYear(),
        })
    }

    handleChangeArea = (selectedArea) => {
        this.setState({ selectedArea: selectedArea })
    }

    getDaytoString = (number) => {
        switch (number) {
            case 0:
                return 'Chủ Nhật'
                break;
            case 1:
                return 'Thứ Hai'
                break
            case 2:
                return 'Thứ Ba'
                break
            case 3:
                return 'Thứ Tư'
                break
            case 4:
                return 'Thứ Năm'
                break
            case 5:
                return 'Thứ Sáu'
                break
            case 6:
                return 'Thứ Bảy'
                break
            default:
                break;
        }
    }

    dom = (number) => { return document.getElementsByClassName('inputClockDOM')[number].value }

    NUMtoSTR = (number) => {
        if (this.dom(number) < 10) return '0' + this.dom(number)
        else return this.dom(number)
    }

    ThemKhungGio = () => {
        if (!this.dom(0) || !this.dom(1) || !this.dom(2) || !this.dom(3)) {
            alert('Vui lòng điền đầy đủ thông tin')
        } else {
            let string = ''
            string = this.NUMtoSTR(0) + ':' + this.NUMtoSTR(1) + '-' + this.NUMtoSTR(2) + ':' + this.NUMtoSTR(3)
            this.state.list_Khung_Gio_Da_Tao.push(string)
            this.setState({ render: 0 })
        }
    }

    TaoLichBieu = () => {
        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        /* Đây là trường hợp this.state.list_Khung_Gio_Da_Tao có phần tử rồi, 
        mảng mới được duyệt và API mới được gọi
        Muốn làm rỗng lịch thì chạy xuống hàm bên dưới*/
        if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
            alert('Bạn chưa chọn khung giờ')
            toast.error('Bạn chưa chọn khung giờ')
        } else {
            if (window.confirm(`Bạn muốn cập nhật lịch liểu cho ${this.state.thisDr_or_Pk.name}?`) === true) {
                if (this.state.selectedArea.value === 0) { // trường hợp Chọn 1 ngày
                    this.state.list_Khung_Gio_Da_Tao.map(async item => { // duyệt mảng khung giờ
                        let res = await createSchedule({
                            date: yy + '-' + mm + '-' + dd,
                            clinicID: this.props.userInfo.id,
                            dr_or_pk: this.props.match.params.dr_or_pk,
                            dr_or_pk_ID: this.props.match.params.dr_or_pk_ID,
                            clockTime: item
                        })
                        if (res && res.errCode === 0) toast.success('Thêm lịch thành công')
                        if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                        if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                        if (!res) toast.error('Lỗi chưa xác định')
                    })
                }

                if (this.state.selectedArea.value === 1) { // trường hợp Chọn mỗi thứ mấy
                    for (let i = 0; i < 3; i++) {
                        this.state.list_Khung_Gio_Da_Tao.map(async item => {
                            let NgayCanXuLy = new Date(yy, +mm - 1, +dd + i * 7)
                            let d = NgayCanXuLy.getDate()
                            let m = +NgayCanXuLy.getMonth() + 1
                            let y = NgayCanXuLy.getFullYear()
                            let stringNgayCanXuLy = y + '-' + m + '-' + d
                            let res = await createSchedule({
                                date: stringNgayCanXuLy,
                                clinicID: this.props.userInfo.id,
                                dr_or_pk: this.props.match.params.dr_or_pk,
                                dr_or_pk_ID: this.props.match.params.dr_or_pk_ID,
                                clockTime: item
                            })
                            if (res && res.errCode === 0) toast.success('Thêm lịch thành công')
                            if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                            if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                            if (!res) toast.error('Lỗi chưa xác định')
                        })
                    }
                }

                if (this.state.selectedArea.value === 2) { // trường hợp Chọn mỗi ngày
                    for (let i = 0; i < 21; i++) {
                        this.state.list_Khung_Gio_Da_Tao.map(async item => {
                            let NgayCanXuLy = new Date(yy, +mm - 1, +dd + i)
                            let d = NgayCanXuLy.getDate()
                            let m = +NgayCanXuLy.getMonth() + 1
                            let y = NgayCanXuLy.getFullYear()
                            let stringNgayCanXuLy = y + '-' + m + '-' + d
                            let res = await createSchedule({
                                date: stringNgayCanXuLy,
                                clinicID: this.props.userInfo.id,
                                dr_or_pk: this.props.match.params.dr_or_pk,
                                dr_or_pk_ID: this.props.match.params.dr_or_pk_ID,
                                clockTime: item
                            })
                            if (res && res.errCode === 0) toast.success('Thêm lịch thành công')
                            if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                            if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                            if (!res) toast.error('Lỗi chưa xác định')
                        })
                    }
                }
            }
        }
    }

    LamRongLich = async () => {
        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
            if (window.confirm(`Bạn muốn làm rỗng lịch cho ${this.state.thisDr_or_Pk.name}?`) === true) {
                if (this.state.selectedArea.value === 0) { // trường hợp Chọn 1 ngày
                    let res = await deleteSchedule({
                        date: yy + '-' + mm + '-' + dd,
                        clinicID: this.props.userInfo.id,
                        dr_or_pk: this.props.match.params.dr_or_pk,
                        dr_or_pk_ID: this.props.match.params.dr_or_pk_ID,

                    })
                    if (res && res.errCode === 0) toast.success('Xóa lịch thành công')
                    if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                    if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                    if (!res) toast.error('Lỗi chưa xác định')
                }

                if (this.state.selectedArea.value === 1) { // trường hợp Chọn mỗi thứ mấy
                    for (let i = 0; i < 3; i++) {

                        let NgayCanXuLy = new Date(yy, +mm - 1, +dd + i * 7)
                        let d = NgayCanXuLy.getDate()
                        let m = +NgayCanXuLy.getMonth() + 1
                        let y = NgayCanXuLy.getFullYear()
                        let stringNgayCanXuLy = y + '-' + m + '-' + d
                        let res = await deleteSchedule({
                            date: stringNgayCanXuLy,
                            clinicID: this.props.userInfo.id,
                            dr_or_pk: this.props.match.params.dr_or_pk,
                            dr_or_pk_ID: this.props.match.params.dr_or_pk_ID
                        })
                        if (res && res.errCode === 0) toast.success('Xóa lịch thành công')
                        if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                        if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                        if (!res) toast.error('Lỗi chưa xác định')

                    }
                }

                if (this.state.selectedArea.value === 2) { // trường hợp Chọn mỗi ngày
                    for (let i = 0; i < 21; i++) {

                        let NgayCanXuLy = new Date(yy, +mm - 1, +dd + i)
                        let d = NgayCanXuLy.getDate()
                        let m = +NgayCanXuLy.getMonth() + 1
                        let y = NgayCanXuLy.getFullYear()
                        let stringNgayCanXuLy = y + '-' + m + '-' + d
                        let res = await deleteSchedule({
                            date: stringNgayCanXuLy,
                            clinicID: this.props.userInfo.id,
                            dr_or_pk: this.props.match.params.dr_or_pk,
                            dr_or_pk_ID: this.props.match.params.dr_or_pk_ID
                        })
                        if (res && res.errCode === 0) toast.success('Xóa lịch thành công')
                        if (res && res.errCode === 1) toast.error('Vui lòng điền đầy đủ thông tin')
                        if (res && res.errCode === -1) toast.error('Lỗi máy chủ')
                        if (!res) toast.error('Lỗi chưa xác định')

                    }
                }
            }
        } else {
            alert('Lựa chọn không khả dụng do bạn đã tạo khung giờ')
            toast.error('Lựa chọn không khả dụng do bạn đã tạo khung giờ')
        }
    }


    render() {
        // console.log('this.props is ', this.props)
        // console.log('test', new Date(this.props.match.params.yy, this.props.match.params.mm - 1, +this.props.match.params.dd + 10))
        // phải thêm dấu cộng ở đầu biến, nếu không nó hiểu là nối chuỗi

        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        return (
            <div className=''>
                <div className='full'>
                    <div className='head row'>
                        <div className='col-1'>
                            <div className='avatar' style={{ backgroundImage: `url(${this.state.thisDr_or_Pk.image})` }}></div>
                        </div>
                        <div className='col-5'>
                            <h1>Cập nhật lịch biểu</h1>
                            <h6>
                                cho {this.props.match.params.dr_or_pk === '1' ? 'bác sĩ' : 'gói dịch vụ'}: {this.state.thisDr_or_Pk.name}
                            </h6>
                            <h6>
                                của Cơ sở y tế: {this.props.userInfo.name}
                            </h6>
                        </div>
                        <div className='col-4'>
                            <label>Chọn ngày:</label> <br />
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                minDate={new Date(new Date().setDate(new Date().getDate()))} // yesterday
                            />
                            <label>(Lưu ý: để chọn lại hôm nay, vui lòng trở về trang Lịch Biểu,
                                rồi bấm vào tên bác sĩ/gói dịch vụ.
                                Xin lỗi vì sự bất tiện)</label>
                        </div>
                        <div className='col-2'>
                            <label><br /></label> <br />
                            <a href={`/system/CapNhatLich/${this.state.getDateSelected}&${this.state.getMonthSelected}&${this.state.getFullYearSelected}&${this.props.match.params.dr_or_pk_ID}&${this.props.match.params.dr_or_pk}`}>
                                {/* Đã hiểu, không được xuống dòng */}
                                <button type="button" class="btn btn-success">Chọn</button>
                            </a>
                        </div>
                    </div>
                    <hr />
                    <div className='body'>
                        <div className='body-left'>
                            <h3 style={{ color: 'blue' }}>Ngày được chọn: {this.props.match.params.dd}/
                                {this.props.match.params.mm}/
                                {this.props.match.params.yy}
                            </h3>
                            <br />
                            <div className='taokhungio row'>
                                <div className='col-2'>
                                    <h5>Tạo khung giờ:</h5>
                                </div>
                                <div className='col-7'>
                                    <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" />
                                    &nbsp;:&nbsp;
                                    <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" />
                                    &nbsp;-&nbsp;
                                    <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" />
                                    &nbsp;:&nbsp;
                                    <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" />
                                    &emsp;
                                    <button type="button" class="btn btn-secondary" onClick={() => this.ThemKhungGio()}>Thêm</button>
                                </div>
                                <div className='col-3'>
                                    <Select
                                        value={this.state.selectedArea}
                                        onChange={this.handleChangeArea}
                                        options={[
                                            { "label": "Chỉ 1 ngày", "value": 0 },
                                            { "label": `Mỗi ${this.getDaytoString(new Date(yy, +mm - 1, dd).getDay())} trong 3 tuần tới`, "value": 1 },
                                            { "label": "Mỗi ngày trong 21 ngày tới", "value": 2 }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className='khungiodatao'>
                                Các khung giờ vừa tạo sẽ xuất hiện ở đây:&emsp;
                                {this.state.list_Khung_Gio_Da_Tao.map(item => {
                                    return (<button>{item}</button>)
                                })}
                            </div>
                            <div className='button1'>
                                <div className='col-3'>
                                    <button type="button" class="btn btn-primary" onClick={() => this.TaoLichBieu()} > Tạo lịch biểu</button>
                                </div>
                                <div className='col-9'>
                                    <p>Với lựa chọn "Tạo lịch biểu", lịch khám mới tạo sẽ được bổ sung vào lịch khám cũ.<br />
                                        Để tránh trùng lặp, bạn có thể lựa chọn "Làm rỗng lịch" trước khi tạo lịch khám mới.<br />
                                        Xin lỗi vì sự bất tiện này, đội lập trình của chúng tôi chưa biết cách xử lý bất đồng bộ JavaScript
                                    </p>
                                </div>
                            </div>
                            <div className='button2'>
                                <div className='col-3'>
                                    <button type="button" class="btn btn-danger" onClick={() => this.LamRongLich()} > Làm rỗng lịch</button>
                                </div>
                                <div className='col-9'>
                                    <p>(Xóa toàn bộ lịch khám đã tồn tại trong các ngày đã chọn)</p>
                                </div>
                            </div>
                        </div>
                        {/* <div className='body-right'>
                            <h5>Giá khám:</h5>
                            <textarea className='form-control' rows='10' id='giakham'></textarea>
                        </div> */}
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='col-9'>
                            <h1>Xem lịch khám trong 8 tuần tới</h1>
                            <h5>
                                của {this.props.match.params.dr_or_pk === '1' ? 'bác sĩ' : 'gói dịch vụ'}: {this.state.thisDr_or_Pk.name}
                            </h5>
                        </div>
                        <div className='col-3'>
                            <h4>Ngày được chọn: </h4>
                            <h2>
                                {this.props.match.params.dd}/
                                {this.props.match.params.mm}/
                                {this.props.match.params.yy}
                            </h2>
                        </div>
                    </div>
                    <div className='lich'>
                        {[0, 1, 2, 3, 4, 5, 6, 7] && [0, 1, 2, 3, 4, 5, 6, 7].map((item, index1) => {
                            return (
                                <div className='lichRow row'>
                                    {[0, 1, 2, 3, 4, 5, 6] && [0, 1, 2, 3, 4, 5, 6].map((item, index2) => {
                                        // let date = (new Date(new Date().setDate(this.state.selectedDate.getDate() + index1 * 7 + index2)))
                                        let date = new Date(yy, +mm - 1, +dd + index1 * 7 + index2)
                                        let getDateThemSo_0 = (date) => {
                                            let number = date.getDate()
                                            if (number < 10) number = '0' + number
                                            return number
                                        }
                                        let stringDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + getDateThemSo_0(date)
                                        let arrFilter = this.state.all_schedule.filter(item => item.date === stringDate)
                                        arrFilter = arrFilter.map(item => item.clockTime)
                                        arrFilter = arrFilter.sort()
                                        return (
                                            <div className='col'>
                                                <div className='thu_ngay_thang'>
                                                    <h2>{date.getDate()}</h2>
                                                    <i>{date.getMonth() + 1}/{date.getFullYear()}</i>
                                                    <br />
                                                    <br />
                                                    <p>{this.getDaytoString(date.getDay())}</p>
                                                </div>
                                                <div className='list_khung_gio'>
                                                    {arrFilter && arrFilter.map(item => {
                                                        return (<h6 style={{ backgroundColor: 'rgb(255 249 195)' }}>{item}</h6>)
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <FooterClinic />
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CapNhatLich);

