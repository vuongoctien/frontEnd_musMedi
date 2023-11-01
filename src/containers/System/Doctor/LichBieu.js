import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
import './LichBieu.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import Select from 'react-select'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllDoctorByClinicId, getSchedule, getAllMediPackageByClinicId } from '../../../services/userService';
import { toast } from 'react-toastify';
import FooterClinic from '../../Footer/FooterClinic';

class LichBieu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctor: [],
            listMediPackage: [],
            getDateSelected: '',
            getMonthSelected: '',
            getFullYearSelected: '',
            all_schedule: [],
            selectedDate: new Date(this.props.match.params.yy, +this.props.match.params.mm - 1, this.props.match.params.dd)
        }
    }

    async componentDidMount() {
        document.title = `lịch biểu | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:orange;")
        let res1 = await getAllDoctorByClinicId(this.props.userInfo.id)
        this.setState({ listDoctor: res1.all_doctor_of_clinic })
        let res2 = await getAllMediPackageByClinicId(this.props.userInfo.id)
        this.setState({ listMediPackage: res2.all_mediPackage_of_clinic })
        let res = await getSchedule({
            clinicID: this.props.userInfo.id,
            dr_or_pk: '',
            dr_or_pk_ID: ''
        })
        // console.log('res', res)
        this.setState({ all_schedule: res.all_schedule })
        console.log('this.state', this.state)
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            getDateSelected: date[0].getDate(),
            getMonthSelected: +date[0].getMonth() + 1,
            getFullYearSelected: date[0].getFullYear(),
            selectedDate: date[0]
        })
    }

    HomNayLaThuMay = (number) => {
        switch (number) {
            case 0:
                return 'Chủ Nhật'
                break;
            case 1:
                return 'Thứ Hai'
                break;
            case 2:
                return 'Thứ Ba'
                break;
            case 3:
                return 'Thứ Tư'
                break;
            case 4:
                return 'Thứ Năm'
                break;
            case 5:
                return 'Thứ Sáu'
                break;
            case 6:
                return 'Thứ Bảy'
                break;
            default:
                break;
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
                        <div className='col-5'>
                            <h1>Lịch biểu</h1>
                            <h5>
                                Từ ngày &nbsp;
                                {new Date(yy, +mm - 1, dd).getDate()}/
                                {new Date(yy, +mm - 1, dd).getMonth() + 1}/
                                {new Date(yy, +mm - 1, dd).getFullYear()}
                                &nbsp; đến ngày &nbsp;
                                {new Date(yy, +mm - 1, +dd + 6).getDate()}/
                                {new Date(yy, +mm - 1, +dd + 6).getMonth() + 1}/
                                {new Date(yy, +mm - 1, +dd + 6).getFullYear()}
                            </h5>
                            <h6>Click vào tên bác sĩ/gói dịch vụ để xem & cập nhật lịch khám</h6>
                        </div>
                        <div className='col-4'>
                            <br />
                            <label>Xem lịch 7 ngày kể từ:</label> <br />
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                minDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
                                value={this.state.selectedDate}
                            />
                            {/* <label>(Lưu ý: để chọn lại hôm nay, vui lòng trở về trang Lịch Biểu,
                                rồi bấm vào tên bác sĩ/gói dịch vụ.
                                Xin lỗi vì sự bất tiện)</label> */}
                        </div>
                        <div className='col-2'>
                            <label><br /></label> <br /><br />
                            <a href={`/system/LichBieu/${this.state.getDateSelected}&${this.state.getMonthSelected}&${this.state.getFullYearSelected}`}>
                                <button type="button" class="btn btn-primary">Xem</button>
                            </a>
                        </div>
                    </div>
                    <hr />
                    <div className='body'>
                        <table>
                            <tr>
                                <th style={{ width: '19vw' }}>Tên bác sĩ/gói dịch vụ</th>
                                {[0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                                    return (
                                        <th style={{ width: '11vw', textAlign: 'center' }}>
                                            <h5>{this.HomNayLaThuMay(new Date(yy, mm - 1, +dd + index).getDay())}</h5>
                                            {new Date(yy, +mm - 1, +dd + index).getDate()}/
                                            {new Date(yy, +mm - 1, +dd + index).getMonth() + 1}/
                                            {new Date(yy, +mm - 1, +dd + index).getFullYear()}
                                        </th>)
                                })}
                            </tr>
                            {this.state.listDoctor.map((doctor, index1) => {
                                return (
                                    <tr>
                                        <td style={{ backgroundColor: '#f7f7f7' }}>
                                            <a href={`/system/CapNhatLich/${dd}&${mm}&${yy}&${doctor.id}&${1}`} target="_blank">
                                                {doctor.name}
                                            </a>
                                        </td>
                                        {[0, 1, 2, 3, 4, 5, 6].map((item, index2) => {
                                            let date = new Date(yy, +mm - 1, +dd + index2)
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
                                            let arrFilter = this.state.all_schedule.filter(lich =>
                                                lich.date === stringDate
                                                &&
                                                lich.dr_or_pk === 1
                                                &&
                                                lich.dr_or_pk_ID === doctor.id
                                            )
                                            // console.log('arrFilter', arrFilter)
                                            arrFilter = arrFilter.map(lich => lich.clockTime)
                                            arrFilter = arrFilter.sort()
                                            return (
                                                <td style={{ backgroundColor: 'rgb(255, 245, 227)', textAlign: 'center' }}>
                                                    {/* bác sĩ có id {doctor.id} & ngày {stringDate} và dr_or_pk =1 */}
                                                    {arrFilter.map(clockTime => {
                                                        return (<h6 >{clockTime}</h6>)
                                                    })}
                                                </td>)
                                        })}
                                    </tr>
                                )
                            })}
                            {this.state.listMediPackage.map((medi_package, index1) => {
                                return (
                                    <tr>
                                        <td style={{ backgroundColor: '#f7f7f7' }}>
                                            <a href={`/system/CapNhatLich/${dd}&${mm}&${yy}&${medi_package.id}&${0}`}>
                                                {medi_package.name}
                                            </a>
                                        </td>
                                        {[0, 1, 2, 3, 4, 5, 6].map((item, index2) => {
                                            let date = new Date(yy, +mm - 1, +dd + index2)
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
                                            let arrFilter = this.state.all_schedule.filter(lich =>
                                                lich.date === stringDate
                                                &&
                                                lich.dr_or_pk === 0
                                                &&
                                                lich.dr_or_pk_ID === medi_package.id
                                            )
                                            // console.log('arrFilter', arrFilter)
                                            arrFilter = arrFilter.map(lich => lich.clockTime)
                                            arrFilter = arrFilter.sort()
                                            return (
                                                <td style={{ backgroundColor: 'rgb(255, 245, 227)', textAlign: 'center' }}>
                                                    {arrFilter.map(clockTime => {
                                                        return (<h6>{clockTime}</h6>)
                                                    })}
                                                </td>)
                                        })}
                                    </tr>
                                )
                            })}
                        </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(LichBieu);

