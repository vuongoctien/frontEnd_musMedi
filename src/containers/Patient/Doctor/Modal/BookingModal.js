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
import { createOrder, sendSimpleEmail } from '../../../../services/userService';
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

            open2ndModal: false,
            birthday2ndModal: new Date(0, 0, 0),
            waitingModal: false
        }
    }

    async componentDidMount() {

    }

    handleOnChangeDatePicker = (DatePicked) => {
        let date = DatePicked[0]
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
        let stringDateToUser = getDateThemSo_0(date) + '/' + getMonthThemSo_0(date) + '/' + date.getFullYear()
        this.setState({
            birthday: DatePicked[0],
            birthday2ndModal: stringDateToUser
        })
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
        let itemName = '';
        if (this.props.dr_or_pk === 1) {
            itemName = this.props.Dr_Pk.position + ' ' + this.props.Dr_Pk.name
        } else itemName = this.props.Dr_Pk.name

        let trinh = ''
        if (this.state.birthday) {
            trinh = this.state.birthday.getDate() + '/' + (+this.state.birthday.getMonth() + 1) + '/' + this.state.birthday.getFullYear()
        }

        if (window.confirm(`Bạn muốn đặt lịch khám bệnh?`) == true) {
            this.setState({ waitingModal: true })
            let res = await sendSimpleEmail({ // đầu tiên phải gọi hàm gửi mail
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

                // Còn phải gửi thêm cho email nữa, client có sẵn thì xài luôn, khỏi gọi lại
                clinicName_forEmail: this.props.clinic.name,
                itemName_forEmail: itemName,
                date_forEmail: this.getDaytoString(this.props.date.data.getDay()) + ' ngày ' +
                    this.props.date.data.getDate() + ' tháng ' +
                    (+this.props.date.data.getMonth() + 1) + ' năm ' +
                    this.props.date.data.getFullYear(),
                patientBirthday_forEmail: trinh
            })
            if (!res) { // nếu không có res tức lỗi gì đó mình không biết
                alert('Lỗi không xác định. Chúng tôi sẽ tải lại trang bây giờ')
                window.location.reload()
            }
            // nếu có res tức gọi thành không
            if (res && res.errCode === -1) { //nếu lỗi chỗ Controler, khả năng là mail điền linh tinh
                this.setState({ waitingModal: false })
                toast.error('Có thể email không hợp lệ, vui lòng kiểm tra lại')
            }
            if (res && res.errCode === 2) { //nếu không điền đủ mấy trường kia
                this.setState({ waitingModal: false })
                toast.error('Vui lòng điền đầy đủ thông tin')
            }

            if (res && (res.errCode === 0 || res.errCode === 1)) { //nếu cái mail đó ok, hoặc không có email
                let res2 = await createOrder({ // giờ ta mới tạo đơn
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


                    // Còn phải gửi thêm cho email nữa, client có sẵn thì xài luôn, khỏi gọi lại
                    clinicName_forEmail: this.props.clinic.name,
                    itemName_forEmail: itemName,
                    date_forEmail: this.getDaytoString(this.props.date.data.getDay()) + ' ngày ' +
                        this.props.date.data.getDate() + ' tháng ' +
                        (+this.props.date.data.getMonth() + 1) + ' năm ' +
                        this.props.date.data.getFullYear(),
                    patientBirthday_forEmail: trinh

                })
                if (res2 && res2.errCode === 0) { // nếu add DB thành công
                    this.setState({ waitingModal: false })
                    toast.success('Đặt lịch khám bệnh thành công')
                    this.setState({ open2ndModal: true })
                }
                if (res2 && res2.errCode === 1) { // bước này có thể không cần vì check trên rồi
                    this.setState({ waitingModal: false })
                    toast.error('Vui lòng điền đầy đủ thông tin')

                }
                if (res2 && res2.errCode === -1) {
                    this.setState({ waitingModal: false })
                    toast.error('Lỗi máy chủ')
                }
                if (!res2) {
                    alert('Lỗi không xác định. Chúng tôi sẽ tải lại trang bây giờ')
                    window.location.reload()
                }
            }

        }

    }

    render() {
        // console.log('this.props', this.props)
        // console.log('this.state', this.state)

        let img = ''
        if (this.props.Dr_Pk.image) {
            if (this.props.Dr_Pk.image.type === "Buffer") {
                img = new Buffer(this.props.Dr_Pk.image, 'base64').toString('binary')
            } else {
                img = this.props.Dr_Pk.image
            }
        }

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
                                <div className={this.props.dr_or_pk === 1 ? 'img-doctor' : 'img-medipk'}
                                    style={{ backgroundImage: `url(${img})` }}>
                                </div>
                                <div className='info-doctor'>
                                    {this.props.dr_or_pk === 1 ?
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
                                        <td className='td1'>Email (không bắt buộc):  &ensp;</td>
                                        <td className='td2'><input type="email" placeholder='Email người đặt lịch (không bắt buộc)' className='form-control'
                                            onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                            value={this.state.email} />
                                        </td>
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
                                    <tr><td><u><i><b>Lý do khám</b></i></u> (không bắt buộc):</td></tr>
                                </table>
                                <textarea
                                    cols='90'
                                    rows="4"
                                    placeholder='(không bắt buộc)'
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
                    isOpen={this.state.open2ndModal}
                    className={'booking-modal-container'}
                    size='lg'
                    centered
                >
                    <div className='head2'>
                        &nbsp;
                        <h1>Đặt khám thành công</h1>
                        <div><i onClick={() => {
                            this.setState({ open2ndModal: false })
                            this.props.closeModal()
                            this.setState({
                                sdt: '', // sđt người đặt
                                email: '', // email người đặt
                                forwho: '0', // đặt cho ai?

                                name: '', // họ tên bệnh nhân
                                birthday: '', // ngày sinh bệnh nhân
                                gender: '0', // giới tính?

                                reason: '',
                            })
                        }}
                            class="far fa-window-close fa-lg"></i></div>
                    </div>
                    <div className='thongbaodatlichthanhcong'>
                        <div className='head'>
                            <p>Lịch hẹn của bạn đang trong trạng thái <b>"Chờ duyệt"</b>. Cơ sở y tế sẽ gọi điện thoại cho bạn nếu cần xác nhận</p>
                            <p>Trạng thái lịch hẹn, hướng dẫn khám chi tiết sẽ được gửi qua tin nhắn điện thoại và email</p>
                        </div>
                        <div>
                            <p>Thông tin đặt khám: </p>
                            <table>
                                <tr><td><u><i><b>Thời gian, địa điểm: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Cơ sở y tế: &ensp;</td>
                                    <td className='td2'>{this.props.clinic.name ? this.props.clinic.name : ''}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>{this.props.dr_or_pk === 1 ? 'Bác sĩ' : 'Gói dịch vụ'}: &ensp;</td>
                                    <td className='td2'>{this.props.dr_or_pk === 1 ?
                                        <span>
                                            {this.props.Dr_Pk.position ? this.props.Dr_Pk.position : ''}&nbsp;
                                            {this.props.Dr_Pk.name ? this.props.Dr_Pk.name : ''}
                                        </span>
                                        :
                                        <span>{this.props.Dr_Pk.name ? this.props.Dr_Pk.name : ''}</span>}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Thời gian: &ensp;</td>
                                    <td className='td2'>{this.props.clockTime ? this.props.clockTime : ''}&nbsp;
                                        {this.props.date.data ?
                                            this.getDaytoString(this.props.date.data.getDay()) + ' ngày ' +
                                            this.props.date.data.getDate() + ' tháng ' +
                                            (+this.props.date.data.getMonth() + 1) + ' năm ' +
                                            this.props.date.data.getFullYear()
                                            : ''}</td>
                                </tr>
                                <tr><td><u><i><b>Thông tin người đặt lịch: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Số điện thoại: &ensp;</td>
                                    <td className='td2'>{this.state.sdt}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Email: &ensp;</td>
                                    <td className='td2'>{this.state.email}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Đặt cho mình hay cho người thân? &ensp;</td>
                                    <td className='td2'>{this.state.forwho === '1' ? 'Đặt cho mình' : 'Đặt cho người thân'}</td>
                                </tr>
                                <tr><td><u><i><b>Thông tin bệnh nhân: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Họ và tên: &ensp;</td>
                                    <td className='td2'>{this.state.name}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Ngày/tháng/năm sinh: &ensp;</td>
                                    <td className='td2'>{this.state.birthday2ndModal}</td>

                                </tr>
                                <tr>
                                    <td className='td1'>Giới tính: &ensp;</td>
                                    <td className='td2'>{this.state.gender === '1' ? 'Nam' : 'Nữ'}</td>
                                </tr>
                                <tr><td><u><i><b>Lý do khám: </b></i></u></td></tr>
                            </table>
                            <textarea
                                cols='90'
                                rows="5"
                                placeholder=''
                                value={this.state.reason}
                                readOnly
                            ></textarea>
                        </div>
                    </div>
                </Modal>


                {/* Tiếp tục gài 1 modal waiting */}
                <Modal
                    isOpen={this.state.waitingModal}
                    className={'booking-modal-container'}
                    size='sm'
                    centered
                >
                    <div className='text-center waiting'>
                        <h1>Đang xử lý&nbsp;<i class="fas fa-spinner fa-spin"></i></h1>
                        <br />
                        <h5>Lưu ý: Quá trình có thể mất chút thời gian, tùy vào tốc độ Internet</h5>
                        <h5>Nếu tắt giữa chừng, email vẫn sẽ được gửi, nhưng cơ sở y tế sẽ không nhận được đơn đặt khám của bạn</h5>
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