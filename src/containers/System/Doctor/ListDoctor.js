//
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ListDoctor.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import { getAllDoctorByClinicId, getAllMediPackageByClinicId } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';
import logo from '../../../assets/musMedi.png'
import * as actions from "../../../store/actions";
import DetailDoctorModal from '../../Patient/Doctor/Modal/DetailDoctorModal';



const mdParser = new MarkdownIt()

class ListDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctor: [],
            arrMediPackage: [],
            isOpenModalBooking: false,
            doctor: {},
            medi_package: {}
        }
    }

    async componentDidMount() {
        document.title = `danh sách bác sĩ | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-stethoscope')[0].setAttribute("style", "color:orange;")
        let res = await getAllDoctorByClinicId(this.props.userInfo.id)
        this.setState({ arrDoctor: res.all_doctor_of_clinic })

        let res2 = await getAllMediPackageByClinicId(this.props.userInfo.id)
        this.setState({ arrMediPackage: res2.all_mediPackage_of_clinic })
    }

    openModal = (item) => { // khi click nút này
        this.setState({
            isOpenModalBooking: true,
            doctor: item
        })
    }

    closeModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        // console.log('state listDoctor', this.state.arrDoctor)
        return (
            <div className=''>
                <div className='row'>
                    <div className='col-10 text-center'><h1>Danh sách bác sĩ & gói dịch vụ</h1></div>
                    <div className='col-2'><h1><a href='/system/editDoctor'>Edit</a></h1></div>
                </div>
                <div className='row'>
                    <div className='col-12'><hr /></div>
                    <div className='col-1'></div>
                    <div className='col-8'><h2>Bác sĩ</h2></div>
                    <div className='col-3'><a href='/system/addDoctor'><button type="button" class="btn btn-outline-success"><i className="fas fa-plus"></i> Thêm bác sĩ mới</button></a></div>
                    <div className='col-1'></div>
                    <div className="col-10 row list-doctor">
                        {this.state.arrDoctor && this.state.arrDoctor.map((item, index) => {

                            return (
                                <div className='col-4 child-doctor-medipackage' >
                                    <div className="row">
                                        <div className='col-3 doctor-medipackage-image' style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className='col-9 doctor-medipackage-info'>
                                            <h6 style={{ fontStyle: 'italic', opacity: '0.8' }}>-- {item.position}</h6>
                                            {/* <br /> */}
                                            <h5 style={{ fontWeight: '500' }}>{item.name}</h5>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1"></h5>
                                                <small><h1><button title='Bấm để xem chi tiết' type="button" className="btn btn-link"
                                                    onClick={() => this.openModal(item)}><i className="fas fa-info-circle"></i>
                                                </button></h1></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <DetailDoctorModal
                        isOpenModal={this.state.isOpenModalBooking}
                        closeBookingClose={this.closeModal}
                        /** à cơ hội học props đây rồi.
                         Chắc chắn cái DetailDoctorModal này là component con của ListDoctor 
                         Ta sẽ sang bên DetailDoctorModal xem nó truyền dữ liệu từ cha sang con kiểu gì
                         */
                        // truyền thêm thông tin bác sĩ từ commponent cha luôn
                        infoDoctor={this.state.doctor} //đây, viên đạn được cha gửi gắm,
                    />
                </div>




                <div className='row'>
                    <div className='col-12'><hr /></div>
                    <div className='col-1'></div>
                    <div className='col-8'><h2>Gói dịch vụ</h2></div>
                    <div className='col-3'><a href='/system/addMediPackage'><button type="button" class="btn btn-outline-success"><i className="fas fa-plus"></i> Thêm gói dịch vụ mới</button></a></div>
                    <div className='col-1'></div>
                    <div className="col-10 row list-doctor">
                        {this.state.arrMediPackage && this.state.arrMediPackage.map((item, index) => {

                            return (
                                <div className='col-6 child-doctor-medipackage'>
                                    <div className="row">
                                        <div className='col-3 doctor-medipackage-image' style={{ backgroundImage: `url(${item.image})` }}></div>
                                        <div className='col-9 doctor-medipackage-info'>
                                            {/* <br /> */}
                                            <h5 style={{ fontWeight: '500' }}>{item.name}</h5>
                                            <h6 style={{ fontStyle: 'italic', opacity: '0.8' }}>-- Loại: {item.packageType}</h6>
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1"></h5>
                                                <small><h1><button title='Bấm để xem chi tiết' type="button" className="btn btn-link"
                                                    onClick={() => this.openModal(item)}><i className="fas fa-info-circle"></i>
                                                </button></h1></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}



                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDoctor);