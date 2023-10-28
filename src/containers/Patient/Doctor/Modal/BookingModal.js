import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import ProfileDoctor from '../ProfileDoctor'
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from "../../../../store/actions"
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

class BookingModal extends Component {

    /**prop nạp vào cần phải có dạng
     * 
                
     */

    constructor(props) {
        super(props)
        this.state = {
            forwho: false,
            gender: false
        }
    }

    async componentDidMount() {

    }

    handleOnChangeDatePicker = (date) => {
        console.log('date[0]', date[0])
    }

    render() {
        console.log('this.props', this.props)
        return (
            <Modal
                isOpen={this.props.isOpen}
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>Đặt lịch khám bệnh</span>
                        <span className='right' onClick={this.props.closeModal}>
                            <i className="fas fa-window-close fa-lg"></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        <div className='doctor-medipk-info'>
                            <div className='img-doctor'
                                style={{ backgroundImage: `url()` }}></div>
                            <div className='info-doctor'>
                                <h5>PSG Tien si Bac si </h5>
                                <h4><b>Vuong Ngoc Tien</b></h4>
                                <br />
                                <h6>10:00 - 10:30 Thứ Bảy 28/10/2023</h6>
                            </div>
                        </div>
                        <div className='formdien'>
                            <table>
                                <tr><td><u><i><b>Thông tin người đặt lịch: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Số điện thoại: &ensp;</td>
                                    <td className='td2'><input type="tel" placeholder='Số điện thoại giúp cơ sở y tế liên hệ với bạn khi cần thiết' className='form-control' /></td>
                                </tr>
                                <tr>
                                    <td className='td1'>Gmail (điền cả đuôi @gmail.com): &ensp;</td>
                                    <td className='td2'><input type="email" placeholder='Trạng thái lịch hẹn sẽ được cập nhật qua gmail' className='form-control' /></td>
                                </tr>
                                <tr>
                                    <td className='td1'>Đặt cho mình hay cho người thân? &ensp;</td>
                                    <td className='td2'>
                                        <div className='forwho'>
                                            {this.state.forwho === true ?
                                                <>

                                                    <div onClick={() => this.setState({ forwho: true })} className='who'>
                                                        Đặt cho mình <i className="fas fa-thumbs-up"></i>
                                                    </div>

                                                    <div onClick={() => this.setState({ forwho: false })} className='who no'>
                                                        Đặt cho người thân
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div onClick={() => this.setState({ forwho: true })} className='who no'>
                                                        Đặt cho mình
                                                    </div>
                                                    <div onClick={() => this.setState({ forwho: false })} className='who'>
                                                        Đặt cho người thân <i className="fas fa-thumbs-up"></i>
                                                    </div>
                                                </>}
                                        </div>
                                    </td>
                                </tr>
                                <tr><td><u><i><b>Thông tin bệnh nhân: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Họ và tên: &ensp;</td>
                                    <td className='td2'><input type="text" placeholder='Họ và tên bệnh nhân' className='form-control' /></td>
                                </tr>
                                <tr>
                                    <td className='td1'>Ngày/tháng/năm sinh: &ensp;</td>
                                    <td className='td2'>
                                        <DatePicker
                                            onChange={this.handleOnChangeDatePicker}
                                            className='form-control'
                                            placeholder='Ngày / Tháng / Năm'
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td1'>Giới tính: &ensp;</td>
                                    <td className='td2'>
                                        <div className='forwho'>
                                            {this.state.gender === true ?
                                                <>

                                                    <div onClick={() => this.setState({ gender: true })} className='who'>
                                                        Nam <i className="fas fa-mars"></i>
                                                    </div>

                                                    <div onClick={() => this.setState({ gender: false })} className='who no'>
                                                        Nữ
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div onClick={() => this.setState({ gender: true })} className='who no'>
                                                        Nam
                                                    </div>
                                                    <div onClick={() => this.setState({ gender: false })} className='who'>
                                                        Nữ <i className="fas fa-venus"></i>
                                                    </div>
                                                </>}
                                        </div>
                                    </td>
                                </tr>
                                <tr><td><u><i><b>Lý do khám: </b></i></u></td></tr>
                            </table>
                            <textarea
                                cols='90'
                                rows="4"
                                placeholder='Nêu ngắn gọn lý do khám'
                            ></textarea>

                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <h2 id='waiting'></h2>
                        <button type="button" class="btn btn-success">Xác nhận đặt lịch</button>
                        <button type="button" class="btn btn-danger">Hủy</button>
                    </div>
                </div>
            </Modal>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);