import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import Navigator from '../../../components/Navigator';
import './LichBacSi.scss';
import { LANGUAGES, USER_ROLE } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import Select from 'react-select'
import DatePicker from '../../../components/Input/DatePicker';
import { getAllDoctorByClinicId } from '../../../services/userService';

class LichBacSi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            // selectedDate: new Date(new Date().setDate(new Date().getDate())),
            selectedDate: new Date(),
            list_Khung_Gio_Da_Tao: []
        }
    }

    async componentDidMount() {
        document.title = `lịch biểu | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-calendar-alt')[0].setAttribute("style", "color:orange;")
        let res = await getAllDoctorByClinicId(this.props.userInfo.id)
        this.setState({ listDoctors: res.all_doctor_of_clinic })

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ selectedDate: date[0] })
    }

    render() {




        // var date = this.state.selectedDate.getFullYear() + '-' + (this.state.selectedDate.getMonth() + 1) + '-' + this.state.selectedDate.getDate();
        // console.log('ngày mình chọn trong lịch là ', this.state.selectedDate)
        // console.log('ngày mình chọn trong lịch đã được định dạng thủ công và sẵn sàng quăng lên DB', date)
        console.log('check state', this.state)


        return (


            <div className=''>
                <div className='lichbieu'>
                    <table>
                        <tr>
                            <th></th>
                            <th style={{ textAlign: 'left' }}>Bác sĩ</th>
                            <th>Thứ Hai</th>
                            <th>Thứ Ba</th>
                            <th>Thứ Tư</th>
                            <th>Thứ Năm</th>
                            <th>Thứ Sáu</th>
                            <th>Thứ Bảy</th>
                            <th>Chủ nhật</th>
                        </tr>
                        {this.state.listDoctors && this.state.listDoctors.map((item, index) => {

                            return (
                                <tr>
                                    <td>{item.id}</td>
                                    <td
                                        className='td-bacsi'
                                        onClick={() => { this.setState({ selectedDoctor: item }) }}

                                    >
                                        {item.name}
                                    </td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                    <td>10:00 - 10:30<br />14:30 - 14:45</td>
                                </tr>
                            )
                        })}


                    </table>
                </div>

                <div className='taolich'>
                    <h5 style={{ padding: '2vh' }}>
                        <u><i>Tạo lịch biểu cho bác sĩ:</i></u>&nbsp;
                        {this.state.selectedDoctor.name}&nbsp;
                        <i className="far fa-window-close" onClick={() => { this.setState({ selectedDoctor: {} }) }}></i>
                    </h5 >
                    <div className=''>
                        <div className='col-12 row'>
                            <div className='col-1'>
                                <h3><i className="fas fa-calendar-alt"></i></h3>
                            </div>
                            <div className='col-5'>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.selectedDate}
                                    minDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
                                />
                            </div>
                            <div className='col-1'>
                                <h3><i className="fas fa-th"></i></h3>
                            </div>
                            <div className='col-5'>
                                <Select
                                    value={{ "label": "Chỉ 1 ngày", "value": 0 }}
                                    // onChange={this.handleChangeSelect}
                                    options={[
                                        { "label": "Chỉ 1 ngày", "value": 0 },
                                        { "label": "Mỗi thứ Hai", "value": 1 },
                                        { "label": "Mỗi ngày", "value": 2 }
                                    ]}
                                />
                            </div>
                        </div>
                        <div className='col-12'>
                            <p>Tạo khung giờ: </p>
                            <input className='inputClock' type="number" min="0" max="23" placeholder="Giờ" step="1" />
                            &nbsp;:&nbsp;
                            <input className='inputClock' type="number" min="0" max="55" placeholder="Phút" step="5" />
                            &nbsp;-&nbsp;
                            <input className='inputClock' type="number" min="0" max="23" placeholder="Giờ" step="1" />
                            &nbsp;:&nbsp;
                            <input className='inputClock' type="number" min="0" max="55" placeholder="Phút" step="5" />
                            &emsp;
                            <button type="button" class="btn btn-secondary">Thêm</button>
                        </div>
                        <div style={{ height: '2vh' }}></div>
                        <div className='khungiodatao'>
                            Chỗ này duyệt mảng rồi return ra thôi
                        </div>
                        <div className=''>
                            <button type="button" class="btn btn-primary">Tạo lịch biểu</button>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LichBacSi);

