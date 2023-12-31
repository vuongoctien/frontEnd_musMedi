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
import { editDoctorOfClinic } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../../utils'

const mdParser = new MarkdownIt()

/** Không cần lằng nhằng gì cả, khai báo 1 câu là được
 * thằng con DetailDoctorModal cứ tự nhiên sử dụng dữ liệu từ cha ListDoctor truyền xuống 
 * Còn mấy cái lằng nhằng, nào mapDispath nào adminAction nào actionType gì gì đó, nó là Redux
*/

class DetailDoctorModal extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) { }

    render() {
        console.log('this.props.infoDoctor', this.props.infoDoctor)
        // console.log('this.state.previewImgURL', this.state.previewImgURL)
        return (
            <Modal
                isOpen={this.props.isOpenModal}// dòng này không bỏ được đâu, đừng nghịch dại
                className={'booking-modal-container'}
                size='lg'
                centered
            >

                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>Thông tin chi tiết</span>
                        <span className='right' onClick={() => { this.props.closeBookingClose() }}><i className='fas fa-times'></i></span>
                    </div>

                    <div className='booking-modal-body'>
                        <div className='col-12 row'>
                            <div className='col-3'>
                                <div
                                    className='col-12 doctor-image-modal'
                                    style={{ backgroundImage: `url(${this.props.infoDoctor.image})` }}
                                ></div>
                            </div>
                            {this.props.infoDoctor.dr_or_pk === 1 ?
                                <div className='col-9 row'>
                                    <div className='col-6'>
                                        <div><h6>Họ và tên: </h6></div>
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.name} /></div>
                                    </div>
                                    <div className='col-6'>
                                        <div><h6>Chức danh: </h6></div>
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.position} /></div>
                                    </div>
                                    <div className='col-12'><br /></div>
                                    <div className='col-6'>
                                        <div><h6>Tài khoản: </h6></div>
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.nickName} /></div>
                                    </div>
                                    <div className='col-6'>
                                        <div><h6>Mật khẩu: </h6></div>
                                        <div><input disabled className='form-control' type="password" value='this.props.infoDoctor.password' /></div>
                                    </div>
                                    <div className='col-12'><br /></div>
                                </div>
                                :
                                <div className='col-9 row'>
                                    <div className='col-12'>
                                        <div><h6>Tên gói khám: </h6></div>
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.name} /></div>
                                    </div>
                                    <div className='col-12'><br /></div>
                                    <div className='col-12'>
                                        <div><h6>Loại: </h6></div>
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.position} /></div>
                                    </div>
                                    <div className='col-12'><br /></div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='col-12' >
                        <div className='col-12' style={{ color: 'blue' }}>Thông tin khám</div>
                        <div className='col-12' style={{ color: 'blue' }}>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className='col-12'><br /></div>
                        <div>
                            <textarea disabled className='form-control' rows='10' value={this.props.infoDoctor.thongtinkham}></textarea>
                        </div>
                        <div className='col-12'><br /></div>
                    </div>
                    <div className='col-12' >
                        <div className='col-12' style={{ color: 'blue' }}>Đoạn giới thiệu ngắn</div>
                        <div className='col-12' style={{ color: 'blue' }}>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className='col-12'><br /></div>
                        <div style={{ minHeight: '15vh' }}>
                            <textarea disabled className='form-control' rows='5' value={this.props.infoDoctor.intro}></textarea>
                        </div>
                        <div className='col-12'><br /></div>
                    </div>

                    <div className='col-12' >
                        <div className='col-12' style={{ color: 'blue' }}>Đoạn giới thiệu đầy đủ</div>
                        <div className='col-12' style={{ color: 'blue' }}>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                            <i className="fas fa-arrow-down"></i>
                        </div>
                        <div className='col-12'><br /></div>
                        <div
                            style={{ minHeight: '70vh' }}
                            dangerouslySetInnerHTML={{ __html: this.props.infoDoctor.descriptionHTML }}
                        >

                        </div>
                    </div>

                    <div className='booking-modal-footer'>
                        <button type="button" className='btn btn-outline-danger' onClick={() => { }}>Xóa Bác sĩ</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctorModal);