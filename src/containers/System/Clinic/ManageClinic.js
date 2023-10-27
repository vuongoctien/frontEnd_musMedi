import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ManageClinic.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import { getAllClinic, getAllDetailClinicById, editClinic, deleteClinic } from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const mdParser = new MarkdownIt()

class ManageClinic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // data
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            address: '',
            province: '',
            nickName: '',

            // ảnh
            previewImgURL: '',
            isOpen: false,

            // create or update?
            ADD_or_EDIT: true,

            //select
            selectedClinic: {
                label: '<<< không có CSYT được chọn >>>',
                value: 0
            },
            listClinic: [],
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
        document.title = 'sửa & xóa CSYT'
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                listClinic: this.buildDataInputSelect(res.data)
            })
        }


    }

    async componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó

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


    handleChangeSelect = async (selectedOption) => { // khi chọn 1 chuyên khoa trong select
        if (selectedOption.value === 0) {
            this.setState({
                selectedClinic: selectedOption,
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                ADD_or_EDIT: true,
                selectedProvince: '',
            })
        } else {
            let res = await getAllDetailClinicById(selectedOption.value) ////////////////api
            if (res && res.errCode === 0) {
                this.setState({
                    selectedClinic: selectedOption,
                    name: res.data.name,
                    address: res.data.address,
                    imageBase64: new Buffer(res.data.image, 'base64').toString('binary'),
                    descriptionHTML: res.data.descriptionHTML,
                    descriptionMarkdown: res.data.descriptionMarkdown,
                    previewImgURL: new Buffer(res.data.image, 'base64').toString('binary'),
                    ADD_or_EDIT: false,
                    selectedProvince: {
                        label: res.data.province,
                        value: res.data.province
                    }

                })
            }
        }
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

    handleEditSpeciatly = async (new_specialty) => { // phải truyền cả cục data cần edit vào đây
        if (window.confirm(`Bạn chắc chắn muốn chỉnh sửa thông tin CSYT "${this.state.name}" ?`) == true) {
            let res = await editClinic(new_specialty) /////////////api
            if (res && res.errCode === 0) {
                alert('Chỉnh sửa thông tin thành công')
                window.location.reload(false)
                toast.success('Chỉnh sửa thông tin thành công')// hàm này không thể chạy vì load lại trang rồi
            } else {
                toast.error('Lỗi! Có thể CSYT đã bị xóa ở 1 tab khác')
            }
        }

    }

    handleDeleteSpeciatly = async (idClinicDelete) => {
        // if (window.confirm(`Hành động này sẽ xóa hoàn toàn CSYT "${this.state.name}" khỏi hệ thống.
        // Ngoài ra, nếu xóa một CSTY thì thông tin về những Bác sĩ, Gói dịch vụ của CSYT này vẫn lưu trong Cơ sở dữ liệu.
        // Bạn hãy cân nhắc việc tạm ngưng hoạt động của CSYT này thay vì xóa vĩnh viễn.
        // Bạn vẫn muốn xóa CSYT "${this.state.name}" chứ?`) == true) {
        //     if (window.confirm(`Bạn chắc chắn muốn xóa CSYT "${this.state.name}" khỏi hệ thống?`) == true) {
        //         let res = await deleteClinic(idClinicDelete) ////////////api
        //         if (res && res.errCode === 0) {
        //             alert('Xóa thành công')
        //             window.location.reload(false)
        //             toast.success('Xóa thành công') // hàm này không thể chạy vì load lại trang rồi
        //         } else {
        //             toast.error('Lỗi! Có thể CSYT đã bị xóa ở 1 tab khác')
        //         }
        //     }
        // }
        alert('Giờ chưa xóa được, mình chưa ràng buộc những dữ liệu liên quan, xóa là lằng nhằng lắm. Thích xóa thì check ràng buộc cho kỹ, rồi tự vào DB mà xóa')
    }


    render() {
        console.log('state clinic', this.state)
        return (
            <div className='manage-clinic-container'>
                <div className='add-new-clinic row'>
                    <div className='col-9 row'>
                        <div className='col-12 ms-title'>Xem & chỉnh sửa thông tin CSYT</div>
                        <div className='col-12 form-group row'>
                            <div className='col-2'><h6>Chọn cơ sở y tế</h6></div>
                            <div className='col-10'>
                                <
                                    Select
                                    value={this.state.selectedClinic}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listClinic}
                                />
                            </div>
                        </div>
                        <div className='col-12 form-group row'>
                            <div className='col-2'><h6>Tên cơ sở y tế: </h6></div>
                            <div className='col-10'>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'name')}
                                    value={this.state.name}
                                />
                            </div>
                        </div>
                        <div className='col-12 form-group row'>
                            <div className='col-2'><h6>Địa chỉ (chỉ ghi đến cấp huyện): </h6></div>
                            <div className='col-10'>
                                <input
                                    className='form-control'
                                    type="text"
                                    onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    value={this.state.address}
                                />
                            </div>
                        </div>
                        <div className='col-12 form-group row'>
                            <div className='col-2'><h6>Tỉnh thành</h6></div>
                            <div className='col-4'>
                                <
                                    Select
                                    options={this.state.arr63TinhThanh}
                                    value={this.state.selectedProvince}
                                    onChange={this.handleOnChangeProvince}
                                />
                            </div>
                        </div>
                        <div className='col-12 form-group row'><br></br></div>

                    </div>
                    <div className='col-3'>
                        <div className='col-12'><br></br></div>
                        <div className='col-12'><br></br></div>
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
                        <div className='col-12'><br></br></div>
                        <div className='col-12'>
                            {
                                this.state.ADD_or_EDIT === true ?
                                    <>
                                        <button className='disabled-edit-clinic' disabled >Lưu thông tin  chỉnh sửa</button>
                                        <button className='disabled-delete-clinic' disabled >Xóa CSYT</button>
                                    </>
                                    :
                                    <>
                                        <button
                                            className='button-edit-clinic'
                                            onClick={() => this.handleEditSpeciatly({
                                                id: this.state.selectedClinic.value,
                                                name: this.state.name,
                                                image: this.state.imageBase64,
                                                descriptionMarkdown: this.state.descriptionMarkdown,
                                                descriptionHTML: this.state.descriptionHTML,
                                                province: this.state.selectedProvince.label,
                                                address: this.state.address
                                            })}
                                        >
                                            Lưu thông tin  chỉnh sửa
                                        </button>
                                        <button className='button-delete-clinic' onClick={() => this.handleDeleteSpeciatly(this.state.selectedClinic.value, this.state.name)}>
                                            Xóa CSYT
                                        </button>
                                    </>

                            }
                        </div>
                    </div>
                    <div className='col-12'>
                        <label>Xem & chỉnh sửa thông tin giới thiệu CSYT ở đây:</label>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);