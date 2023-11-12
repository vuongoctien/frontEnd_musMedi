import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ManageSpecialty.scss';
import { CommonUtils } from '../../../utils'
import { createNewSpeciatly } from '../../../services/userService';
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import { getAllSpecialty, getDetailSpecialtyById, editSpecialty, deleteSpecialty } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const mdParser = new MarkdownIt()

class ManageSpecialty extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // data
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',

            //select
            selectedSpecialty: {
                label: '<<< không có Chuyên khoa được chọn >>>',
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
        document.title = 'quản lý Chuyên khoa'
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({
                listSpecialty: this.buildDataInputSelect(res.data)
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedSpecialty]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `${item.id} __ ${item.name}`
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
                descriptionHTML: '',
                descriptionMarkdown: '',
                ADD_or_EDIT: true,
                previewImgURL: '',
            })
        } else {
            let res = await getDetailSpecialtyById(selectedOption.value)
            if (res && res.errCode === 0) {
                this.setState({
                    selectedSpecialty: selectedOption,
                    name: res.data.name,
                    imageBase64: new Buffer(res.data.image, 'base64').toString('binary'),
                    descriptionHTML: res.data.descriptionHTML,
                    descriptionMarkdown: res.data.descriptionMarkdown,
    /********** */                previewImgURL: new Buffer(res.data.image, 'base64').toString('binary'),
                    ADD_or_EDIT: false
                })
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

    handleSaveNewSpeciatly = async () => {
        if (window.confirm(`Bạn chắc chắn muốn thêm chuyên khoa "${this.state.name}" vào hệ thống?`) == true) {
            let res = await createNewSpeciatly(this.state)
            if (res && res.errCode === 0) {
                alert('Thêm mới chuyên khoa thành công')
                window.location.reload(false)
                toast.success('Thêm mới chuyên khoa thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Vui lòng kiểm tra lại thông tin')
            }
        }
    }

    handleEditSpeciatly = async (new_specialty) => { // phải truyền cả cục data cần edit vào đây
        if (window.confirm(`Bạn chắc chắn muốn chỉnh sửa thông tin chuyên khoa "${this.state.name}" ?`) == true) {
            let res = await editSpecialty(new_specialty)
            if (res && res.errCode === 0) {
                alert('Chỉnh sửa thông tin thành công')
                window.location.reload(false)
                toast.success('Chỉnh sửa thông tin thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi!')
            }
        }

    }

    handleDeleteSpeciatly = async (idSpecialtyDelete) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa chuyên khoa "${this.state.name}" khỏi hệ thống?`) == true) {
            let res = await deleteSpecialty(idSpecialtyDelete)
            if (res && res.errCode === 0) {
                alert('Xóa thành công')
                window.location.reload(false)
                toast.success('Xóa thành công') // hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Có thể chuyên khoa đã bị xóa ở 1 tab khác')
            }
        }
    }


    render() {
        console.log('state speciatly', this.state)
        return (
            <div className='manage-speciatly-container'>
                <div className='add-new-speciatly row'>
                    <div className='col-6'>
                        <div className='col-12 ms-title'>Tạo mới & chỉnh sửa chuyên khoa</div>
                        <div className='col-12 form-group row'>
                            <div className='col-3 form-group'>
                                <h5>Chọn <br></br>chuyên khoa</h5>
                            </div>
                            <div className='col-9 form-group'>
                                <Select
                                    value={this.state.selectedSpecialty}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listSpecialty} // 12_10_2023_1. list lựa chọn lấy ở state thôi, không có gì
                                />
                            </div>
                        </div>
                        <div className='col-12 form-group row'>
                            <div className='col-3 form-group'>
                                <h5>Tên <br></br>chuyên khoa: </h5>
                            </div>
                            <div className='col-9 form-group'>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>

                        </div>
                    </div>
                    <div className='col-3'>
                        <div className='col-12 form-group'></div>
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
                    <div className='col-3'>
                        <div className='col-12'>
                            {
                                this.state.ADD_or_EDIT === true ?
                                    <button className='button-add-speciatly' onClick={() => this.handleSaveNewSpeciatly()}>
                                        Lưu chuyên khoa mới
                                    </button>
                                    :
                                    <>
                                        <button
                                            className='button-edit-speciatly'
                                            onClick={() => this.handleEditSpeciatly({
                                                id: this.state.selectedSpecialty.value,
                                                name: this.state.name,
                                                image: this.state.imageBase64,
                                                descriptionMarkdown: this.state.descriptionMarkdown,
                                                descriptionHTML: this.state.descriptionHTML
                                            })}
                                        >
                                            Lưu thông tin chỉnh sửa
                                        </button>
                                        <button className='button-delete-speciatly' onClick={() => this.handleDeleteSpeciatly(this.state.selectedSpecialty.value, this.state.name)}>
                                            Xóa chuyên khoa
                                        </button>
                                    </>

                            }
                        </div>
                    </div>





                    <div className='col-12'>
                        <label>Xem & chỉnh sửa thông tin giới thiệu chuyên khoa ở đây:</label>
                        <MdEditor
                            style={{ height: '100vh' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);