import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
// import './AddDoctor.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import { createNewClinic } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';
import logo from '../../../assets/musMedi.png'


const mdParser = new MarkdownIt()

class AddDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            position: '',
            nickName: '',
            password: '',
            gmail: '',

            // ảnh
            previewImgURL: '',
            isOpen: false,

            //63 tinh thanh

        }
    }

    async componentDidMount() {
        document.title = 'thêm Bác sĩ mới'
    }

    handleSaveNewClinic = async () => {
        if (window.confirm(`Bạn chắc chắn muốn thêm Bác sĩ "${this.state.name}" vào hệ thống?`) == true) {
            // thêm vào bảng Clinic
            let res = await createNewClinic({
                name: this.state.name,
                position: this.state.position,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
                province: this.state.selectedProvince.value,
                nickName: this.state.nickName,
                password: this.state.password
            })
            if (res && res.errCode === 0) {
                alert('Thêm mới Bác sĩ thành công')
                // window.location = "/adLogin/admin/clinicRead";
                window.location.reload()
                toast.success('Thêm mới Bác sĩ thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Vui lòng kiểm tra lại thông tin')
            }

            //thêm tài khoản vào bảng Account

        }
    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedClinic]
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

    handleOnChangeProvince = (selectedOption) => {
        console.log('tinh thanh đang chọn là selectedOption', selectedOption)
        this.setState({ selectedProvince: selectedOption })
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
        console.log('check state AddDoctor', this.state)
        return (
            <div className='row'>
                <div className='col-4 logo' >
                    {/* <img src={logo} alt="some_text" /> */}
                </div>
                <div className='col-8'>
                    <div className='col-12 mb-5 text-center'>
                        {/* <br></br><br></br><br></br> */}
                        <h1>Thêm Bác sĩ mới vào hệ thống musMedi</h1>
                    </div>
                </div>
                <div className='col-12 mx-3 row'>
                    <div className='col-3'>
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
                    <div className='col-9'>
                        <div className='col-12'>
                            <div className=''><h6>Tên cơ sở y tế: </h6></div>
                            <div className=''>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12'>
                            <div className=''><h6>Chức danh: </h6></div>
                            <div className=''>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'position')}
                                    value={this.state.position}
                                />
                            </div>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12 row'>
                            <div className='col-5'>
                                <div className=''><h6>Tạo tên đăng nhập: </h6></div>
                                <div className=''>
                                    <input
                                        className='form-control'
                                        type="text"
                                        onChange={(event) => this.handleOnChangeInput(event, 'nickName')}
                                        value={this.state.nickName}
                                    />
                                </div>
                            </div>
                            <div className='col-5'>
                                <div className=''><h6>Tạo mật khẩu đăng nhập: </h6></div>
                                <div className=''>
                                    <input
                                        className='form-control'
                                        type="password"
                                        onChange={(event) => this.handleOnChangeInput(event, 'password')}
                                        value={this.state.password}
                                    />
                                </div>
                            </div>
                            <div className='col-12'><br></br></div>
                            <div className='col-5'>
                                <div className=''><h6>Tỉnh thành</h6></div>
                                <div className=''>
                                    <
                                        Select
                                        options={this.state.arr63TinhThanh}
                                        value={this.state.selectedProvince}
                                        onChange={this.handleOnChangeProvince}
                                    />
                                </div>
                            </div>
                            <div className='col-5'>
                                <div className=''><h6>Gmail liên lạc </h6></div>
                                <div className=''>
                                    <input
                                        className='form-control'
                                        type="text"
                                        onChange={(event) => this.handleOnChangeInput(event, 'gmail')}
                                        value={this.state.gmail}
                                    />
                                </div>
                            </div>
                            <div className='col-2'>
                                <br></br>
                                <button className='button-add-speciatly' onClick={() => this.handleSaveNewClinic()}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='col-12'>
                        <label>Viết thông tin giới thiệu Bác sĩ ở đây:</label>
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
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(AddDoctor);