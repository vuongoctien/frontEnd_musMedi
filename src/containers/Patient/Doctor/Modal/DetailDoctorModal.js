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
import { getAllDetailClinicById } from '../../../../services/userService';
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
            view_or_edit: true,
            imageBase64: '',
            previewImgURL: '',
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) { }

    handleOnChangeImage = async (event) => {
        let data = event.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgURL: objectUrl,
                imageBase64: base64
            })
        }
        document.getElementById('kec').innerHTML = ''
    }

    render() {
        // console.log('this.props.infoDoctor', this.props.infoDoctor)
        console.log('this.state.previewImgURL', this.state.previewImgURL)
        return (
            <Modal
                isOpen={this.props.isOpenModal}// dòng này không bỏ được đâu, đừng nghịch dại
                className={'booking-modal-container'}
                size='lg'
                centered
            >

                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>Đây là DetailDoctorModal</span>
                        <span className='right' onClick={() => {
                            this.setState({ view_or_edit: true })
                            this.props.closeBookingClose()
                        }}>
                            <i className='fas fa-times'></i>
                        </span>
                    </div>

                    <div className='booking-modal-body'>
                        <div className='col-12 row'>
                            <div className='col-3'>
                                {this.state.view_or_edit === true ?
                                    <div
                                        className='col-12 doctor-image-modal'
                                        style={{ backgroundImage: `url(${this.props.infoDoctor.image})` }}
                                    // style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                    ></div>
                                    :
                                    <div
                                        className='col-12 doctor-image-modal' id='kec'
                                        // style={{ backgroundImage: `url(${this.props.infoDoctor.image})` }}
                                        style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                    >
                                        {/* <h1><i className="fas fa-user-tie"></i></h1> */}
                                        <img id='old-img-edit' src={this.props.infoDoctor.image} />
                                    </div>
                                }
                                <div className='col-12'>
                                    {this.state.view_or_edit === true ?
                                        <>
                                            <br />
                                            <label id='label-upload' style={{ opacity: 0 }}>Chọn ảnh <i class="fas fa-images"></i></label>
                                        </>
                                        :
                                        <>
                                            <input onChange={(event) => this.handleOnChangeImage(event)} className='form-control' type='file' id='default_button' hidden />
                                            <br />
                                            <label id='label-upload' htmlFor='default_button'>Chọn ảnh <i class="fas fa-images"></i></label>
                                        </>
                                    }
                                </div>
                            </div>


                            <div className='col-9 row'>
                                <div className='col-6'>
                                    <div><h6>Họ và tên: </h6></div>
                                    {this.state.view_or_edit === true ?
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.name} /></div>
                                        :
                                        <div><input className='form-control' type="text" value={this.props.infoDoctor.name} /></div>
                                    }
                                </div>
                                <div className='col-6'>
                                    <div><h6>Chức danh: </h6></div>
                                    {this.state.view_or_edit === true ?
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.position} /></div>
                                        :
                                        <div><input className='form-control' type="text" value={this.props.infoDoctor.position} /></div>}
                                </div>
                                <div className='col-12'><br /></div>
                                <div className='col-6'>
                                    <div><h6>Tài khoản: </h6></div>
                                    {this.state.view_or_edit === true ?
                                        <div><input disabled className='form-control' type="text" value={this.props.infoDoctor.nickName} /></div>
                                        :
                                        <div><input className='form-control' type="text" value={this.props.infoDoctor.nickName} /></div>}
                                </div>
                                <div className='col-6'>
                                    <div><h6>Mật khẩu: </h6></div>
                                    {this.state.view_or_edit === true ?
                                        <div><input disabled className='form-control' type="password" value='this.props.infoDoctor.password' /></div>
                                        :
                                        <div><input className='form-control' type="password" value='this.props.infoDoctor.password' /></div>}
                                </div>
                                <div className='col-7'><br /></div>
                                <div className='col-5'>
                                    <div><h6><br /></h6></div>

                                    <div>
                                        {
                                            this.state.view_or_edit === true ?
                                                <button type='button' className='btn btn-info'
                                                    onClick={() => { this.setState({ view_or_edit: false }) }}>Chỉnh sửa thông tin <i className="far fa-edit"></i>
                                                </button>
                                                :
                                                <button type='button' className='btn btn-secondary'
                                                    onClick={() => { if (window.confirm(`Bạn muốn thôi chỉnh sửa?`) === true) { window.location.reload() } }}
                                                >
                                                    Hủy thay đổi
                                                    <i className="fas fa-window-close"></i>
                                                </button>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12' >
                        {/* <div className='col-12'><br /></div> */}
                        <div className='col-12' style={{ color: 'blue' }}>Thông tin giới thiệu</div>
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
                        <div style={{ minHeight: '70vh' }}>
                            {this.state.view_or_edit === true ?
                                <>{this.props.infoDoctor.descriptionHTML}</>
                                :
                                <MdEditor
                                    style={{ height: '100vh' }}
                                    renderHTML={text => mdParser.render(text)}
                                    value={this.props.infoDoctor.descriptionMarkdown}
                                />}

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