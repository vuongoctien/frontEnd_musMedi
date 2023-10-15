import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './AddClinic.scss';
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

class AddClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            address: '',
            nickName: '',
            password: '',
            gmail: '',

            // ảnh
            previewImgURL: '',
            isOpen: false,

            //63 tinh thanh
            selectedProvince: {
                "label": "Hà Nội",
                "value": "Hà Nội"
            },
            arr63TinhThanh: [
                {
                    "label": "Hà Nội",
                    "value": "Hà Nội"
                },
                {
                    "label": "Thành phố Hồ Chí Minh",
                    "value": "Thành phố Hồ Chí Minh"
                },
                {
                    "label": "An Giang",
                    "value": "An Giang"
                },
                {
                    "label": "Bà Rịa Vũng Tàu",
                    "value": "Bà Rịa Vũng Tàu"
                },
                {
                    "label": "Bình Dương",
                    "value": "Bình Dương"
                },
                {
                    "label": "Bình Phước",
                    "value": "Bình Phước"
                },
                {
                    "label": "Bình Thuận",
                    "value": "Bình Thuận"
                },
                {
                    "label": "Bình Định",
                    "value": "Bình Định"
                },
                {
                    "label": "Bạc Liêu",
                    "value": "Bạc Liêu"
                },
                {
                    "label": "Bắc Giang",
                    "value": "Bắc Giang"
                },
                {
                    "label": "Bắc Kạn",
                    "value": "Bắc Kạn"
                },
                {
                    "label": "Bắc Ninh",
                    "value": "Bắc Ninh"
                },
                {
                    "label": "Bến Tre",
                    "value": "Bến Tre"
                },
                {
                    "label": "Cao Bằng",
                    "value": "Cao Bằng"
                },
                {
                    "label": "Cà Mau",
                    "value": "Cà Mau"
                },
                {
                    "label": "Cần Thơ",
                    "value": "Cần Thơ"
                },
                {
                    "label": "Điện Biên",
                    "value": "Điện Biên"
                },
                {
                    "label": "Đà Nẵng",
                    "value": "Đà Nẵng"
                },
                {
                    "label": "Đắk Lắk",
                    "value": "Đắk Lắk"
                },
                {
                    "label": "Đắk Nông",
                    "value": "Đắk Nông"
                },
                {
                    "label": "Đồng Nai",
                    "value": "Đồng Nai"
                },
                {
                    "label": "Đồng Tháp",
                    "value": "Đồng Tháp"
                },
                {
                    "label": "Gia Lai",
                    "value": "Gia Lai"
                },
                {
                    "label": "Hà Giang",
                    "value": "Hà Giang"
                },
                {
                    "label": "Hà Nam",
                    "value": "Hà Nam"
                },
                {
                    "label": "Hà Tĩnh",
                    "value": "Hà Tĩnh"
                },
                {
                    "label": "Hòa Bình",
                    "value": "Hòa Bình"
                },
                {
                    "label": "Hưng Yên",
                    "value": "Hưng Yên"
                },
                {
                    "label": "Hải Dương",
                    "value": "Hải Dương"
                },
                {
                    "label": "Hải Phòng",
                    "value": "Hải Phòng"
                },
                {
                    "label": "Hậu Giang",
                    "value": "Hậu Giang"
                },
                {
                    "label": "Khánh Hòa",
                    "value": "Khánh Hòa"
                },
                {
                    "label": "Kiên Giang",
                    "value": "Kiên Giang"
                },
                {
                    "label": "Kon Tum",
                    "value": "Kon Tum"
                },
                {
                    "label": "Lai Châu",
                    "value": "Lai Châu"
                },
                {
                    "label": "Long An",
                    "value": "Long An"
                },
                {
                    "label": "Lào Cai",
                    "value": "Lào Cai"
                },
                {
                    "label": "Lâm Đồng",
                    "value": "Lâm Đồng"
                },
                {
                    "label": "Lạng Sơn",
                    "value": "Lạng Sơn"
                },
                {
                    "label": "Nam Định",
                    "value": "Nam Định"
                },
                {
                    "label": "Nghệ An",
                    "value": "Nghệ An"
                },
                {
                    "label": "Ninh Bình",
                    "value": "Ninh Bình"
                },
                {
                    "label": "Ninh Thuận",
                    "value": "Ninh Thuận"
                },
                {
                    "label": "Phú Thọ",
                    "value": "Phú Thọ"
                },
                {
                    "label": "Phú Yên",
                    "value": "Phú Yên"
                },
                {
                    "label": "Quảng Bình",
                    "value": "Quảng Bình"
                },
                {
                    "label": "Quảng Nam",
                    "value": "Quảng Nam"
                },
                {
                    "label": "Quảng Ngãi",
                    "value": "Quảng Ngãi"
                },
                {
                    "label": "Quảng Ninh",
                    "value": "Quảng Ninh"
                },
                {
                    "label": "Quảng Trị",
                    "value": "Quảng Trị"
                },
                {
                    "label": "Sóc Trăng",
                    "value": "Sóc Trăng"
                },
                {
                    "label": "Sơn La",
                    "value": "Sơn La"
                },
                {
                    "label": "Thanh Hóa",
                    "value": "Thanh Hóa"
                },
                {
                    "label": "Thái Bình ",
                    "value": "Thái Bình "
                },
                {
                    "label": "Thái Nguyên",
                    "value": "Thái Nguyên"
                },
                {
                    "label": "Thừa Thiên Huế",
                    "value": "Thừa Thiên Huế"
                },
                {
                    "label": "Tiền Giang",
                    "value": "Tiền Giang"
                },
                {
                    "label": "Trà Vinh",
                    "value": "Trà Vinh"
                },
                {
                    "label": "Tuyên Quang",
                    "value": "Tuyên Quang"
                },
                {
                    "label": "Tây Ninh",
                    "value": "Tây Ninh"
                },
                {
                    "label": "Vĩnh Long",
                    "value": "Vĩnh Long"
                },
                {
                    "label": "Vĩnh Phúc ",
                    "value": "Vĩnh Phúc "
                },
                {
                    "label": "Yên Bái",
                    "value": "Yên Bái"
                }
            ]
        }
    }

    async componentDidMount() {
        document.title = 'tạo CSYT mới'
    }

    handleSaveNewClinic = async () => {
        if (window.confirm(`Bạn chắc chắn muốn thêm CSYT "${this.state.name}" vào hệ thống?`) == true) {
            // thêm vào bảng Clinic
            let res = await createNewClinic({
                name: this.state.name,
                address: this.state.address,
                imageBase64: this.state.imageBase64,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
                province: this.state.selectedProvince.value,
                nickName: this.state.nickName,
                password: this.state.password
            })
            if (res && res.errCode === 0) {
                alert('Thêm mới CSYT thành công')
                window.location = "/system/manage-clinic_CR";
                toast.success('Thêm mới CSYT thành công')// hàm này không thể chạy vì load lại trang rồi
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
        console.log('check state addclinic', this.state)
        return (
            <div className='row'>
                <div className='col-4 logo' >
                    <img src={logo} alt="some_text" />
                </div>
                <div className='col-8'>
                    <div className='col-12 mb-5 text-center'>
                        <br></br><br></br><br></br>
                        <h1>Thêm CSYT mới vào hệ thống musMedi</h1>
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
                            <div className=''><h6>Địa chỉ (chỉ ghi đến cấp huyện): </h6></div>
                            <div className=''>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    value={this.state.address}
                                />
                            </div>
                        </div>
                        <div className='col-12'><br></br></div>
                        <div className='col-12 row'>
                            <div className='col-5'>
                                <div className=''><h6>Tài khoản </h6></div>
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
                                <div className=''><h6>Mật khẩu </h6></div>
                                <div className=''>
                                    <input
                                        className='form-control'
                                        type="text"
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
                        <label>Viết thông tin giới thiệu CSYT ở đây:</label>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddClinic);