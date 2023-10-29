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
import { createOrder } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';

class BookingModal extends Component {

    /**Modal này chỉ quan tâm những tham số truyền vào:
     *              isOpen={this.state.isOpen} // đóng hay mở?
                    closeModal={this.closeModal} // hàm đóng
                    clinic={this.state.clinic} // clinic
                    dr_or_pk={}    // 0 hoặc 1  bác sĩ hay gói dịch vụ?
                    Dr_Pk={this.state.doctorData} // bsi/goidvu đó
                    date={this.state.selectedDate} // ngày
                    clockTime={this.state.clockTime} // giờ
        Còn việc truyền như nào thì ở từng component cha sẽ xử lý
     */

    constructor(props) {
        super(props)
        this.state = {
            sdt: '', // sđt người đặt
            email: '', // email người đặt
            forwho: '0', // đặt cho ai?

            name: '', // họ tên bệnh nhân
            birthday: '', // ngày sinh bệnh nhân
            gender: '0', // giới tính?

            reason: '',

            // còn lại lấy ở prop, khỏi tạo state

            open2ndModal: false

        }
    }

    async componentDidMount() {

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ birthday: date[0] })
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

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        // console.log('stateCopy: ', stateCopy)
        stateCopy[id] = event.target.value
        // console.log('event.target.value', event.target.value)
        // console.log('stateCopy lan 2: ', stateCopy)
        this.setState({
            ...stateCopy
        })
    }

    handleBooking = async () => {
        if (window.confirm(`Bạn chắc chắn muốn thêm chuyên khoa "${this.state.name}" vào hệ thống?`) == true) {
            let res = await createOrder({
                date: this.props.date.value,
                clockTime: this.props.clockTime,
                clinicID: this.props.clinic.id,
                dr_or_pk: this.props.dr_or_pk,
                dr_or_pk_ID: this.props.Dr_Pk.id,
                //////////////////////////////////////////////////////////////
                forWho: this.state.forwho,
                phoneNumber: this.state.sdt,
                email: this.state.email,
                patientName: this.state.name,
                patientBirthday: this.state.birthday,
                patientGender: this.state.gender,
                reason: this.state.reason,
            })
            if (res && res.errCode === 0) {
                toast.success('Đặt lịch khám bệnh thành công')
                this.props.closeModal()
                this.setState({ open2ndModal: true })
            }
            if (res && res.errCode === 1) {
                toast.error('Vui lòng điền đầy đủ thông tin')
            }
            if (!res || res.errCode === -1) {
                toast.error('Lỗi máy chủ')
            }
        }

    }

    render() {
        console.log('this.props', this.props)
        // console.log('this.state', this.state)
        return (
            <>
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
                                <div className={this.props.dr_or_pk === '1' ? 'img-doctor' : 'img-medipk'}
                                    style={{ backgroundImage: `url(${this.props.Dr_Pk.image ? this.props.Dr_Pk.image : ''})` }}>
                                </div>
                                <div className='info-doctor'>
                                    {this.props.dr_or_pk === '1' ?
                                        <h4><b>
                                            {this.props.Dr_Pk.position ? this.props.Dr_Pk.position : ''}&nbsp;
                                            {this.props.Dr_Pk.name ? this.props.Dr_Pk.name : ''}
                                        </b></h4>
                                        :
                                        <h4><b>{this.props.Dr_Pk.name ? this.props.Dr_Pk.name : ''}</b></h4>}

                                    <h5>{this.props.clinic.name ? this.props.clinic.name : ''}</h5>
                                    <br />
                                    <h6>
                                        {this.props.clockTime ? this.props.clockTime : ''}&nbsp;
                                        {this.props.date.data ?
                                            this.getDaytoString(this.props.date.data.getDay()) + ' ngày ' +
                                            this.props.date.data.getDate() + ' tháng ' +
                                            (+this.props.date.data.getMonth() + 1) + ' năm ' +
                                            this.props.date.data.getFullYear()
                                            : ''}
                                    </h6>
                                </div>


                            </div>
                            <div className='formdien'>
                                <table>
                                    <tr><td><u><i><b>Thông tin người đặt lịch: </b></i></u></td></tr>
                                    <tr>
                                        <td className='td1'>Số điện thoại: &ensp;</td>
                                        <td className='td2'><input type="tel" placeholder='Số điện thoại người đặt lịch' className='form-control'
                                            onChange={(event) => this.handleOnChangeInput(event, 'sdt')}
                                            value={this.state.sdt} /></td>
                                    </tr>
                                    <tr>
                                        <td className='td1'>Email: &ensp;</td>
                                        <td className='td2'><input type="email" placeholder='(trạng thái lịch hẹn sẽ được cập nhật qua email)' className='form-control'
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                            value={this.state.email} /></td>
                                    </tr>
                                    <tr>
                                        <td className='td1'>Đặt cho mình hay cho người thân? &ensp;</td>
                                        <td className='td2'>
                                            <div className='forwho'>
                                                {this.state.forwho === '1' ?
                                                    <>

                                                        <div onClick={() => this.setState({ forwho: '1' })} className='who yes'>
                                                            Đặt cho mình <i className="fas fa-thumbs-up"></i>
                                                        </div>

                                                        <div onClick={() => this.setState({ forwho: '0' })} className='who no'>
                                                            Đặt cho người thân
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div onClick={() => this.setState({ forwho: '1' })} className='who no'>
                                                            Đặt cho mình
                                                        </div>
                                                        <div onClick={() => this.setState({ forwho: '0' })} className='who yes'>
                                                            Đặt cho người thân <i className="fas fa-thumbs-up"></i>
                                                        </div>
                                                    </>}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr><td><u><i><b>Thông tin bệnh nhân: </b></i></u></td></tr>
                                    <tr>
                                        <td className='td1'>Họ và tên: &ensp;</td>
                                        <td className='td2'><input type="text" placeholder='Họ và tên bệnh nhân' className='form-control'
                                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                            value={this.state.name} /></td>
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
                                                {this.state.gender === '1' ?
                                                    <>

                                                        <div onClick={() => this.setState({ gender: '1' })} className='who yes'>
                                                            Nam <i className="fas fa-mars"></i>
                                                        </div>

                                                        <div onClick={() => this.setState({ gender: '0' })} className='who no'>
                                                            Nữ
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div onClick={() => this.setState({ gender: '1' })} className='who no'>
                                                            Nam
                                                        </div>
                                                        <div onClick={() => this.setState({ gender: '0' })} className='who yes'>
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
                                    onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    value={this.state.reason}
                                ></textarea>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <h2 id='waiting'></h2>
                            <button type="button" class="btn btn-primary" onClick={() => this.handleBooking()}>Xác nhận đặt lịch</button>
                            <button type="button" class="btn btn-danger" onClick={this.props.closeModal}>Hủy</button>
                        </div>
                    </div>
                </Modal>



                {/* Gài thêm 1 modal thông báo luôn */}
                <Modal
                    // isOpen={this.state.open2ndModal}
                    isOpen={true}
                    className={'booking-modal-container'}
                    size='lg'
                    centered
                >
                    <div className='thongbaodatlichthanhcong'>
                        Thông báo đặt lịch thành công
                    </div>
                </Modal>
            </>


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