import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BacSi_TaiSuDung.scss'
import moment from 'moment';
import localization from 'moment/locale/vi'
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate, getScheduleForUser } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
import { times } from 'lodash';

class BacSi_TaiSuDung extends Component {

    constructor(props) {
        super(props)
        this.state = {
            render: 0,
            // doctorData: {},// có rồi this.props.doctorInfo
            // clinic: {}, có nốt this.props.clinicInfo

            listDate: [],
            selectedDate: {},

            listClockTime: [],
            showmore: false
        }
    }

    async componentDidMount() {
        // Tạo list 7 ngày
        let d = new Date().getDate()
        let m = new Date().getMonth()
        let y = new Date().getFullYear()
        for (let i = 0; i < 7; i++) {
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
            object.label = `${getDateThemSo_0(date)}/${+getMonthThemSo_0(date) + 1} - ${this.getDaytoString(date.getDay())}`
            object.value = stringDate
            this.state.listDate.push(object)
            if (i === 0) {
                this.setState({ selectedDate: object })
                let lichkhamhomnay = await getScheduleForUser({
                    clinicID: this.props.clinicInfo.id,
                    dr_or_pk: 1,
                    dr_or_pk_ID: this.props.doctorInfo.id,
                    date: stringDate
                })
                console.log('lichkhamhomnay', this.props.doctorInfo.id, lichkhamhomnay,)
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
        console.log('event.target.value', event.target.value) //đã lấy được stringDate
        let res = await getScheduleForUser({
            clinicID: this.props.clinicInfo.id,
            dr_or_pk: 1,
            dr_or_pk_ID: this.props.doctorInfo.id,
            date: event.target.value
        })
        if (res && res.errCode === 0) {
            // document.getElementById('animation').innerHTML = `<i class="far fa-check-circle"></i>`
            // setTimeout(() => { document.getElementById('animation').innerHTML = '' }, 1500)
            this.setState({ listClockTime: res.all_schedule })
        }


    }


    render() {
        // Những bên khác muốn xài component con này đều phải đặt tên biến là doctorInfo và clinicInfo
        let listClockTime = []
        for (let i = 0; i < this.state.listClockTime.length; i++) {
            listClockTime[i] = this.state.listClockTime[i].clockTime
        }
        listClockTime = listClockTime.sort()
        return (
            <div className='taisudung'>
                <div className='left'>
                    <div className='intro-doctor'>
                        {this.props.doctorInfo.image ?
                            <div className='content-left'>Để sau</div>
                            :
                            <div
                                className='content-left'
                                style={{ backgroundImage: `url(${this.props.doctorInfo.image})` }}
                            >Để sau</div>
                        }

                        <div className='content-right'>
                            <div className='up'>
                                <h6>{this.props.doctorInfo.position}</h6>
                                <h3>{this.props.doctorInfo.name}</h3>
                            </div>
                            <div className='down'>
                                <textarea
                                    cols='50'
                                    value={this.props.doctorInfo.intro}
                                    disabled
                                    readOnly
                                    rows="5"
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
                            chỗ này là animation, nhưng ở đây có nhiều, không đặt id được
                        </div>

                    </div>
                    <div className='text-calendar'>
                        <p><i className='fas fa-calendar-alt'></i>&nbsp;LỊCH KHÁM</p>
                    </div>
                    <div className='giokham'>
                        {/* {listClockTime.map(clockTime => {
                            return (
                                <button>{clockTime}</button>
                            )
                        })} */}
                        Đây là giờ khám
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
                                value={this.props.doctorInfo.thongtinkham}
                                disabled
                            ></textarea>
                            :
                            <textarea style={{ height: '116px' }}
                                value={this.props.doctorInfo.thongtinkham}
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

export default connect(mapStateToProps, mapDispatchToProps)(BacSi_TaiSuDung);
