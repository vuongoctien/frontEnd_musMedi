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
import { getOrderByDate, getOrderChuaxemOfClinic } from '../../services/userService';
import moment from 'moment/moment';
import { Modal } from 'reactstrap';
import Select from 'react-select'

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePicked: new Date(),
            qk_ht_tl: 'Hiện tại',
            arrOrder: [],
            isOpenDetailPatient: false,
            thisPatient: {},
            arrChuaxem: []
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

        // Giờ mình sẽ viết hàm thông báo đơn "Chưa xem"
        // Đầu tiên, gọi 1 lần duy nhất xuống DB, lấy tất cả các lịch "Chưa xem" + "of Clinic"
        let res = await getOrderChuaxemOfClinic({ clinicID: this.props.userInfo.id })
        this.setState({ arrChuaxem: res.chuaxem })
    }

    fetchAllOrderByDate = async () => { // sẽ dùng nhiều lần nên viết thành 1 hàm rồi gọi đi gọi lại cho tiện
        let datePicked = this.state.datePicked
        let dd = datePicked.getDate()
        let mm = +datePicked.getMonth() + 1
        let yy = datePicked.getFullYear()
        let stringToday = yy + '-' + mm + '-' + dd
        let res = await getOrderByDate({
            date: stringToday,
            clinicID: this.props.userInfo.id
        })
        if (res && res.errCode === 0) { this.setState({ arrOrder: res.booking_by_date, }) }
        let date000000 = new Date(datePicked.getFullYear(), datePicked.getMonth(), datePicked.getDate()).getTime() // đưa giờ về 0
        let today0000000 = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()
        if (date000000 < today0000000) this.setState({ qk_ht_tl: 'Quá khứ' })
        if (date000000 === today0000000) this.setState({ qk_ht_tl: 'Hiện tại' })
        if (date000000 > today0000000) this.setState({ qk_ht_tl: 'Tương lai' })
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
                    <div>
                        <a class="notification">
                            <h3>Đang chờ duyệt</h3>
                            <span class="chuaxem">{this.state.arrChuaxem.length}</span>
                            <span class="xemnhungchuasua">0</span>
                        </a>
                        <a class="notification">
                            <h3>Chưa xử lý</h3>
                            <span class="xemnhungchuasua">0</span>
                        </a>
                    </div>
                    <div style={{
                        border: '1px solid black',
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
                                    <div style={{ backgroundColor: 'orange' }} className='num'><h5>0</h5></div>
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
                    <div className='list'>
                        {this.state.arrOrder && this.state.arrOrder.map(order => {
                            let status = ''
                            switch (order.status) {
                                case 'Chưa xem':
                                    status = 'orange'
                                    break;
                                case 'Chấp nhận':
                                    status = 'lightgreen'
                                    break;
                                case 'Chờ duyệt':
                                    status = 'lightblue'
                                    break;
                                case 'Đã khám':
                                    status = 'white'
                                    break;
                                case 'Không đến':
                                    status = 'white'
                                    break;
                                case 'Từ chối':
                                    status = 'white'
                                    break;
                                case 'Bệnh nhân hủy':
                                    status = 'white'
                                    break;

                                default:
                                    break;
                            }


                            return (<div className='child'>
                                <div className={`ngaygio ${order.status === 'Từ chối' || order.status === 'Bệnh nhân hủy' ? 'gach' : ''}`}>
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
                                    <h6 color='red'>{order.status}</h6>
                                </div>
                                <div style={{ borderLeft: `3px solid ${status}`, margin: '10px 0px 10px 0px' }}></div>
                                <div className={`infobenhnhan ${order.status === 'Từ chối' || order.status === 'Bệnh nhân hủy' ? 'gach' : ''}`}>
                                    <h5 onClick={() => {
                                        this.setState({
                                            isOpenDetailPatient: true,
                                            thisPatient: order
                                        })
                                    }}><b>{order.patientName ? order.patientName : ''}</b></h5>
                                    <h6><b>{order.patientGender === 1 ? 'Nam' : 'Nữ'} - {moment(order.patientBirthday)._d.getFullYear()}</b></h6>
                                    <h6>{order.email ? order.email : '(không có email)'} - {order.phoneNumber ? order.phoneNumber : ''}</h6>
                                </div>
                                <div style={{ borderLeft: `3px solid ${status}`, margin: '10px 0px 10px 0px' }}></div>
                                <div className='infokham'>
                                    <div className={`${order.status === 'Từ chối' || order.status === 'Bệnh nhân hủy' ? 'gach' : ''}`} style={{ display: 'flex' }}>
                                        <div className={order.dr_or_pk === 1 ? 'small-ava dr' : 'small-ava pk'} style={{ backgroundImage: `url(${new Buffer(order.doctorData.image, 'base64').toString('binary')})` }}></div>
                                        <div style={{ marginLeft: '10px' }}>
                                            <small>{order.doctorData.position}</small>
                                            <h5><b>{order.doctorData.name}</b></h5>
                                        </div>
                                    </div>

                                    {order.status === 'Đã khám' ? <h5 style={{ color: 'green', marginTop: '10px' }}>Đã khám <i className="fas fa-check"></i></h5> : <></>}
                                    {order.status === 'Không đến' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Không đến <i className="fas fa-times"></i></h5> : <></>}
                                    {order.status === 'Từ chối' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Đã từ chối <i className="fas fa-times"></i></h5> : <></>}
                                    {order.status === 'Bệnh nhân hủy' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Bệnh nhân hủy <i className="fas fa-times"></i></h5> : <></>}

                                    {this.state.qk_ht_tl === 'Tương lai'
                                        && (order.status === 'Chưa xem' || order.status === 'Mới xem' || order.status === 'Chờ duyệt') ?
                                        <div style={{ display: 'flex' }}>
                                            <div className='choose' style={{ backgroundColor: 'lightgreen' }}>
                                                Chấp nhận <i className="fas fa-check"></i></div>
                                            <div className='choose' style={{ backgroundColor: 'tomato' }}>
                                                Từ chối <i className="fas fa-times"></i></div>
                                        </div> : <></>}

                                    {this.state.qk_ht_tl === 'Tương lai'
                                        && order.status === 'Chấp nhận' ?
                                        <h5 style={{ color: 'green' }}>Đã chấp nhận <i className="fas fa-check"></i></h5> : <></>}

                                    {(this.state.qk_ht_tl === 'Hiện tại' || this.state.qk_ht_tl === 'Quá khứ')
                                        && order.status === 'Chấp nhận' ?
                                        <div style={{ display: 'flex' }}>
                                            <div className='choose' style={{ backgroundColor: 'aqua' }}>
                                                Đã khám <i className="fas fa-check"></i></div>
                                            <div className='choose' style={{ backgroundColor: 'gainsboro' }}>
                                                Bệnh nhân không đến <i className="fas fa-times"></i></div>
                                        </div> : <></>}

                                    {(this.state.qk_ht_tl === 'Hiện tại' || this.state.qk_ht_tl === 'Quá khứ')
                                        && (order.status === 'Chưa xem' || order.status === 'Vừa xem' || order.status === 'Chờ duyệt') ?
                                        <h5 style={{ color: 'gray', marginTop: '10px' }}>Quá hạn duyệt <i className="fas fa-ban"></i></h5> : <></>}



                                </div>
                            </div>)
                        })}
                        {this.state.arrOrder.length === 0 ? <div className='text-center'><h1>(Danh sách trống)</h1></div> : <div className='text-center'><h4>--- HẾT ---</h4></div>}
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

