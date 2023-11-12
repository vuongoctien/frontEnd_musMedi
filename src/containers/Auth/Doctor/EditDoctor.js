import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import * as actions from "../../../store/actions";
import {
    getDetailInfoDoctor, getAllDoctorByClinicId, editDoctorOfClinic,
    getDetailMediPackageById, getAllMediPackageByClinicId, editMediPackageOfClinic
} from '../../../services/userService';
import './EditDoctor.scss'
import FooterClinic from '../../Footer/FooterClinic';

const mdParser = new MarkdownIt()

class EditDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // data
            name: '',
            position: '',
            selectedPackageType: {},
            imageBase64: '',
            intro: '',
            thongtinkham: '',
            descriptionHTML: '',
            descriptionMarkdown: '',


            //select
            selectedDoctor: {
                label: '<<< không có Bác sĩ được chọn >>>',
                value: 0
            },
            listDoctor: [],
            selectedMediPackage: {
                label: '<<< không có Gói dịch vụ được chọn >>>',
                value: 0
            },
            listMediPackage: [],

            // ảnh
            previewImgURL: '',
            isOpen: false,

            // create or update?
            ADD_or_EDIT: true,

            //Doctor or MediPackage?
            Doctor_or_MediPackage: true,
        }
    }

    async componentDidMount() {
        document.title = `Chỉnh sửa thông tin | ${this.props.match.params.clinicName}`
        // document.getElementsByClassName('fa-stethoscope')[0].setAttribute("style", "color:brown;")
        let res = await getAllDoctorByClinicId(this.props.match.params.clinicID)
        if (res && res.errCode === 0) {
            this.setState({
                listDoctor: this.buildDataInputSelect(res.all_doctor_of_clinic)
            })
        }
        let res2 = await getAllMediPackageByClinicId(this.props.match.params.clinicID)
        if (res2 && res2.errCode === 0) {
            this.setState({
                listMediPackage: this.buildDataInputSelect(res2.all_mediPackage_of_clinic)
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

    }

    handleOnChangePackageType = (selectedOption) => {
        // console.log('tinh thanh đang chọn là selectedOption', selectedOption)
        this.setState({ selectedPackageType: selectedOption })
    }

    handleEditDoctor = async (new_doctor) => { // phải truyền cả cục data cần edit vào đây
        if (window.confirm(`Bạn chắc chắn muốn chỉnh sửa thông tin bác sĩ "${this.state.name}" ?`) == true) {
            let res = await editDoctorOfClinic(new_doctor)
            if (res && res.errCode === 0) {
                alert('Chỉnh sửa thông tin thành công')
                window.location.reload(false)
                toast.success('Chỉnh sửa thông tin thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Có thể bác sĩ đã bị xóa ở 1 tab khác')
            }
        }
        console.log('cục data mún sửa', new_doctor)
    }

    handleEditMediPackage = async (new_mediPackage) => { // phải truyền cả cục data cần edit vào đây
        if (window.confirm(`Bạn chắc chắn muốn chỉnh sửa thông tin gói dịch vụ "${this.state.name}" ?`) == true) {
            let res = await editDoctorOfClinic(new_mediPackage)
            if (res && res.errCode === 0) {
                alert('Chỉnh sửa thông tin thành công')
                window.location.reload(false)
                toast.success('Chỉnh sửa thông tin thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Có thể gói dịch vụ đã bị xóa ở 1 tab khác')
            }
        }
        console.log('cục data mún sửa', new_mediPackage)
    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedDoctor]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `id${item.id} __ ${item.name}`
                object.value = item.id
                result.push(object)
            })
        }
        return result
    }

    handleChangeSelect = async (selectedOption) => {
        if (this.state.Doctor_or_MediPackage === true) { // trường hợp sửa Doctor
            if (selectedOption.value === 0) {
                this.setState({
                    selectedDoctor: selectedOption,
                    name: '',
                    imageBase64: '',
                    intro: '',
                    thongtinkham: '',
                    position: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgURL: '',
                    ADD_or_EDIT: true
                })
            } else {
                let res = await getDetailInfoDoctor(selectedOption.value)
                if (res && res.errCode === 0) {
                    this.setState({
                        selectedDoctor: selectedOption,
                        name: res.data.name,
                        imageBase64: res.data.image,
                        intro: res.data.intro,
                        thongtinkham: res.data.thongtinkham,
                        position: res.data.position,
                        descriptionHTML: res.data.descriptionHTML,
                        descriptionMarkdown: res.data.descriptionMarkdown,
                        previewImgURL: res.data.image, // do đã buffer từ backend rồi nên dùng luôn
                        ADD_or_EDIT: false
                    })
                }
            }
        } else { // trường hợp sửa MediPackage
            if (selectedOption.value === 0) {
                this.setState({
                    selectedDoctor: selectedOption,
                    name: '',
                    imageBase64: '',
                    intro: '',
                    thongtinkham: '',
                    selectedPackageType: {},
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    previewImgURL: '',
                    ADD_or_EDIT: true,
                })
            } else {
                let res = await getDetailInfoDoctor(selectedOption.value)
                if (res && res.errCode === 0) {
                    this.setState({
                        selectedDoctor: selectedOption,
                        name: res.data.name,
                        imageBase64: res.data.image,
                        intro: res.data.intro,
                        thongtinkham: res.data.thongtinkham,
                        selectedPackageType: {
                            label: res.data.position,
                            value: res.data.position
                        },
                        descriptionHTML: res.data.descriptionHTML,
                        descriptionMarkdown: res.data.descriptionMarkdown,
                        previewImgURL: res.data.image, // do đã buffer từ backend rồi nên dùng luôn
                        ADD_or_EDIT: false
                    })
                }
            }
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

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text
        })
        // console.log('handleEditorChange', { html, text })
    }

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
    }

    handleChangeDoctorOrMediPackage = () => {
        this.setState({
            Doctor_or_MediPackage: !this.state.Doctor_or_MediPackage,
            name: '',
            position: '',
            imageBase64: '',
            intro: '',
            thongtinkham: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            previewImgURL: '',
            isOpen: false,

            // create or update?
            ADD_or_EDIT: true,

            selectedPackageType: '',
            selectedDoctor: {
                label: '<<< không có Bác sĩ được chọn >>>',
                value: 0
            },
            selectedMediPackage: {
                label: '<<< không có Gói dịch vụ được chọn >>>',
                value: 0
            },
        })
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;//
        this.setState({
            isOpen: true
        })
    }

    render() {
        // console.log('this.props.match.params', this.props.match.params)
        console.log('state hien tai', this.state)
        return (
            <div className=''>
                <div className='col-12 row'>
                    <div className='col-12'><br /></div>
                    <div className='col-3'></div>
                    <div className='col-9'><h1>Chỉnh sửa thông tin bác sĩ & gói dịch vụ</h1></div>
                    <div className='col-12'><hr /></div>
                    <div className='col-3'>
                        <div className='col-12 form-group'>
                            <div className='preview-image'
                                style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                onClick={() => this.openPreviewImage()}>

                            </div>
                            <input
                                className='form-control'
                                type='file'
                                onChange={(event) => this.handleOnChangeImage(event)}
                                id='default_button'
                                hidden
                            />
                            <label className='label-upload' htmlFor='default_button'>Chọn ảnh <i class="fas fa-images"></i></label>
                        </div>
                    </div>
                    <div className='col-9 row'>
                        <div className='col-2 form-group'>
                            <b><i>Chọn đối tượng chỉnh sửa:</i></b>
                        </div>
                        <div className='col-1 form-group'>
                            <h1><i className="fas fa-exchange-alt" onClick={() => this.handleChangeDoctorOrMediPackage()}></i></h1>
                        </div>
                        <div className='col-1 form-group row'>
                            <h1>
                                {this.state.Doctor_or_MediPackage === true ?
                                    <i className="fas fa-user-md"></i>
                                    :
                                    <i className="fas fa-notes-medical"></i>
                                }
                            </h1>
                        </div>
                        <div className='col-8 form-group'>
                            {this.state.Doctor_or_MediPackage === true ?
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctor}
                                />
                                :
                                <Select
                                    value={this.state.selectedMediPackage}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listMediPackage}
                                />
                            }

                        </div>
                        {this.state.Doctor_or_MediPackage === true ?
                            <div className='col-6 form-group'>
                                <label>Họ và tên bác sĩ:</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>
                            :
                            <div className='col-6 form-group'>
                                <label>Tên gói dịch vụ:</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>
                        }
                        {this.state.Doctor_or_MediPackage === true ?
                            <div className='col-6 form-group'>
                                <label>Chức danh:</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'position')}
                                    value={this.state.position}
                                />
                            </div>
                            :
                            <div className='col-6 form-group'>
                                <label>Loại:</label>
                                <Select
                                    value={this.state.selectedPackageType}
                                    onChange={this.handleOnChangePackageType}
                                    options={[{
                                        "label": "Gói khám",
                                        "value": "Gói khám"
                                    },
                                    {
                                        "label": "Xét nghiệm",
                                        "value": "Xét nghiệm"
                                    },
                                    {
                                        "label": "Nội soi",
                                        "value": "Nội soi"
                                    },
                                    {
                                        "label": "Phẫu thuật",
                                        "value": "Phẫu thuật"
                                    },
                                    {
                                        "label": "Chụp chiếu",
                                        "value": "Chụp chiếu"
                                    },
                                    {
                                        "label": "Khác",
                                        "value": "Khác"
                                    }]}
                                />
                            </div>
                        }

                        <div className='col-6 form-group'>
                            <label>Tài khoản đăng nhập:</label>
                            <input
                                className='form-control'
                                type="text"
                                // onChange={(event) => this.handleOnChangeInput(event, 'nickName')}
                                // value={this.state.nickName}
                                disabled
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Mật khẩu:</label>
                            <input
                                className='form-control'
                                type="text"
                                // onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                // value={this.state.password}
                                disabled
                            />
                        </div>
                        <div className='col-12 form-group'>
                            <label>Thông tin khám: </label>
                            <textarea
                                className='form-control'
                                rows='10'
                                onChange={(event) => this.handleOnChangeInput(event, 'thongtinkham')}
                                value={this.state.thongtinkham}
                            ></textarea>
                        </div>
                        <div className='col-12 form-group'>
                            <label>Đoạn giới thiệu ngắn (intro): </label>
                            <textarea
                                className='form-control'
                                rows='4'
                                onChange={(event) => this.handleOnChangeInput(event, 'intro')}
                                value={this.state.intro}
                            ></textarea>
                        </div>
                        <div className='col-12'>
                            {
                                this.state.ADD_or_EDIT === true ?
                                    <button className='button-add-speciatly' style={{ opacity: 0 }}>
                                        Chỗ này sẽ bỏ trống và cho oppaity = 0
                                    </button>
                                    :
                                    <>
                                        {this.state.Doctor_or_MediPackage === true ?
                                            <button
                                                className='btn btn-info'
                                                onClick={() => this.handleEditDoctor({
                                                    idClinic: this.props.match.params.clinicID,
                                                    idDoctor: this.state.selectedDoctor.value,
                                                    name: this.state.name,
                                                    position: this.state.position,
                                                    image: this.state.imageBase64,
                                                    intro: this.state.intro,
                                                    thongtinkham: this.state.thongtinkham,
                                                    descriptionMarkdown: this.state.descriptionMarkdown,
                                                    descriptionHTML: this.state.descriptionHTML
                                                })}
                                            >
                                                Cập nhật thông tin bác sĩ <i className="far fa-edit"></i>
                                            </button>
                                            :
                                            <button
                                                className='btn btn-info'
                                                onClick={() => this.handleEditMediPackage({
                                                    idClinic: this.props.match.params.clinicID,
                                                    idDoctor: this.state.selectedDoctor.value,
                                                    name: this.state.name,
                                                    position: this.state.selectedPackageType.value,
                                                    image: this.state.imageBase64,
                                                    intro: this.state.intro,
                                                    thongtinkham: this.state.thongtinkham,
                                                    descriptionMarkdown: this.state.descriptionMarkdown,
                                                    descriptionHTML: this.state.descriptionHTML
                                                })}
                                            >
                                                Cập nhật thông tin gói dịch vụ <i className="far fa-edit"></i>
                                            </button>}
                                    </>

                            }
                        </div>
                    </div>
                    <div className='col-12'>
                        <label>Xem & chỉnh sửa đoạn giới thiệu đầy đủ:</label>
                        <MdEditor
                            style={{ height: '100vh' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    {
                        this.state.isOpen === true &&
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                </div>


            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(EditDoctor);