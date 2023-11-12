import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
// import './AddMediPackage.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { createDoctor } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';
import logo from '../../../assets/musMedi.png'
import * as actions from "../../../store/actions";


const mdParser = new MarkdownIt()

class AddMediPackage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            intro: '',
            thongtinkham: '',
            descriptionHTML: '',
            descriptionMarkdown: '',


            // ảnh
            previewImgURL: '',
            isOpen: false,

            //63 tinh thanh
            selectedPackageType: ''
        }
    }

    async componentDidMount() {
        document.title = `thêm gói dịch vụ mới | ${this.props.userInfo.name}`
        document.getElementsByClassName('fa-stethoscope')[0].setAttribute("style", "color:brown;")
    }

    handleSaveNewClinic = async () => {
        if (window.confirm(`Bạn chắc chắn muốn thêm Gói dịch vụ "${this.state.name}" vào hệ thống?`) == true) {
            // thêm vào bảng Clinic
            let res = await createDoctor({
                // name: this.state.name,
                // packageType: this.state.selectedPackageType.value,
                // imageBase64: this.state.imageBase64,
                // intro: this.state.intro,
                // thongtinkham: this.state.thongtinkham,
                // descriptionHTML: this.state.descriptionHTML,
                // descriptionMarkdown: this.state.descriptionMarkdown,
                // ///
                // status: 1,
                // clinicID: this.props.userInfo.id,
                // priceDefault: 750,

                name: this.state.name,
                position: this.state.selectedPackageType.value,
                imageBase64: this.state.imageBase64,
                intro: this.state.intro,
                thongtinkham: this.state.thongtinkham,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
                nickName: 'Đồ án còn rất nhiều thiếu sót',
                password: 'Đồ án còn rất nhiều thiếu sót',
                ///
                status: 1,
                clinicID: this.props.userInfo.id,
                priceDefault: 250,
                dr_or_pk: 0
            })
            console.log('res', res)

            if (res && res.errCode === -1) {
                toast.error('Lỗi máy chủ, hoặc do kích thước ảnh lớn hơn giới hạn')
            }
            if (res && res.errCode === 0) {
                alert('Thêm mới Gói dịch vụ thành công')
                window.location = "/system/listDoctor";
                toast.success('Thêm mới Gói dịch vụ thành công')// hàm này không thể chạy vì load lại trang rồi
            }
            if (res && res.errCode === 1) {
                toast.error('Vui lòng điền đầy đủ thông tin')
            }
            if (res && res.errCode === 2) {
                toast.error('Tên đăng nhập này đã tồn tại')
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

    handleOnChangePackageType = (selectedOption) => {
        // console.log('tinh thanh đang chọn là selectedOption', selectedOption)
        this.setState({ selectedPackageType: selectedOption })
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;//
        this.setState({
            isOpen: true
        })
    }

    render() {
        console.log('check state AddMediPackage', this.state)
        return (
            <div className='row'>
                <div className='col-4 logo' >
                    {/* <img src={logo} alt="some_text" /> */}
                </div>
                <div className='col-8'>
                    <div className='col-12 mb-5 text-center'>
                        <br></br>
                        <h1>Thêm Gói dịch vụ mới vào {this.props.userInfo.name}</h1>
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
                        <div className='col-8'>
                            <div className=''><h6>Tên gói dịch vụ: </h6></div>
                            <div className=''>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                    placeholder=''
                                />
                            </div>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-8'>
                            <div className=''><h6>Loại: </h6></div>
                            <div className=''>
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
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12'>
                            <label>Thông tin khám: </label>
                            <textarea
                                className='form-control'
                                rows='10'
                                onChange={(event) => this.handleOnChangeInput(event, 'thongtinkham')}
                                value={this.state.thongtinkham}
                            ></textarea>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12'>
                            <label>Đoạn giới thiệu ngắn (intro): </label>
                            <textarea
                                className='form-control'
                                rows='4'
                                onChange={(event) => this.handleOnChangeInput(event, 'intro')}
                                value={this.state.intro}
                            ></textarea>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12 row'>

                            <div className='col-12'><br></br></div>

                            <div className='col-2'>
                                <br></br>
                                <button className='button-add-speciatly' onClick={() => this.handleSaveNewClinic()}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='col-12'>
                        <label>Viết thông tin giới thiệu Gói dịch vụ ở đây:</label>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddMediPackage);