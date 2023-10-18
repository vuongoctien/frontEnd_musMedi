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
import * as actions from "../../../store/actions";
import { getDetailInfoDoctor, getAllDoctorByClinicId, editDoctorOfClinic } from '../../../services/userService';


const mdParser = new MarkdownIt()

class EditDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // data
            name: '',
            position: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',


            //select
            selectedSpecialty: {
                label: '<<< không có Bác sĩ được chọn >>>',
                value: 0
            },
            listSpecialty: [],

            // ảnh
            previewImgURL: '',
            isOpen: false,

            // create or update?
            ADD_or_EDIT: true
        }
    }

    async componentDidMount() {
        document.title = 'Chỉnh sửa thông tin Bác sĩ |'
        let res = await getAllDoctorByClinicId(this.props.userInfo.id)
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialty: this.buildDataInputSelect(res.all_doctor_of_clinic)
            })
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

    }

    handleEditSpeciatly = async (new_specialty) => { // phải truyền cả cục data cần edit vào đây
        if (window.confirm(`Bạn chắc chắn muốn chỉnh sửa thông tin bác sĩ "${this.state.name}" ?`) == true) {
            let res = await editDoctorOfClinic(new_specialty)
            if (res && res.errCode === 0) {
                alert('Chỉnh sửa thông tin thành công')
                window.location.reload(false)
                toast.success('Chỉnh sửa thông tin thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Có thể bác sĩ đã bị xóa ở 1 tab khác')
            }
        }
        console.log('cục data mún sửa', new_specialty)
    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedSpecialty]
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
        if (selectedOption.value === 0) {
            this.setState({
                selectedSpecialty: selectedOption,
                name: '',
                imageBase64: '',
                positionL: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
                ADD_or_EDIT: true
            })
        } else {
            let res = await getDetailInfoDoctor(selectedOption.value)
            if (res && res.errCode === 0) {
                this.setState({
                    selectedSpecialty: selectedOption,
                    name: res.data.name,
                    imageBase64: res.data.image,
                    position: res.data.position,
                    descriptionHTML: res.data.descriptionHTML,
                    descriptionMarkdown: res.data.descriptionMarkdown,
                    previewImgURL: res.data.image, // do đã buffer từ backend rồi nên dùng luôn
                    ADD_or_EDIT: false
                })
                console.log('state now', this.state)
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

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;//
        this.setState({
            isOpen: true
        })
    }

    render() {
        // console.log('this.props.userInfo', this.props.userInfo)
        return (
            <div className='col-12 row'>
                <div className='col-12'><br /></div>
                <div className='col-3'></div>
                <div className='col-9'><h1>Chỉnh sửa thông tin bác sĩ</h1></div>
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
                    <div className='col-9 form-group'>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelect}
                            options={this.state.listSpecialty} // 12_10_2023_1. list lựa chọn lấy ở state thôi, không có gì
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Họ và tên bác sĩ:</label>
                        <input
                            className='form-control'
                            type="text"
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                            value={this.state.name}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Chức danh:</label>
                        <input
                            className='form-control'
                            type="text"
                            onChange={(event) => this.handleOnChangeInput(event, 'position')}
                            value={this.state.position}
                        />
                    </div>
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
                    <div className='col-12'>
                        {
                            this.state.ADD_or_EDIT === true ?
                                <button className='button-add-speciatly'>
                                    Chỗ này sẽ bỏ trống và cho oppaity = 0
                                </button>
                                :
                                <>
                                    <button
                                        className='button-edit-speciatly'
                                        onClick={() => this.handleEditSpeciatly({
                                            idClinic: this.props.userInfo.id,
                                            idDoctor: this.state.selectedSpecialty.value,
                                            name: this.state.name,
                                            position: this.state.position,
                                            image: this.state.imageBase64,
                                            descriptionMarkdown: this.state.descriptionMarkdown,
                                            descriptionHTML: this.state.descriptionHTML
                                        })}
                                    >
                                        Lưu thông tin chỉnh sửa
                                    </button>
                                </>

                        }
                    </div>
                </div>
                <div className='col-12'>
                    <label>Xem & chỉnh sửa thông tin giới thiệu bác sĩ ở đây:</label>
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