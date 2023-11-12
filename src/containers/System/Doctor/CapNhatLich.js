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
            render: 0,
            selectedArea: { "label": "Mỗi ngày", "value": 0 },
            list_Khung_Gio_Da_Tao: [],
            thisDr_or_Pk: {},
            all_schedule: [],
            weekView: 2,

            getDateSelected: '',
            getMonthSelected: '',
            getFullYearSelected: '',
            selectedDate: new Date(this.props.match.params.yy, +this.props.match.params.mm - 1, this.props.match.params.dd)
        }
    }

    async componentDidMount() {

        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:brown;")
        if (this.props.match.params.dr_or_pk === '1') {
            let res = await getDoctorByIdClinicAndIdDoctor({
                doctorID: this.props.match.params.dr_or_pk_ID,
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
        // console.log('res', res)
        this.setState({ all_schedule: res.all_schedule })
        // console.log('this.state.all_schedule', this.state.all_schedule)

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            getDateSelected: date[0].getDate(),
            getMonthSelected: +date[0].getMonth() + 1,
            getFullYearSelected: date[0].getFullYear(),
            selectedDate: date[0]
        })
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
            string = this.NUMtoSTR(0) + ':' + this.NUMtoSTR(1) + ' - ' + this.NUMtoSTR(2) + ':' + this.NUMtoSTR(3)
            this.state.list_Khung_Gio_Da_Tao.push(string)
            this.setState({ render: 0 })
        }
    }

    XoaKhungGio = (index) => {
        this.state.list_Khung_Gio_Da_Tao.splice(index, 1)
        this.setState({ render: 0 })
    }

    TaoLichBieu = () => {
        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        if (document.getElementById('week').value > 0 && document.getElementById('week').value <= 54) {
            if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
                alert('Bạn chưa chọn khung giờ')
                toast.error('Bạn chưa chọn khung giờ')
            } else {
                if (window.confirm(`Bạn muốn cập nhật lịch liểu cho ${this.state.thisDr_or_Pk.name}?`) === true) {

                    if (document.getElementById('area').value === '2') { // trường hợp Chọn mỗi thứ mấy
                        for (let i = 0; i < document.getElementById('week').value; i++) {
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

                    if (document.getElementById('area').value === '1') { // trường hợp Chọn mỗi ngày
                        for (let i = 0; i < +document.getElementById('week').value * 7; i++) {
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
        } else {
            alert('Phạm vi điều chỉnh từ 1 - 54 tuần')
        }


        /* Đây là trường hợp this.state.list_Khung_Gio_Da_Tao có phần tử rồi, 
        mảng mới được duyệt và API mới được gọi
        Muốn làm rỗng lịch thì chạy xuống hàm bên dưới*/
    }

    LamRongLich = async () => {
        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        if (document.getElementById('week').value > 0 && document.getElementById('week').value <= 54) {
            if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
                if (window.confirm(`Bạn muốn làm rỗng lịch cho ${this.state.thisDr_or_Pk.name}?`) === true) {

                    if (document.getElementById('area').value === '2') { // trường hợp Chọn mỗi thứ mấy
                        for (let i = 0; i < document.getElementById('week').value; i++) {
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

                    if (document.getElementById('area').value === '1') { // trường hợp Chọn mỗi ngày
                        for (let i = 0; i < +document.getElementById('week').value * 7; i++) {
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
        } else {
            alert('Phạm vi điều chỉnh từ 1 - 54 tuần')
        }
    }

    handleOnChangeViewWeek = (event) => {
        if (event.target.value < 0 && event.target.value > 54) {
            alert('Chỉ được xem lịch trong phạm vi 1-54 tuần')
        }
        if (event.target.value >= 0 && event.target.value <= 54) {
            this.setState({ weekView: event.target.value })
        }
    }


    render() {
        // console.log('this.props is ', this.props)
        // console.log('test', new Date(this.props.match.params.yy, this.props.match.params.mm - 1, +this.props.match.params.dd + 10))
        // phải thêm dấu cộng ở đầu biến, nếu không nó hiểu là nối chuỗi

        let yy = this.props.match.params.yy
        let mm = this.props.match.params.mm
        let dd = this.props.match.params.dd

        let arrFor = []
        for (let i = 0; i < this.state.weekView; i++) {
            arrFor[i] = ''
        }

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
                            <label>Chọn ngày cần điều chỉnh rồi nhấn nút "Chọn" <i className="fas fa-arrow-right"></i></label> <br />
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                // placeholder={`${this.props.match.params.dd}/${this.props.match.params.mm}/${this.props.match.params.yy}`}
                                minDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
                                value={this.state.selectedDate}
                            />
                            {/* <label>(Lưu ý: để chọn lại hôm nay, vui lòng trở về trang Lịch Biểu,
                                rồi bấm vào tên bác sĩ/gói dịch vụ.
                                Xin lỗi vì sự bất tiện)</label> */}
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
                                <div className='col-5'>
                                    <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" defaultValue='' />
                                    &nbsp;:&nbsp;
                                    <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" defaultValue='' />
                                    &nbsp;-&nbsp;
                                    <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" defaultValue='' />
                                    &nbsp;:&nbsp;
                                    <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" defaultValue='' />
                                    &emsp;
                                    <button type="button" class="btn btn-secondary" onClick={() => this.ThemKhungGio()}>Thêm</button>
                                </div>
                                <div className='col-5 area'>
                                    <div>
                                        <span>Phạm vi điều chỉnh: &nbsp;</span>
                                        <select id='area'>
                                            <option value='2'>Mỗi {this.getDaytoString(new Date(yy, +mm - 1, dd).getDay())}</option>
                                            <option value='1'>Mỗi ngày</option>
                                        </select>
                                        <span>&nbsp; trong &nbsp;</span>
                                        <input id='week' type="number" min="1" max="5999" defaultValue='1' />
                                        <span>&nbsp; tuần tới</span>
                                    </div>
                                </div>
                            </div>
                            <div className='khungiodatao'>
                                Các khung giờ vừa tạo sẽ xuất hiện ở đây, click vào từng khung giờ nếu muốn xóa. Để sắp xếp, nhấn vào&nbsp;
                                <a onClick={() => { this.state.list_Khung_Gio_Da_Tao.sort(); this.setState({ render: 0 }) }} href='#'>đây</a> &nbsp;
                                (Việc sắp xếp chỉ có tác dụng hiển thị lúc này, không ảnh hưởng đến thứ tự hiển thị ở trang chủ & lịch biểu)
                                &nbsp;<i className="fas fa-level-down-alt"></i><br />
                                {this.state.list_Khung_Gio_Da_Tao.map((item, index) => {
                                    return (<button title='Click để xóa' onClick={() => this.XoaKhungGio(index)}>{item}</button>)
                                })}
                            </div>
                            <div className='button1'>
                                <div className='col-3'>
                                    <button type="button" class="btn btn-primary" onClick={() => this.TaoLichBieu()} > Tạo lịch biểu</button>
                                </div>
                                <div className='col-9'>
                                    <p>Với lựa chọn "Tạo lịch biểu", lịch khám mới tạo sẽ được bổ sung vào lịch khám cũ.<br />
                                        Để tránh trùng lặp, bạn có thể lựa chọn "Làm rỗng lịch" trước khi tạo lịch khám mới.

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
                            <h1>Xem lịch khám trong&nbsp;&nbsp;
                                <input type="number" min="2" max="999" value={this.state.weekView}
                                    onChange={(event) => this.handleOnChangeViewWeek(event)} />&nbsp;
                                tuần tới</h1>
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
                        {arrFor && arrFor.map((item, index1) => {
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
                                        let getMonthThemSo_0 = (date) => {
                                            let number = +date.getMonth() + 1
                                            if (number < 10) number = '0' + number
                                            return number
                                        }
                                        let stringDate = date.getFullYear() + '-' + getMonthThemSo_0(date) + '-' + getDateThemSo_0(date)
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

