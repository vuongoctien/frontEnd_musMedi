import React, { Component } from 'react';
import { connect } from 'react-redux';
import './GoiDichVu_TaiSuDung.scss'
import moment from 'moment';
import localization from 'moment/locale/vi'
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate, getScheduleForUser } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
import { times } from 'lodash';
import SoLuongDaDat from './Modal/SoLuongDaDat';

class GoiDichVu_TaiSuDung extends Component {

    constructor(props) {
        super(props)
        this.state = {
            render: 0,
            // doctorData: {},// có rồi this.props.medipackageInfo
            // clinic: {}, có nốt this.props.clinicInfo

            listDate: [],
            selectedDate: {}, // to Modal

            listClockTime: [],
            showmore: false,

            isOpen: false, // to Modal
            clockTime: '', // to Modal

            isOpen2: true, // to Modal
        }
    }

    async componentDidMount() {
        // Tạo list 7 ngày
        let d = +new Date().getDate() + 1
        let m = new Date().getMonth()
        let y = new Date().getFullYear()
        for (let i = 0; i < this.props.clinicInfo.quantity_date; i++) {
            let date = new Date(y, m, +d + i)
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

            let object = {}
            object.label = `${getDateThemSo_0(date)}/${+getMonthThemSo_0(date)} - ${this.getDaytoString(date.getDay())}`
            object.value = stringDate
            object.data = date
            this.state.listDate.push(object)
            if (i === 0) {
                this.setState({ selectedDate: object })
                let lichkhamhomnay = await getScheduleForUser({
                    clinicID: this.props.clinicInfo.id,
                    dr_or_pk: 0,
                    dr_or_pk_ID: this.props.medipackageInfo.id,
                    date: stringDate
                })
                // console.log('cục data goi api lich kham', {
                //     clinicID: this.props.clinicInfo.id,
                //     dr_or_pk: 0,
                //     dr_or_pk_ID: this.props.medipackageInfo.id,
                //     date: stringDate
                // })
                this.setState({ listClockTime: lichkhamhomnay.all_schedule })
            }
            this.setState({ render: 0 })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

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

    handleOnChangeSelect = async (event) => {
        // console.log('event.target.value', event.target.value) //đã lấy được stringDate
        this.state.listDate.map(item => {
            if (item.value === event.target.value) { this.setState({ selectedDate: item }) }
        })
        let res = await getScheduleForUser({
            clinicID: this.props.clinicInfo.id,
            dr_or_pk: 0,
            dr_or_pk_ID: this.props.medipackageInfo.id,
            date: event.target.value
        })
        if (res && res.errCode === 0) {
            // document.getElementById('animation').innerHTML = `<i class="far fa-check-circle"></i>`
            // setTimeout(() => { document.getElementById('animation').innerHTML = '' }, 1500)
            this.setState({ listClockTime: res.all_schedule })
        }


    }

    closeModal = () => { // to Modal
        this.setState({
            isOpen: false
        })
    }

    closeModal2 = () => { // to Modal
        this.setState({
            isOpen2: false
        })
    }

    handleShowOrder = async () => {
        alert('ok Viết hàm đi')
    }

    render() {
        // Những bên khác muốn xài component con này đều phải đặt tên biến là medipackageInfo và clinicInfo
        // Để tránh bất đồng bộ, phải làm như này
        let img = ''
        if (this.props.medipackageInfo.image) {
            if (this.props.medipackageInfo.image.type === "Buffer") {
                img = new Buffer(this.props.medipackageInfo.image, 'base64').toString('binary')
            } else {
                img = this.props.medipackageInfo.image
            }
        }

        let listClockTime = []
        for (let i = 0; i < this.state.listClockTime.length; i++) {
            listClockTime[i] = this.state.listClockTime[i].clockTime
        }
        listClockTime = listClockTime.sort()

        return (
            <div className='goidv-taisudung'>
                <BookingModal
                    isOpen={this.state.isOpen} // đóng hay mở?
                    closeModal={this.closeModal} // hàm đóng
                    clinic={this.props.clinicInfo} // clinic
                    dr_or_pk={'0'} //vãi thật, phải nhét 0 vào '' mới gọi API không bị miss para // bác sĩ hay gói dịch vụ?
                    Dr_Pk={this.props.medipackageInfo} // bsi/goidvu đó
                    date={this.state.selectedDate} // ngày
                    clockTime={this.state.clockTime} // giờ
                />
                <SoLuongDaDat
                    isOpen={this.state.isOpen2}
                    closeModal={this.closeModal2}
                />
                <div className='left'>
                    <div className='intro-doctor'>
                        <div className='text-center'>
                            <div
                                className='content-left'
                                style={{ backgroundImage: `url(${img})` }}
                            ></div>
                            <a target='_blank' href={`../detail-medipackage/${this.props.clinicInfo.id}&${this.props.medipackageInfo.id}`}>Xem thêm</a>
                        </div>

                        <div className='content-right'>
                            <div className='up'>
                                <h1>{this.props.medipackageInfo.name}</h1>
                            </div>
                            <div className='down'>
                                <textarea
                                    cols='49'
                                    value={this.props.medipackageInfo.intro}
                                    disabled
                                    readOnly
                                    rows="9"
                                ></textarea>

                            </div>
                        </div>

                    </div>
                    <div style={{ display: 'flex' }}>
                        <select
                            onChange={(event) => this.handleOnChangeSelect(event)}
                        >
                            {this.state.listDate && this.state.listDate.length > 0 &&
                                this.state.listDate.map((item, index) => {
                                    return (
                                        <option
                                            value={item.value}
                                            key={index}
                                        >
                                            {item.label}
                                        </option>
                                    )
                                })}
                        </select>
                        &emsp;&emsp;
                        <div className='animation'>

                        </div>

                    </div>
                    <div className='text-calendar'>
                        <p><i className='fas fa-calendar-alt'></i>&nbsp;LỊCH KHÁM</p>
                        {listClockTime.length === 0 ? <></> :
                            <label onClick={this.handleShowOrder}>Xem số lượng đã đặt</label>}
                    </div>
                    <div className='giokham'>
                        {listClockTime.length === 0 ?
                            <h5>Không có lịch hẹn trong ngày này</h5>
                            :
                            <></>
                        }
                        {listClockTime.map(clockTime => {
                            return (<button
                                onClick={() => {
                                    this.setState({
                                        isOpen: true,
                                        clockTime: clockTime
                                    })
                                }}>{clockTime}</button>)
                        })}
                    </div>
                    <div className='book-free'>
                        <span>
                            Chọn <i className='far fa-hand-point-up'></i> và đặt
                            (phí đặt lịch 0đ)
                        </span>
                    </div>
                </div>
                <div className='right'>
                    <label><u><i>Địa chỉ khám: </i></u></label>
                    <a target="_blank"
                        href={`../detail-clinic/${this.props.clinicInfo.id}`}
                    >
                        <h5>&nbsp;&nbsp;{this.props.clinicInfo.name}</h5>
                        <h6>
                            &nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;
                            {this.props.clinicInfo.address}
                        </h6>
                        <h6>
                            &nbsp;&nbsp;<i className="fas fa-location-arrow"></i>&nbsp;
                            {this.props.clinicInfo.province}
                        </h6>
                    </a>
                    <label>
                        <u><i>Giá khám & bảo hiểm áp dụng:</i></u>&nbsp;&nbsp;&nbsp;
                        <a
                            onClick={() => { this.setState({ showmore: !this.state.showmore }) }}
                        >
                            {this.state.showmore === true ? `ẩn bớt` : `xem thêm`}
                        </a>
                    </label>
                    {
                        this.state.showmore === true ?
                            <textarea style={{ height: '400px' }}
                                value={this.props.medipackageInfo.thongtinkham}
                                disabled
                            ></textarea>
                            :
                            <textarea style={{ height: '236px' }}
                                value={this.props.medipackageInfo.thongtinkham}
                                disabled
                            ></textarea>}


                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GoiDichVu_TaiSuDung);
