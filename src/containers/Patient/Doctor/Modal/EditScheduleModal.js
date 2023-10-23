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
import { createSchedule, deleteSchedule } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../../utils'
import './EditScheduleModal.scss'

const mdParser = new MarkdownIt()

class EditScheduleModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            render: 0,
            selectedDate: new Date(),
            list_Khung_Gio_Da_Tao: [],
            selectedArea: { "label": "Chỉ 1 ngày", "value": 0 }
        }
    }

    // async componentDidMount() {
    // }

    // async componentDidUpdate(prevProps, prevState, snapshot) { }

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

    handleChangeArea = (selectedArea) => {
        this.setState({ selectedArea: selectedArea })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ selectedDate: date[0] })
    }

    dom = (number) => { return document.getElementsByClassName('inputClockDOM')[number].value }

    NUMtoSTR = (number) => {
        if (this.dom(number) < 10) return '0' + this.dom(number)
        else return this.dom(number)
    }

    ThemKhungGio = () => {
        if (!this.dom(0) || !this.dom(1) || !this.dom(2) || !this.dom(3)) {
            alert('Vui lòng điền đầy đủ thông tin')
        } else {
            let string = ''
            string = this.NUMtoSTR(0) + ':' + this.NUMtoSTR(1) + '-' + this.NUMtoSTR(2) + ':' + this.NUMtoSTR(3)
            this.state.list_Khung_Gio_Da_Tao.push(string)
            this.setState({ render: 0 })
        }

    }

    TaoLichBieu = () => {
        /* Đây là trường hợp this.state.list_Khung_Gio_Da_Tao có phần tử rồi, 
        mảng mới được duyệt và API mới được gọi
        Muốn làm rỗng lịch thì chạy xuống hàm bên dưới*/
        if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
            alert('Bạn chưa chọn khung giờ')
            toast.error('Bạn chưa chọn khung giờ')
        } else {
            if (window.confirm(`Bạn muốn cập nhật lịch liểu cho ${this.props.selectedDoctor.name}?`) === true) {
                /*****trường hợp Chọn 1 ngày */
                if (this.state.selectedArea.value === 0) { // trường hợp Chọn 1 ngày
                    this.state.list_Khung_Gio_Da_Tao.map(async item => {
                        let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate())))
                        let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                        let res = await createSchedule({
                            date: stringDate,
                            dr_or_pk: 1,
                            dr_or_pk_ID: this.props.selectedDoctor.value,
                            clockTime: item,
                            price: 'Chưa xác định',
                        })
                        if (res) {
                            if (res.errCode === 0) toast.success(`thêm thành công ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                            if (res.errCode === 1) toast.error(`Lỗi đầu vào khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                            if (res.errCode === -1) toast.error(`Lỗi máy chủ khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                        } else toast.error('lỗi chưa xác định')
                    })
                }
                /***trường hợp Chọn mỗi thứ */
                if (this.state.selectedArea.value === 1) { // trường hợp Chọn mỗi thứ
                    for (let i = 0; i < 5; i++) {
                        this.state.list_Khung_Gio_Da_Tao.map(async item => {
                            let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate() + i * 7)))
                            let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                            let res = await createSchedule({
                                date: stringDate,
                                dr_or_pk: 1,
                                dr_or_pk_ID: this.props.selectedDoctor.value,
                                clockTime: item,
                                price: 'Chưa xác định',
                            })
                            if (res) {
                                if (res.errCode === 0) toast.success(`thêm thành công ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                                if (res.errCode === 1) toast.error(`Lỗi đầu vào khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                                if (res.errCode === -1) toast.error(`Lỗi máy chủ khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                            } else toast.error('lỗi chưa xác định')
                        })
                    }
                }
                /***trường hợp Chọn mỗi ngày */
                if (this.state.selectedArea.value === 2) { // trường hợp Chọn mỗi ngày
                    for (let i = 0; i < 39; i++) {
                        this.state.list_Khung_Gio_Da_Tao.map(async item => {
                            let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate() + i)))
                            let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                            let res = await createSchedule({
                                date: stringDate,
                                dr_or_pk: 1,
                                dr_or_pk_ID: this.props.selectedDoctor.value,
                                clockTime: item,
                                price: 'Chưa xác định',
                            })
                            if (res) {
                                if (res.errCode === 0) toast.success(`thêm thành công ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                                if (res.errCode === 1) toast.error(`Lỗi đầu vào khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                                if (res.errCode === -1) toast.error(`Lỗi máy chủ khi thêm ${item} ${stringDate} ${this.props.selectedDoctor.name}`)
                            } else toast.error('lỗi chưa xác định')
                        })
                    }
                }
            }
        }
    }

    LamRongLich = async () => {
        if (this.state.list_Khung_Gio_Da_Tao.length === 0) {
            if (window.confirm(`Bạn muốn làm rỗng lịch cho ${this.props.selectedDoctor.name}?`) === true) {
                /*****trường hợp Chọn 1 ngày */
                if (this.state.selectedArea.value === 0) { // trường hợp Chọn 1 ngày
                    let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate())))
                    let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                    let res = await deleteSchedule({
                        date: stringDate,
                        dr_or_pk: 1,
                        dr_or_pk_ID: this.props.selectedDoctor.value,
                    })
                    if (res && res.errCode === 0) {
                        toast.success('Làm rỗng lịch thành công')
                    } else toast.error('Làm rỗng thất bại')

                }
                /***trường hợp Chọn mỗi thứ */
                if (this.state.selectedArea.value === 1) { // trường hợp Chọn mỗi thứ
                    for (let i = 0; i < 5; i++) {
                        let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate() + i * 7)))
                        let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                        let res = await deleteSchedule({
                            date: stringDate,
                            dr_or_pk: 1,
                            dr_or_pk_ID: this.props.selectedDoctor.value,
                            price: 'Chưa xác định',
                        })
                        if (res && res.errCode === 0) {
                            toast.success('Làm rỗng lịch thành công')
                        } else toast.error('Làm rỗng thất bại')
                    }
                }
                /***trường hợp Chọn mỗi ngày */
                if (this.state.selectedArea.value === 2) { // trường hợp Chọn mỗi ngày
                    for (let i = 0; i < 39; i++) {
                        let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate() + i)))
                        let stringDate = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate()
                        let res = await deleteSchedule({
                            date: stringDate,
                            dr_or_pk: 1,
                            dr_or_pk_ID: this.props.selectedDoctor.value,
                            price: 'Chưa xác định',
                        })
                        if (res && res.errCode === 0) {
                            toast.success('Làm rỗng lịch thành công')
                        } else toast.error('Làm rỗng thất bại')
                    }
                }
            }
        } else {
            alert('Lựa chọn không khả dụng do bạn đã tạo khung giờ')
            toast.error('Lựa chọn không khả dụng do bạn đã tạo khung giờ')
        }
    }



    render() {
        // console.log(this.props)
        // console.log(this.state)
        return (
            <Modal
                isOpen={this.props.isOpenModal}// tức isOpen là 1 thuộc tính có sẵn của modal, nó đang nhận giá trị this.props.isOpenModal
                className={'booking-modal-container'}
                size='lg'
                centered
            >

                <div className='booking-modal-content'>
                    <h3>Cảnh báo: Modal này bị lỗi nghiêm trọng chỗ <u>let thisDate = (new Date(new Date().setDate(this.state.selectedDate.getDate())))</u></h3>

                    <div className='booking-modal-header'>
                        <span className='left'>Tạo lịch biểu</span>
                        <span className='right' onClick={() => { this.props.closeModal(); this.setState({ list_Khung_Gio_Da_Tao: [] }) }}><i className='fas fa-times'></i></span>
                    </div>

                    <div className='booking-modal-body taolich'>
                        <div className=''>
                            <div className='col-12 row'>
                                <div className='col-5'>
                                    <div className='row'>
                                        <div className='col-2'>
                                            <div className='avatarmodal' style={{ backgroundImage: `url(${this.props.selectedDoctor.image})` }}></div>
                                        </div>
                                        <div className='col-10'>
                                            <h5 style={{ padding: '2vh' }}>{this.props.selectedDoctor.name}</h5 >
                                        </div>
                                    </div>
                                </div>

                                <div className='col-3'>
                                    <label>Chọn ngày chỉnh sửa:</label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.selectedDate}
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))} // yesterday
                                    />
                                </div>
                                <div className='col-4'>
                                    <label>Thay đổi cho: </label>
                                    <Select
                                        value={this.state.selectedArea}
                                        onChange={this.handleChangeArea}
                                        options={[
                                            { "label": "Chỉ 1 ngày", "value": 0 },
                                            { "label": `Mỗi ${this.getDaytoString(this.state.selectedDate.getDay())} trong 5 tuần tới`, "value": 1 },
                                            { "label": "Mỗi ngày trong 40 ngày tới", "value": 2 }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className='col-12'>
                                <p>Tạo khung giờ: </p>
                                <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" />
                                &nbsp;:&nbsp;
                                <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" />
                                &nbsp;-&nbsp;
                                <input className='inputClockDOM' type="number" min="6" max="23" placeholder="Giờ" step="1" />
                                &nbsp;:&nbsp;
                                <input className='inputClockDOM' type="number" min="0" max="55" placeholder="Phút" step="15" />
                                &emsp;
                                <button type="button" class="btn btn-secondary" onClick={() => this.ThemKhungGio()}>Thêm</button>
                            </div>
                            <div style={{ height: '2vh' }}></div>
                            <div className='khungiodatao'>
                                {this.state.list_Khung_Gio_Da_Tao.map(item => {
                                    return (<button>{item}</button>)
                                })}
                            </div>
                            <hr />
                            <div className='foot row'>
                                <div className='col-3'>
                                    <button type="button" class="btn btn-primary" onClick={() => this.TaoLichBieu()} > Tạo lịch biểu</button>
                                </div>
                                <div className='col-9'>
                                    <p>Với lựa chọn "Tạo lịch biểu", lịch khám mới tạo sẽ được bổ sung vào lịch khám cũ.<br />
                                        Để tránh trùng lặp, bạn có thể lựa chọn "Làm rỗng lịch" trước khi tạo lịch khám mới.<br />
                                        Xin lỗi vì sự bất tiện này, đội lập trình của chúng tôi chưa biết cách xử lý bất đồng bộ JavaScript
                                    </p>
                                </div>
                            </div>
                            <hr />
                            <div className='foot row'>
                                <div className='col-3'>
                                    <button type="button" class="btn btn-danger" onClick={() => this.LamRongLich()} > Làm rỗng lịch</button>
                                </div>
                                <div className='col-9'>
                                    <p>(Xóa toàn bộ lịch khám đã tồn tại trong các ngày đã chọn)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='booking-modal-footer'>

                    </div>
                </div>
            </Modal >
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditScheduleModal);