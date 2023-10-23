import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
import './ThoiGianBieu.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import Select from 'react-select'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllDoctorByClinicId, createSchedule } from '../../../services/userService';
import { toast } from 'react-toastify';
import EditScheduleModal from '../../Patient/Doctor/Modal/EditScheduleModal';

class ThoiGianBieu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [], //dễ
            selectedDoctor: {},

            // selectedDate: new Date(new Date().setDate(new Date().getDate())),
            selectedDate: new Date(),
            isOpenModal: true

        }
    }

    async componentDidMount() {
        document.title = `tạo lịch khám bệnh | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:orange;")

        let res = await getAllDoctorByClinicId(this.props.userInfo.id)
        if (res && res.errCode === 0) {
            this.setState({ listDoctors: this.buildDataInputSelect(res.all_doctor_of_clinic) })
            this.setState({ selectedDoctor: this.state.listDoctors[0] })
        }
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({
            selectedDoctor: selectedOption,
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ selectedDate: date[0] })
    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = []
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `id${item.id} __ ${item.name}`
                object.value = item.id
                object.name = item.name
                object.image = item.image
                result.push(object)
            })
        }
        return result
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

    dom = (number) => {
        let input = document.getElementsByClassName('inputClocktoDOM')[number].value
        if (input >= 0 && input <= 9) input = '0' + input
        return input
    }

    createTimeClock = () => {
        // console.log(this.dom(0))
        // console.log(this.dom(1))
        // console.log(this.dom(2))
        // console.log(this.dom(3))
    }

    closeModal = () => {
        this.setState({
            isOpenModal: false
        })
    }

    render() {
        let today = new Date()
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))


        return (
            <div className='lichbieu'>
                <div className='title-schedule'>
                    <br />
                </div>
                <div className='chonthongtin'>
                    <form>
                        <div class="form-row">
                            <div class="form-group col-md-1">

                            </div>
                            <div class="form-group col-md-1">
                                <div class="avatar" style={{ backgroundImage: `url(${this.state.selectedDoctor.image})` }}>

                                </div>
                            </div>
                            <div class="form-group col-md-5">
                                <label>Chọn bác sĩ / gói dịch vụ</label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            </div>
                            <div class="form-group col-md-2">
                                <label>Xem lịch của 28 ngày kể từ:</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.selectedDate}
                                    minDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
                                />
                            </div>
                            <div class="form-group col-md-1">

                            </div>
                            <div class="form-group col-md-1">
                                <label>&nbsp;</label>
                                <h1 onClick={() => { this.setState({ isOpenModal: true }) }}><i class="far fa-edit"></i></h1>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='lich'>
                    {[0, 1, 2, 3] && [0, 1, 2, 3].map((item, index1) => {
                        return (
                            <div className='lichRow row'>
                                {[0, 1, 2, 3, 4, 5, 6] && [0, 1, 2, 3, 4, 5, 6].map((item, index2) => {
                                    let date = (new Date(new Date().setDate(this.state.selectedDate.getDate() + index1 * 7 + index2)))
                                    return (
                                        <div className='col'>
                                            <div className='thu_ngay_thang'>
                                                <h2>{date.getDate()}</h2>
                                                <i>Tháng {date.getMonth() + 1}</i>
                                                <br />
                                                <br />
                                                <p>{this.getDaytoString(date.getDay())}</p>
                                            </div>
                                            <div className='list_khung_gio'>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                                <h6>06:00 - 06:30</h6>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <EditScheduleModal
                    // ờ hiểu rồi, mình truyền mấy cái sau xuống component con:
                    // sang bên kia thằng con cứ thế dùng, 
                    isOpenModal={this.state.isOpenModal} // trạng thái đóng/mở modal (state)
                    closeModal={this.closeModal} // hàm đóng modal
                    selectedDoctor={this.state.selectedDoctor}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ThoiGianBieu);

