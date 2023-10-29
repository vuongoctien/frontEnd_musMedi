import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailMediPackage.scss'
import { getAllDetailClinicById, getMediPkByIdClinicAndIdDoctor, getScheduleForUser } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtrainfor from './DoctorExtrainfor';
import Select from 'react-select'
import HomeFooter from '../../HomePage/Section/HomeFooter';

class DetailMediPackage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            render: 0,
            medi_packageData: {},
            clinic: {},

            listDate: [],
            selectedDate: {},

            listClockTime: [],
            showmore: false
        }
    }

    async componentDidMount() {
        let res = await getMediPkByIdClinicAndIdDoctor({
            medi_packageID: this.props.match.params.medipackageID,
            clinicID: this.props.match.params.clinicID
        })
        if (res && res.errCode === 0) {
            this.setState({ medi_packageData: res.medi_packageData })
            document.title = `${this.state.medi_packageData.name} | musMedi`
        }

        let clinic = await getAllDetailClinicById(this.props.match.params.clinicID)
        if (res && res.errCode === 0) this.setState({ clinic: clinic.data })

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
            object.label = `${getDateThemSo_0(date)}/${+getMonthThemSo_0(date)} - ${this.getDaytoString(date.getDay())}`
            object.value = stringDate
            object.data = date
            this.state.listDate.push(object)
            if (i === 0) {
                this.setState({ selectedDate: object })
                let lichkhamhomnay = await getScheduleForUser({
                    clinicID: this.props.match.params.clinicID,
                    dr_or_pk: 0,
                    dr_or_pk_ID: this.props.match.params.medipackageID,
                    date: stringDate
                })
                this.setState({ listClockTime: lichkhamhomnay.all_schedule })
            }
            this.setState({ render: 0 })
        }


    }


    componentDidUpdate(prevProps, prevState, snapshot) {

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
            clinicID: this.props.match.params.clinicID,
            dr_or_pk: 0,
            dr_or_pk_ID: this.props.match.params.medipackageID,
            date: event.target.value
        })
        if (res && res.errCode === 0) {
            document.getElementById('animation').innerHTML = `<i class="far fa-check-circle"></i>`
            setTimeout(() => { document.getElementById('animation').innerHTML = '' }, 1500)
            this.setState({ listClockTime: res.all_schedule })
        }

    }


    render() {
        console.log('this.state', this.state)
        let listClockTime = []
        for (let i = 0; i < this.state.listClockTime.length; i++) {
            listClockTime[i] = this.state.listClockTime[i].clockTime
        }
        listClockTime = listClockTime.sort()

        return (
            <>
                <HomeHeader isShowBaner={false} />
                <div className='medipackage-detail-container'>
                    <div className='intro-medipackage'>
                        <div className='content-left' style={{ backgroundImage: `url(${this.state.medi_packageData.image})` }}>

                        </div>
                        <div className='content-right'>
                            <div className='up'>
                                <h1>{this.state.medi_packageData.name}</h1>
                            </div>
                            <div className='down'>
                                <textarea
                                    cols='80'
                                    value={this.state.medi_packageData.intro}
                                    disabled
                                    readOnly
                                    rows="6"
                                ></textarea>

                            </div>
                        </div>

                    </div>
                    <div className='schedule-medipackage'>
                        <div className='content-left'>
                            <div style={{ display: 'flex' }}>
                                <select onChange={(event) => this.handleOnChangeSelect(event)}>
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
                                <div id='animation'>

                                </div>

                            </div>
                            <div className='text-calendar'>
                                <p><i className='fas fa-calendar-alt'></i>&nbsp;LỊCH KHÁM</p>
                            </div>
                            <div className='giokham'>
                                {listClockTime.length === 0 ?
                                    <h5>Không có lịch hẹn trong ngày này</h5> : <></>
                                }
                                {listClockTime.map(clockTime => { return (<button>{clockTime}</button>) })}
                            </div>
                            <div className='book-free'>
                                <span>
                                    Chọn <i className='far fa-hand-point-up'></i> và đặt
                                    (phí đặt lịch 0đ)
                                </span>
                            </div>
                        </div>
                        <div className='content-right'>
                            <label><u><i>Địa chỉ khám: </i></u></label>
                            <a target="_blank" href={`../detail-clinic/${this.props.match.params.clinicID}`}>
                                <h5>&nbsp;&nbsp;{this.state.clinic.name}</h5>
                                <h6>
                                    &nbsp;&nbsp;<i className="fas fa-map-marker-alt"></i>&nbsp;
                                    {this.state.clinic.address}
                                </h6>
                                <h6>
                                    &nbsp;&nbsp;<i className="fas fa-location-arrow"></i>&nbsp;
                                    {this.state.clinic.province}
                                </h6>
                            </a>
                            <label>
                                <u><i>Giá khám & bảo hiểm áp dụng:</i></u>&nbsp;&nbsp;&nbsp;
                                <a onClick={() => { this.setState({ showmore: !this.state.showmore }) }}>
                                    {this.state.showmore === true ? `ẩn bớt` : `xem thêm`}
                                </a>
                            </label>
                            {this.state.showmore === true ?
                                <textarea style={{ height: '400px' }}
                                    value={this.state.medi_packageData.thongtinkham}
                                    disabled
                                ></textarea>
                                :
                                <textarea style={{ height: '116px' }}
                                    value={this.state.medi_packageData.thongtinkham}
                                    disabled
                                ></textarea>}


                        </div>
                    </div>
                    <div className='text-center'>
                        <label>
                            <i class="fas fa-level-down-alt fa-flip-horizontal"></i>
                            &nbsp;Thông tin về&nbsp;
                            {this.state.medi_packageData.name}&nbsp;
                            <i class="fas fa-level-down-alt"></i>
                        </label>
                    </div>
                    <hr />
                    <div className='row'>
                        <div className='col-1'></div>
                        <div
                            dangerouslySetInnerHTML={{ __html: this.state.medi_packageData.descriptionHTML }}
                            className='detail-info-medipackage col-10'></div>
                    </div>
                    <div className='comment-medipackage'>

                    </div>
                </div>
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    // return {

    // };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailMediPackage);
