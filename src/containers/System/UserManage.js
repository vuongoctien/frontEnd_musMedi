import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import './UserManage.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash'
import FooterClinic from '../Footer/FooterClinic';
import DatePicker from 'react-flatpickr';
import { getOrderByDate, getAllDoctorByClinicId, getAllMediPackageByClinicId } from '../../services/userService';
import moment from 'moment/moment';
import { Modal } from 'reactstrap';

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePicked: new Date(),
            arrOrder: [],
            isOpenDetailPatient: false,
            thisPatient: {}
        }
    }




    async componentDidMount() {
        document.title = `đơn đặt lịch | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-tasks')[0].setAttribute("style", "color:orange;")
        this.fetchAllOrderByDate()
        /** Khi mới Mason Mount :D, state.datePicked chính là hôm nay, dù giờ/phút/giây không phải 00:00:00
         * nhưng nhét vào hàm fetchAllOrderByDate thì sẽ biến thành 00:00:00
         * tóm lại mình đút đúng ngày là được, giờ/phút/giây kệ mẹ
        */
    }

    fetchAllOrderByDate = async () => { // sẽ dùng nhiều lần nên viết thành 1 hàm rồi gọi đi gọi lại cho tiện
        let dd = this.state.datePicked.getDate()
        let mm = +this.state.datePicked.getMonth() + 1
        let yy = this.state.datePicked.getFullYear()
        let stringToday = yy + '-' + mm + '-' + dd
        let res = await getOrderByDate({
            date: stringToday,
            clinicID: this.props.userInfo.id
        })
        if (res && res.errCode === 0) { this.setState({ arrOrder: res.booking_by_date }) }
    }

    handleOnChangeDatePicker = (datePicked) => {
        this.setState({ datePicked: datePicked[0] })
        this.fetchAllOrderByDate()
    }

    themSo_0 = (number) => {
        if (number < 10) number = '0' + number
        return number
    }

    render() {
        console.log('this.state', this.state)
        console.log('this.props', this.props)
        return (

            <div className='dondatlich'>
                <Modal
                    isOpen={this.state.isOpenDetailPatient}
                    thisPatient={this.state.thisPatient}
                    className={'booking-modal-container'}
                    size='lg'
                    centered
                >
                    <div className='head2'>
                        <h5><b>Thông tin bệnh nhân: </b></h5>
                        <div><i onClick={() => { this.setState({ isOpenDetailPatient: false }) }}
                            class="far fa-window-close fa-lg"></i></div>
                    </div>
                    <div className='thongbaodatlichthanhcong'>

                        <div>
                            <table>
                                <tr><td><u><i><b>Thông tin người đặt lịch: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Số điện thoại: &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.phoneNumber}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Email: &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.email}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Đặt cho mình hay cho người thân? &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.forwho === '1' ? 'Đặt cho mình' : 'Đặt cho người thân'}</td>
                                </tr>
                                <tr><td><u><i><b>Thông tin bệnh nhân: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Họ và tên: &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.patientName}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Ngày/tháng/năm sinh: &ensp;</td>
                                    <td className='td2'>
                                        {moment(this.state.thisPatient.patientBirthday)._d.getDate()}/
                                        {+moment(this.state.thisPatient.patientBirthday)._d.getMonth() + 1}/
                                        {moment(this.state.thisPatient.patientBirthday)._d.getFullYear()}
                                    </td>

                                </tr>
                                <tr>
                                    <td className='td1'>Giới tính: &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.patientGender === '1' ? 'Nam' : 'Nữ'}</td>
                                </tr>
                                <tr><td><u><i><b>Lý do khám: </b></i></u></td></tr>
                            </table>
                            <textarea cols='90' rows="5" placeholder='' value={this.state.thisPatient.reason} readOnly></textarea>
                        </div>
                    </div>
                </Modal>
                <div className='nofi'>
                    <div style={{ backgroundColor: '#d3ffd3' }}>
                        <a class="notification">
                            <h3>Đang chờ duyệt</h3>
                            <span class="chuaxem">0</span>
                            <span class="xemnhungchuasua">0</span>
                        </a>
                        <a class="notification">
                            <h3>Chưa xử lý</h3>
                            <span class="xemnhungchuasua">0</span>
                        </a>
                    </div>
                    <div style={{
                        border: '1px solid green',
                        margin: '0px 40px 0px 10px'
                    }}></div>
                    <div className='list'>
                        <h5><br /></h5>
                        <ul>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => {
                                return (<li><div className='li'>
                                    <div className='date'><h4>9999-99-99</h4></div>
                                    &ensp;
                                    <div style={{ backgroundColor: '#8e8e8e' }} className='num'><h5>0</h5></div>
                                    &ensp;
                                    <div style={{ backgroundColor: 'tomato' }} className='num'><h5>0</h5></div>
                                </div></li>)
                            })}

                        </ul>
                    </div>
                </div>

                <div className='book'>
                    <div className='date'>
                        <div style={{ padding: '10px' }}>
                            <h6>Chọn ngày:</h6>
                        </div>
                        <div className='datepicker'>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.datePicked}
                            />
                        </div>
                        <div className='datepicked'>
                            <h4>Ngày được chọn: {this.themSo_0(this.state.datePicked.getDate())}/
                                {+this.state.datePicked.getMonth() + 1}/
                                {this.state.datePicked.getFullYear()}</h4>
                        </div>
                    </div>
                    <div style={{
                        border: '1px solid green',
                        margin: '0px 40px 0px 10px'
                    }}></div>
                    <div className='list'>
                        {this.state.arrOrder && this.state.arrOrder.map(order => {
                            return (<div className='child'>
                                <div className='ngaygio'>
                                    <h4>{order.clockTime ? order.clockTime : ''}</h4>
                                    <h6>
                                        {this.themSo_0(moment(order.date)._d.getDate())}/
                                        {+moment(order.date)._d.getMonth() + 1}/
                                        {moment(order.date)._d.getFullYear()}
                                    </h6>
                                    <small>Đặt lúc: {this.themSo_0(moment(order.createdAt)._d.getHours())}:
                                        {this.themSo_0(moment(order.createdAt)._d.getMinutes())} &nbsp;
                                        {this.themSo_0(moment(order.createdAt)._d.getDate())}/
                                        {+moment(order.createdAt)._d.getMonth() + 1}/
                                        {moment(order.createdAt)._d.getFullYear()}</small>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infobenhnhan'>
                                    <h5 onClick={() => {
                                        this.setState({
                                            isOpenDetailPatient: true,
                                            thisPatient: order
                                        })
                                    }}><b>{order.patientName ? order.patientName : ''}</b></h5>
                                    <h6><b>{order.patientGender === 1 ? 'Nam' : 'Nữ'} - {moment(order.patientBirthday)._d.getFullYear()}</b></h6>
                                    <h6>{order.email ? order.email : '(không có email)'} - {order.phoneNumber ? order.phoneNumber : ''}</h6>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infokham'>
                                    <div style={{ display: 'flex' }}>
                                        <div className={order.dr_or_pk === 1 ? 'small-ava dr' : 'small-ava pk'} style={{ backgroundImage: `url(${new Buffer(order.doctorData.image, 'base64').toString('binary')})` }}></div>
                                        <div style={{ marginLeft: '10px' }}>
                                            <small>{order.doctorData.position}</small>
                                            <h5><b>{order.doctorData.name}</b></h5>
                                        </div>

                                    </div>
                                </div>
                            </div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);

