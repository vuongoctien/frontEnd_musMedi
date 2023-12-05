import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions'
import DatePicker from '../../components/Input/DatePicker';
import Select from 'react-select'
import { getAllClinic, getOrderByClinic } from '../../services/userService';
import './Excel.scss'
import moment from 'moment';
import { CommonUtils } from '../../utils';

class ExcelClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listClinic: [],

            ngayBatDau: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            ngayKetThuc: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            csytDuocChon: {
                label: '<<< Tất cả >>>',
                value: 'ALL',
                name: 'Tất cả CSYT'
            },

            data: []
        }
    }

    async componentDidMount() {
        document.title = `truy xuất dữ liệu | ${this.props.userInfo.name}`
        document.getElementsByClassName('fas fa-database')[0].setAttribute("style", "color:brown;")
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                listClinic: this.buildDataInputSelect(res.data)
            })
        } else alert('Lỗi khi tải danh sách CSYT')

        // let res2 = await getOrderByClinic({ clinicID: 'ALL' })
        // if (res2 && res2.errCode === 0) {
        //     this.setState({
        //         data: res2.data
        //     })
        // } else alert('Lỗi khi tải dữ liệu')
        this.xuatDuLieu()
    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.csytDuocChon]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `${item.id} __ ${item.name}`
                object.value = item.id
                object.name = item.name
                result.push(object)
            })
        }
        return result
    }

    handleChangeSelect = async (selectedOption) => {
        await this.setState({ csytDuocChon: selectedOption })
        this.xuatDuLieu()
    }

    handleOnChangeDatePicker1 = async (DatePicked) => {
        await this.setState({ ngayBatDau: DatePicked[0] })
        this.xuatDuLieu()
    }

    handleOnChangeDatePicker2 = async (DatePicked) => {
        await this.setState({ ngayKetThuc: DatePicked[0] })
        this.xuatDuLieu()
    }

    xuatDuLieu = async () => {
        let res2 = await getOrderByClinic({ clinicID: this.props.userInfo.id })
        if (res2 && res2.errCode === 0) {
            let data = res2.data
            data = data.filter(item =>
                moment(item.date)._d.getTime() <= this.state.ngayKetThuc.getTime() &&
                moment(item.date)._d.getTime() >= this.state.ngayBatDau.getTime()
            )
            this.setState({
                data: data
            })
        } else alert('Lỗi khi tải dữ liệu')
    }

    stringDate = (date) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-`
    }



    render() {
        console.log(this.props)
        return (
            <div className='excel' style={{ padding: ' 30px 20px' }}>
                <div className='col-12 row'>
                    <h3>Dữ liệu đơn đặt khám</h3>
                </div>
                <div className='col-12 row'>
                    <h5><br /></h5>
                </div>
                <div className='col-12 row'>
                    <div className='col-3'>
                        <div className='col-12'>
                            <h5>Từ ngày</h5>
                        </div>
                        <div className='col-12'>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker1}
                                className='form-control'
                                value={this.state.ngayBatDau}
                            />
                        </div>
                    </div>
                    <div className='col-3'>
                        <div className='col-12'>
                            <h5>Đến ngày</h5>
                        </div>
                        <div className='col-12'>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker2}
                                className='form-control'
                                value={this.state.ngayKetThuc}
                            />
                        </div>
                    </div>
                    <div className='col-6' hidden>
                        <div className='col-12'>
                            <h5>Chọn cơ sở y tế</h5>
                        </div>
                        <div className='col-12'>
                            <div className='col-9'>
                                <
                                    Select
                                    value={this.state.csytDuocChon}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listClinic}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <br />
                    <h4>Chức năng truy xuất dữ liệu của musMedi vẫn chưa hoàn thiện. Để truy xuất dữ liệu, vui lòng&nbsp;
                        <i className='xuatraexcel' onClick={async () => {
                            let data = []
                            for (let i = 0; i < this.state.data.length; i++) {
                                const element = this.state.data[i];
                                const _d = moment(element.patientBirthday)._d
                                data[i] = {
                                    'STT': i + 1,
                                    'id': element.id,
                                    'Ngày': element.date,
                                    'Giờ': element.clockTime,
                                    'Bệnh nhân': element.patientName,
                                    'Giới tính': element.patientGender,
                                    'Ngày sinh': `${_d.getFullYear()}-${_d.getMonth() + 1}-${_d.getDate()}`,
                                    'Email': element.email,
                                    'Số điện thoại': element.phoneNumber,
                                    'Cơ sở Y tế': element.clinicData1.name,
                                    'Bác sĩ': element.doctorData.name,
                                    'Lý do khám': element.reason,
                                    'Trạng thái': element.status,
                                    'Đặt lúc': moment(element.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
                                    'Cập nhật lần cuối': moment(element.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
                                }
                            }
                            await CommonUtils.exportExcel(data,
                                `${this.stringDate(this.state.ngayBatDau)} _ ${this.stringDate(this.state.ngayKetThuc)}`,
                                `${this.stringDate(this.state.ngayBatDau)} _ ${this.stringDate(this.state.ngayKetThuc)} _ ${this.props.userInfo.name}`)
                        }}>xuất ra Excel</i>
                    </h4>
                </div>
                <div className=''>
                    <table>
                        <tr>
                            <th>STT</th>
                            <th>id</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Bệnh nhân</th>
                            <th>Giới tính</th>
                            <th>Năm sinh</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Cơ sở Y Tế</th>
                            <th>Bác sĩ</th>
                            {/* <th>Lý do khám</th> */}
                            <th>Trạng thái</th>
                            <th>Đặt lúc</th>
                            <th>Cập nhật lần cuối</th>
                        </tr>
                        {this.state.data && this.state.data.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.clockTime}</td>
                                    <td>{item.patientName}</td>
                                    <td>{item.patientGender}</td>
                                    <td>{moment(item.patientBirthday).format('YYYY')}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.clinicData1.name}</td>
                                    <td>{item.doctorData.name}</td>
                                    {/* <td>{item.reason}</td> */}
                                    <td>{item.status}</td>
                                    <td>{moment(item.createdAt).format()}</td>
                                    <td>{moment(item.createdAt).format()}</td>
                                </tr>
                            )
                        })}
                    </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ExcelClinic);

