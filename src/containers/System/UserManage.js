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

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePicked: new Date()
        }
    }




    componentDidMount() {
        document.title = `đơn đặt lịch | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-tasks')[0].setAttribute("style", "color:orange;")
    }

    handleOnChangeDatePicker = (datePicked) => {
        this.setState({ datePicked: datePicked[0] })
    }

    render() {
        console.log('this.state', this.state)

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
                        {[0, 1, 2, 3, 4, 5, 6].map(ok => {
                            return (<div className='child'>
                                <div className='ngaygio'>
                                    <h4>00:00 - 00:00</h4>
                                    <h6>0000-00-00</h6>
                                    <small>Dat luc: 9999/99/99 11:00:00</small>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infobenhnhan'>
                                    <h5><b>Nu - 2009 - Vuong Thi Tien</b></h5>
                                    <h6>vuongooctien@gmail.com</h6>
                                    <h6>12345678900 - nguoi nha dat giup</h6>
                                </div>
                                <div style={{ border: '1px solid gainsboro', margin: '10px 0px 10px 0px' }}></div>
                                <div className='infokham'>
                                    <h5><b>PSG Tien Si Bac si Linh Ha Lan</b></h5>
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

