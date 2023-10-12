import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions"
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import './ManageDoctor.scss';
import Select from 'react-select'
import { LANGUAGES } from '../../../utils/constant';
import { CRUD_ACTIONS } from '../../../utils/constant';
import { getDetailInfoDoctor } from '../../../services/userService';


const mdParser = new MarkdownIt()

class ManageDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // save to Markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedOption: '',
            description: '',
            listDoctors: [],
            hasOldData: false,

            // save to doctor_info table
            listPrice: [],
            listProvince: [],
            listPayment: [],
            listClinic: [],
            listSpeciatly: [],

            selectedPrice: '',
            selectedProvince: '',
            selectedPayment: '',
            selectedClinic: '',
            selectedSpeciatly: '',

            addressClinic: '',
            nameClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',

        }
    }

    componentDidMount() {
        this.props.fetchAllClinic()
        this.props.getAllRequiredDoctorInfo()
    }

    buildDataInputSelect = (inputData, type) => {
        let result = []
        let { language } = this.props
        if (inputData && inputData.length > 0) {
            if (type === "USERS") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.lastName} ${item.firstName}`
                    let labelEn = `${item.firstName} ${item.lastName}`
                    object.label = language === LANGUAGES.EN ? labelVi : labelEn //lạ nhỉ // vãiloz ông chưa thêm state language vào
                    object.value = item.id
                    result.push(object)
                })
            }
            if (type === "PRICE") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn} đô la Mẽo`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn //lạ nhỉ // vãiloz ông chưa thêm state language vào
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === "PAYMENT" || type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {}
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn //lạ nhỉ // vãiloz ông chưa thêm state language vào
                    object.value = item.keyMap
                    result.push(object)
                })
            }
            if (type === "SPECIATLY") {
                inputData.map((item, index) => {
                    let object = {}
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
            if (type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {}
                    object.label = item.name
                    object.value = item.id
                    result.push(object)
                })
            }
        }
        return result
    }

    componentDidUpdate(prevProps, prevState, snapshot) {  // à prevProps trức là props trước đó
        if (prevProps.allDoctors !== this.props.allDoctors) { // so sánh 2 prop trước và sau à?
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let { resPayment, resPrice, resProvince, resSpeciatly, resClinic } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT")
            let dataSelectProvince = this.buildDataInputSelect(resProvince, "PROVINCE")
            let dataSelectSpeciatly = this.buildDataInputSelect(resSpeciatly, 'SPECIATLY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')


            // console.log('dataSelectPrice, dataSelectPayment, dataSelectProvince', dataSelectPrice, dataSelectPayment, dataSelectProvince)
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpeciatly: dataSelectSpeciatly,
                listClinic: dataSelectClinic
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE")
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT")
            let dataSelectProvince = this.buildDataInputSelect(resProvince, "PROVINCE")

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
        // console.log('handleEditorChange', { html, text })
    }

    handleSaveContentMarkDown = () => {
        let { hasOldData } = this.state
        this.props.saveDetailDoctor({ // truyền vào saveDetailDoctor cục tham số, cái này ok rồi
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            // lưu thêm cả doctor ìnfo
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpeciatly.value
        })

        console.log('check dâtta', { // truyền vào saveDetailDoctor cục tham số, cái này ok rồi
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedOption.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            // lưu thêm cả doctor ìnfo
            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : 'clinicId fake',
            specialtyId: this.state.selectedSpeciatly.value
        })
    }

    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeText = async (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value
        this.setState({
            ...stateCopy
        })
    }


    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedOption })
        let { listPayment, listPrice, listProvince, listSpeciatly, listClinic } = this.state
        let res = await getDetailInfoDoctor(selectedOption.value)
        // console.log('res', res)
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown
            let addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '',
                selectedPayment = '', selectedPrice = '', selectedProvince = '', selectedSpeciatly = '', selectedClinic = ''

            if (res.data.Doctor_Info) {
                addressClinic = res.data.Doctor_Info.addressClinic
                nameClinic = res.data.Doctor_Info.nameClinic
                note = res.data.Doctor_Info.note
                paymentId = res.data.Doctor_Info.paymentId
                priceId = res.data.Doctor_Info.priceId
                provinceId = res.data.Doctor_Info.provinceId
                specialtyId = res.data.Doctor_Info.specialtyId
                clinicId = res.data.Doctor_Info.clinicId

                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId
                })

                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId
                })

                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId
                })

                selectedSpeciatly = listSpeciatly.find(item => {
                    return item && item.value === specialtyId
                })

                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId
                })
            }

            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: selectedPayment,
                selectedPrice: selectedPrice,
                selectedProvince: selectedProvince,
                selectedSpeciatly: selectedSpeciatly,
                selectedClinic: selectedClinic

                /**Đây chính là chỗ này, khi mình chọn 1 ông bác sĩ thì hàm  handleChangeSelect được kích hoạt (hàm onChange)
                 * sau đó thì state được cập nhật, xong
                 * hmm không biết git có hỗ trợ mình xem lại đoạn này được viết trong commit nào không nhỉ
                */
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedProvince: '',
                selectedPayment: '',
                // selectedClinic: '',
                selectedSpeciatly: '',
                selectedClinic: ''
            })
        }
        // console.log('this.state', this.state)
        // console.log('this.state.contentMarkdown', this.state.contentMarkdown)

    }

    render() {
        let { hasOldData } = this.state
        // console.log("check state #80", this.state)
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id="admin.manage-doctor.title" />
                </div>
                <div className='more-info'>
                    <div className='content-left from-group'>
                        <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                        <Select
                            value={this.state.selectedOption}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholer={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                        <textarea className='form-control' rows='4' onChange={(event) => this.handleOnChangeText(event, 'description')} value={this.state.description}></textarea>
                    </div>
                </div>

                <div className='more-info-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                        <Select options={this.state.listPrice} placeholer={<FormattedMessage id="admin.manage-doctor.price" />}
                            name="selectedPrice" value={this.state.selectedPrice} onChange={this.handleChangeSelectDoctorInfo} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                        <Select options={this.state.listPayment} placeholer={<FormattedMessage id="admin.manage-doctor.payment" />}
                            name="selectedPayment" value={this.state.selectedPayment} onChange={this.handleChangeSelectDoctorInfo} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                        <Select options={this.state.listProvince} placeholer={<FormattedMessage id="admin.manage-doctor.province" />}
                            name="selectedProvince" value={this.state.selectedProvince} onChange={this.handleChangeSelectDoctorInfo} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                        <input className='form-control' value={this.state.nameClinic}
                            onChange={(event) => this.handleOnChangeText(event, 'nameClinic')} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                        <input className='form-control' value={this.state.addressClinic}
                            onChange={(event) => this.handleOnChangeText(event, 'addressClinic')} />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                        <input className='form-control' value={this.state.note}
                            onChange={(event) => this.handleOnChangeText(event, 'note')} />
                    </div>
                </div>

                <div className='row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.speciatly-choose' /></label>
                        <Select
                            value={this.state.selectedSpeciatly}
                            options={this.state.listSpeciatly}
                            placeholer={<FormattedMessage id='admin.manage-doctor.speciatly-choose' />}
                            onChange={this.handleChangeSelectDoctorInfo}
                            name="selectedSpeciatly"
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id='admin.manage-doctor.clinic-choose' /></label>
                        <Select
                            value={this.state.selectedClinic}
                            options={this.state.listClinic}
                            placeholer={<FormattedMessage id='admin.manage-doctor.clinic-choose' />}
                            onChange={this.handleChangeSelectDoctorInfo}
                            name="selectedClinic"
                        />
                    </div>
                </div>

                <div className='manage-doctor-editor'>
                    <MdEditor
                        style={{ height: '300px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button onClick={() => this.handleSaveContentMarkDown()}
                    className={hasOldData === true ? 'create-content-doctor' : 'save-content-doctor'}>
                    {hasOldData === true ? <span><FormattedMessage id="admin.manage-doctor.save" /></span> : <span><FormattedMessage id="admin.manage-doctor.add" /></span>}
                </button>
            </div>

            /** ở video79 có 1 lỗi, mình không sửa được vì chưa biết state nó ở chỗ nào
             * khi chọn 1 bác sĩ, giá chị sẵn có ở mỗi ô input sẽ lấy từ state
             * tuy nhiên state mới chỉ lưu description, contentHTML và contentMarkdown, 3 cái này làm ở những video trước
             * còn đâu những cái mới làm ở video78 và video79 thì chưa được cập nhật vào state
             * không biết là do mình hay do anh kia chưa làm 
             * 
             * hay quá, anh ấy là xử lý ngay trong video 80*/


        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);