import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import './UserManage.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _, { filter, iteratee } from 'lodash'
import FooterClinic from '../Footer/FooterClinic';
import DatePicker from 'react-flatpickr';
import { getOrderByDate, getOrderByStatusOfClinic, danhDauDaXem, changeStatus } from '../../services/userService';
import moment from 'moment/moment';
import { Modal } from 'reactstrap';
import Select from 'react-select'
import { toast } from 'react-toastify';

class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            datePicked: new Date(), // chắc chỉ có tác dụng hiển thị
            qk_ht_tl: 'Hiện tại',
            arrOrder: [],
            isOpenDetailPatient: false,
            thisPatient: {},

            arrChuaxem: [],
            arrChuaxem_Set: [],

            arrChoduyetTuongLai: [],
            arrChoduyetTuongLai_Set: [],

            arrChapnhanQuakhu: [],
            arrChapnhanQuakhu_Set: [],

            isDanhDauDaXem: false,
            what: 'Đơn khám mới'
        }
    }

    async componentDidMount() {
        document.title = `đơn đặt lịch | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-tasks')[0].setAttribute("style", "color:brown;")
        this.fetchAllOrderByDate(new Date())
        /** Khi mới Mason Mount :D, state.datePicked chính là hôm nay, dù giờ/phút/giây không phải 00:00:00
         * nhưng nhét vào hàm fetchAllOrderByDate thì sẽ biến thành 00:00:00
         * tóm lại mình đút đúng ngày là được, giờ/phút/giây kệ mẹ
        */
        this.fetchOrderChuaXem()
    }

    fetchOrderChuaXem = async () => {
        // Giờ mình sẽ viết hàm thông báo đơn "Chưa xem"
        // Đầu tiên, gọi 1 lần duy nhất xuống DB, lấy tất cả các lịch "Chưa xem" + "of Clinic"
        let res = await getOrderByStatusOfClinic({
            clinicID: this.props.userInfo.id,
            status: 'Chưa xem'
        })
        if (res && res.errCode === 0) this.setState({ arrChuaxem: res.lichdaget })
        let uniqueSet = new Set(this.state.arrChuaxem.map(obj => obj.date))
        this.setState({ arrChuaxem_Set: [...uniqueSet] })

        // Viết hết vào đây
        let res2 = await getOrderByStatusOfClinic({
            clinicID: this.props.userInfo.id,
            status: 'Chờ duyệt'
        })
        if (res2 && res2.errCode === 0) this.setState({ arrChoduyetTuongLai: res2.lichdaget.filter(item => moment(item.date)._d.getTime() > new Date().getTime()) })
        let uniqueSet2 = new Set(this.state.arrChoduyetTuongLai.map(obj => obj.date))
        this.setState({ arrChoduyetTuongLai_Set: [...uniqueSet2] })

        // đây nữa
        let res3 = await getOrderByStatusOfClinic({
            clinicID: this.props.userInfo.id,
            status: 'Chấp nhận'
        })
        if (res3 && res3.errCode === 0) this.setState({
            arrChapnhanQuakhu: res3.lichdaget.filter(
                item => moment(item.date)._d.getTime() < (+new Date().getTime() - 86400000)
            )
        })
        let uniqueSet3 = new Set(this.state.arrChapnhanQuakhu.map(obj => obj.date))
        this.setState({ arrChapnhanQuakhu_Set: [...uniqueSet3] })
    }

    fetchAllOrderByDate = async (datePicked) => { // sẽ dùng nhiều lần nên viết thành 1 hàm rồi gọi đi gọi lại cho tiện
        let dd = datePicked.getDate()
        let mm = +datePicked.getMonth() + 1
        let yy = datePicked.getFullYear()
        let stringDate = this.themSo_0(yy) + '-' + this.themSo_0(mm) + '-' + this.themSo_0(dd)
        let res = await getOrderByDate({
            date: stringDate, // ơ giờ mới để ý, không cần thêm số 0 à???
            clinicID: this.props.userInfo.id
        })
        let date000000 = new Date(datePicked.getFullYear(), datePicked.getMonth(), datePicked.getDate()).getTime() // đưa giờ về 0
        let today0000000 = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()

        // biết qk_ht_tl và sắp xếp luôn cái mảng đó

        if (res && res.errCode === 0) {
            if (date000000 < today0000000 || date000000 === today0000000) {
                this.setState({ qk_ht_tl: 'Quá khứ' })
                let tg = res.booking_by_date
                for (let i = 0; i < tg.length; i++) {
                    switch (tg[i].status) {
                        case 'Chấp nhận': tg[i].level = 1; break;
                        case 'Đã khám': tg[i].level = 2; break;
                        case 'Không đến': tg[i].level = 3; break;
                        case 'Bệnh nhân hủy': tg[i].level = 4; break;
                        case 'Từ chối': tg[i].level = 5; break;
                        case 'Chờ duyệt': tg[i].level = 6; break;
                        case 'Chưa xem': tg[i].level = 7; break;
                        default: break;
                    }
                }
                for (let i = 0; i < tg.length; i++) {
                    for (let j = 0; j < tg.length; j++) {
                        if (tg[i].level < tg[j].level) [tg[i], tg[j]] = [tg[j], tg[i]]
                    }
                }
                this.setState({ arrOrder: tg })
            }
            if (date000000 > today0000000) {
                this.setState({ qk_ht_tl: 'Tương lai' })
                let tg = res.booking_by_date
                for (let i = 0; i < tg.length; i++) {
                    switch (tg[i].status) {
                        case 'Chưa xem': tg[i].level = 1; break;
                        case 'Chờ duyệt': tg[i].level = 2; break;
                        case 'Chấp nhận': tg[i].level = 3; break;
                        case 'Bệnh nhân hủy': tg[i].level = 4; break;
                        case 'Từ chối': tg[i].level = 5; break;
                        default: break;
                    }
                }
                for (let i = 0; i < tg.length; i++) {
                    for (let j = 0; j < tg.length; j++) {
                        if (tg[i].level < tg[j].level) [tg[i], tg[j]] = [tg[j], tg[i]]
                    }
                }
                this.setState({ arrOrder: tg })
            }
        }



    }

    handleOnChangeDatePicker = (datePicked) => {
        this.setState({ datePicked: datePicked[0] })
        this.fetchAllOrderByDate(datePicked[0])
    }

    themSo_0 = (number) => {
        if (number < 10) number = '0' + number
        return number
    }

    handleChangeStatus = async (idOrder, newStatus) => {
        let res = await changeStatus({
            idOrder: idOrder,
            newStatus: newStatus
        })
        if (res && res.errCode === 0) {
            toast.success(`Đã cập nhật trạng thái "${newStatus}"`)
            this.fetchOrderChuaXem()
            this.fetchAllOrderByDate(this.state.datePicked)
        }
        else toast.error('Lỗi')
    }

    render() {
        console.log('this.state', this.state)
        // console.log('this.props', this.props)
        let { createdAt, updatedAt } = this.state.thisPatient
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
                                <tr><td><u><i><b>Thông tin khác: </b></i></u></td></tr>
                                <tr>
                                    <td className='td1'>Đặt lúc: &ensp;</td>
                                    <td className='td2'>{this.themSo_0(moment(createdAt)._d.getHours())}:
                                        {this.themSo_0(moment(createdAt)._d.getMinutes())}&nbsp;
                                        {this.themSo_0(moment(createdAt)._d.getDate())}/
                                        {this.themSo_0(+moment(createdAt)._d.getMonth() + 1)}/
                                        {moment(createdAt)._d.getFullYear()}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Trạng thái: &ensp;</td>
                                    <td className='td2'>{this.state.thisPatient.status}</td>
                                </tr>
                                <tr>
                                    <td className='td1'>Cập nhật lần cuối: &ensp;</td>
                                    <td className='td2'>{this.themSo_0(moment(updatedAt)._d.getHours())}:
                                        {this.themSo_0(moment(updatedAt)._d.getMinutes())}&nbsp;
                                        {this.themSo_0(moment(updatedAt)._d.getDate())}/
                                        {this.themSo_0(+moment(updatedAt)._d.getMonth() + 1)}/
                                        {moment(updatedAt)._d.getFullYear()}</td>
                                </tr>
                                <tr><td><u><i><b>Lý do khám: </b></i></u></td></tr>
                            </table>
                            <textarea cols='90' rows="5" placeholder='' value={this.state.thisPatient.reason} readOnly></textarea>
                        </div>
                    </div>
                </Modal>



                <div className='nofi'>
                    <div style={{ backgroundColor: '#FFFFE0', padding: '10px 0px', borderBottom: '1px solid black' }}>
                        <div className='text-center'><label className='lammoi' onClick={() => {
                            this.fetchOrderChuaXem()
                            this.fetchAllOrderByDate(this.state.datePicked)
                            document.getElementById("sync").setAttribute('class', "fas fa-sync-alt fa-pulse")
                            setTimeout(() => { document.getElementById("sync").setAttribute('class', "fas fa-check-circle") }, 2000)
                            setTimeout(() => { document.getElementById("sync").setAttribute('class', "fas fa-sync-alt") }, 3500)
                        }} title='Cập nhật lại dữ liệu mà không load lại trang'>
                            Làm mới trang <i id="sync" className="fas fa-sync-alt"></i></label></div>
                        <div className='view'>
                            <div class="notification">
                                <div className='choduyet' style={{ backgroundColor: '#d4ebff' }}
                                    onClick={() => this.setState({ what: 'Chờ duyệt' })}>Chờ duyệt</div>
                                <span class="badge badge1">{this.state.arrChoduyetTuongLai.length}</span>
                            </div>
                            <div class="notification">
                                <span onClick={() => this.setState({ what: 'Đơn khám mới' })}><i class="fas fa-bell"></i></span>
                                <span class="badge badge2">{this.state.arrChuaxem.length}</span>
                            </div>
                        </div>
                        <div class="notification" style={{ marginLeft: '20px' }}>
                            <div className='choduyet' style={{ backgroundColor: '#efef1c' }}
                                onClick={() => this.setState({ what: 'Chưa xử lý' })}>Chưa xử lý</div>
                            <span class="badge badge3">{this.state.arrChapnhanQuakhu.length}</span>
                        </div>
                    </div>
                    <div className='list'>
                        <label>
                            {this.state.what === 'Đơn khám mới' ? 'Đơn khám mới' : ''}
                            {this.state.what === 'Chờ duyệt' ? 'Chờ duyệt' : ''}
                            {this.state.what === 'Chưa xử lý' ? 'Chưa xử lý' : ''}
                        </label>
                        <table>
                            {this.state.what === 'Đơn khám mới' ? <>{this.state.arrChuaxem_Set.sort().map(ngay => {
                                return (<tr>
                                    <td className='ngay' style={{ backgroundColor: 'antiquewhite' }} onClick={() => {
                                        this.setState({ datePicked: moment(ngay)._d })
                                        this.fetchAllOrderByDate(moment(ngay)._d)
                                    }}>{ngay};</td>
                                    <td>&nbsp;</td>
                                    <td><div className="num badge2">
                                        {this.state.arrChuaxem.filter(obj => obj.date === ngay).length}
                                    </div></td>
                                    <td>&nbsp;</td>
                                </tr>)
                            })}</> : <></>}
                            {/* *********************************** */}
                            {this.state.what === 'Chờ duyệt' ? <>{this.state.arrChoduyetTuongLai_Set.sort().map(ngay => {
                                return (<tr>
                                    <td className='ngay' style={{ backgroundColor: '#d4ebff' }} onClick={() => {
                                        this.setState({ datePicked: moment(ngay)._d })
                                        this.fetchAllOrderByDate(moment(ngay)._d)
                                    }}>{ngay}</td>
                                    <td>&nbsp;</td>
                                    <td><div className="num badge1">
                                        {this.state.arrChoduyetTuongLai.filter(obj => obj.date === ngay).length}
                                    </div></td>
                                    <td>&nbsp;</td>
                                </tr>)
                            })}</> : <></>}
                            {/* *********************************** */}
                            {this.state.what === 'Chưa xử lý' ? <>{this.state.arrChapnhanQuakhu_Set.sort().map(ngay => {
                                return (<tr>
                                    <td className='ngay' style={{ backgroundColor: '#efef1c' }} onClick={() => {
                                        this.setState({ datePicked: moment(ngay)._d })
                                        this.fetchAllOrderByDate(moment(ngay)._d)
                                    }}>&emsp;{ngay}&emsp;</td>
                                    <td>&nbsp;</td>
                                    <td><div className="num badge3">
                                        {this.state.arrChapnhanQuakhu.filter(obj => obj.date === ngay).length}
                                    </div></td>
                                    <td>&nbsp;</td>
                                </tr>)
                            })}</> : <></>}
                        </table>

                    </div>
                </div>

                <div className='book'>
                    <div className='date'>
                        <div style={{ display: 'flex' }}>
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
                    </div>
                    {this.state.arrOrder.filter(item => item.status === 'Chưa xem').length === 0 ? <></> : <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <div style={{ textAlign: 'right' }}><label className='danhdaudaxem' onClick={async () => {
                            let dd = this.state.datePicked.getDate()
                            let mm = +this.state.datePicked.getMonth() + 1
                            let yy = this.state.datePicked.getFullYear()
                            let stringDate = this.themSo_0(yy) + '-' + this.themSo_0(mm) + '-' + this.themSo_0(dd)
                            await danhDauDaXem({
                                date: stringDate, // ơ giờ mới để ý, không cần thêm số 0 à???
                                clinicID: this.props.userInfo.id
                            })
                            this.fetchOrderChuaXem()
                            this.fetchAllOrderByDate(this.state.datePicked)
                        }}>
                            <i className="fas fa-check"></i> Đánh dấu tất cả là "đã xem"
                        </label></div>
                    </div>}
                    <div className='list'>

                        {this.state.arrOrder && this.state.arrOrder.map(order => {
                            let status = ''; let backgroundColor = ''
                            switch (order.status) {
                                case 'Chưa xem':
                                    status = 'orange'; backgroundColor = '#ffd78f'
                                    break;
                                case 'Chấp nhận':
                                    status = 'lightgreen'
                                    break;
                                case 'Chờ duyệt':
                                    status = 'blue'
                                    break;
                                case 'Đã khám':
                                    status = 'black'; backgroundColor = '#c3ffc3'
                                    break;
                                case 'Không đến':
                                    status = 'black'; backgroundColor = '#ffd3d3'
                                    break;
                                case 'Từ chối':
                                    status = 'black'; backgroundColor = '#ffd3d3'
                                    break;
                                case 'Bệnh nhân hủy':
                                    status = 'white'
                                    break;

                                default:
                                    break;
                            }


                            return (<div className='child' style={{ backgroundColor: backgroundColor }}>
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
                                    {/* <h6 color='red'>{order.status}</h6> */}
                                </div>
                                <div style={{ borderLeft: `2px solid ${status}`, margin: '10px 0px 10px 0px' }}></div>
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
                                <div style={{ borderLeft: `2px solid ${status}`, margin: '10px 0px 10px 0px' }}></div>
                                <div className='infokham'>
                                    <div className={`${order.status === 'Từ chối' || order.status === 'Bệnh nhân hủy' ? 'gach' : ''}`} style={{ display: 'flex' }}>
                                        <div className={order.dr_or_pk === 1 ? 'small-ava dr' : 'small-ava pk'} style={{ backgroundImage: `url(${new Buffer(order.doctorData.image, 'base64').toString('binary')})` }}></div>
                                        <div style={{ marginLeft: '10px' }}>
                                            <small>{order.doctorData.position}</small>
                                            <h5>{order.doctorData.name}</h5>
                                        </div>
                                    </div>

                                    {order.status === 'Đã khám' ? <h5 style={{ color: 'green', marginTop: '10px' }}>Đã khám <i className="fas fa-check"></i></h5> : <></>}
                                    {order.status === 'Không đến' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Không đến <i className="fas fa-times"></i></h5> : <></>}
                                    {order.status === 'Từ chối' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Đã từ chối <i className="fas fa-times"></i></h5> : <></>}
                                    {order.status === 'Bệnh nhân hủy' ? <h5 style={{ color: 'red', marginTop: '10px' }}>Bệnh nhân hủy <i className="fas fa-times"></i></h5> : <></>}

                                    {this.state.qk_ht_tl === 'Tương lai'
                                        && (order.status === 'Chưa xem' || order.status === 'Mới xem' || order.status === 'Chờ duyệt') ?
                                        <div style={{ display: 'flex' }}>
                                            <div className='choose' style={{ backgroundColor: 'lightgreen' }}
                                                onClick={() => {
                                                    this.handleChangeStatus(order.id, 'Chấp nhận');

                                                }}>
                                                Chấp nhận <i className="fas fa-check"></i></div>
                                            <div className='choose' style={{ backgroundColor: 'tomato' }}
                                                onClick={() => {
                                                    this.handleChangeStatus(order.id, 'Từ chối');

                                                }}>
                                                Từ chối <i className="fas fa-times"></i></div>
                                        </div> : <></>}

                                    {this.state.qk_ht_tl === 'Tương lai'
                                        && order.status === 'Chấp nhận' ?
                                        <h5 style={{ color: 'green' }}>Đã chấp nhận <i className="fas fa-check"></i></h5> : <></>}

                                    {(this.state.qk_ht_tl === 'Hiện tại' || this.state.qk_ht_tl === 'Quá khứ')
                                        && order.status === 'Chấp nhận' ?
                                        <div style={{ display: 'flex' }}>
                                            <div className='choose' style={{ backgroundColor: 'aqua' }}
                                                onClick={() => {
                                                    this.handleChangeStatus(order.id, 'Đã khám');

                                                }}>
                                                Đã khám <i className="fas fa-check"></i></div>
                                            <div className='choose' style={{ backgroundColor: 'gainsboro' }}
                                                onClick={() => {
                                                    this.handleChangeStatus(order.id, 'Không đến');

                                                }}>
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
            </div >


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

/**có 7 loại trạng thái đơn hàng
 * Chưa xem
 * Chờ duyệt
 * Chấp nhận
 * Từ chối
 * Bệnh nhân hủy
 * Đã khám
 * Không đến
 */