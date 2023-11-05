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

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePicked: new Date(),
            arrOrder: [],
            listDr: [], listPk: []
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
        let stringToday = yy + '-' + mm + '-' + dd + ' 00:00:00'
        let res = await getOrderByDate({
            date: stringToday,
            clinicID: this.props.userInfo.id
        })
        if (res && res.errCode === 0) { this.setState({ arrOrder: res.booking_by_date }) }
    }

    handleOnChangeDatePicker = (datePicked) => {
        this.setState({ datePicked: datePicked[0] })
    }

    render() {
        console.log('this.state', this.state)
        console.log('this.props', this.props)
        return (

            <div className='dondatlich'>
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
                            <h4>Ngày được chọn: {this.state.datePicked.getDate()}/
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
                                    <h6>9999-99-99</h6>
                                    <small>Đặt lúc: 9999/99/99 99:99:99</small>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infobenhnhan'>
                                    <h5><b>{order.patientName ? order.patientName : ''}</b></h5>
                                    <h6><b>{order.patientGender === 1 ? 'Nam' : 'Nữ'} - 9999</b></h6>
                                    <h6>{order.email ? order.email : '(không có email)'}</h6>
                                    <h6>{order.phoneNumber ? order.phoneNumber : ''} -
                                        {order.forWho === 1 ? ' Bệnh nhân tự đặt' : ' Người thân đặt giúp'}</h6>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infokham'>
                                    <small><b>Việc cần làm bây giờ là xóa sổ cái MediPackage đi, gộp chung bảng với Doctor, sau đó link với bảng Booking</b></small>
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

