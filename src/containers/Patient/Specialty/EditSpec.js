import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { iteratee, template } from 'lodash';
import Select from 'react-select'
import {
    getAllClinic, getAllDoctorByClinicId, getAllMediPackageByClinicId,
    getAllSpecialty, getSpecDr, deleteSpecDr, createSpecDr
} from '../../../services/userService';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


class EditSpec extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rerender: 0,
            selectedClinic: {
                label: '<<< không có CSYT được chọn >>>',
                value: 0
            },
            listClinic: [],
            selectedDoctor: {
                label: '<<< không có Bác sĩ được chọn >>>',
                value: 0
            },
            listDoctor: [],

            allSpecialty: [],
            listSpecYes: [],
            listSpecPick: []
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
        let res2 = await getAllSpecialty()
        if (res2 && res2.errCode === 0) {
            this.setState({
                allSpecialty: res2.data
            })
        }

    }

    buildDataInputSelect = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedClinic]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `${item.id} __ ${item.name}`
                object.value = item.id
                object.name = item.name
                result.push(object)
            })
        }
        return result
    }

    buildDataInputSelect2 = (inputData) => { // 12_10_2023_5. hàm bui này mình chưa xem nhưng nói chung có data nạp vào là được
        let result = [this.state.selectedDoctor]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = `${item.id} __ ${item.name}`
                object.value = item.id
                object.name = item.name
                result.push(object)
            })
        }
        return result
    }


    handleChangeSelect = async (selectedOption) => { // khi chọn 1 chuyên khoa trong select
        this.setState({
            selectedClinic: selectedOption,
            selectedDoctor: {
                label: '<<< không có Bác sĩ được chọn >>>',
                value: 0
            }
        })
        let res1 = await getAllDoctorByClinicId(selectedOption.value)
        let res2 = await getAllMediPackageByClinicId(selectedOption.value)
        if (res1 && res2 && res1.errCode === 0 && res2.errCode === 0) {
            this.setState({
                listDoctor: this.buildDataInputSelect2(res1.all_doctor_of_clinic.concat(res2.all_mediPackage_of_clinic))
            })
        } else {
            this.setState({
                listDoctor: []
            })
        }
        this.setState({ listSpecYes: [] })
    }

    handleChangeSelect2 = async (selectedOption) => { // khi chọn 1 chuyên khoa trong select
        this.setState({ selectedDoctor: selectedOption })
        let res = await getSpecDr({
            specialtyID: '',
            dr_or_pk_ID: selectedOption.value
        })
        this.setState({ listSpecYes: res.data })
    }


    render() {
        console.log('state clinic', this.state)
        return (
            <div className='manage-clinic-container'>
                <div className='add-new-clinic row'>
                    <div className='col-6 row'>
                        <div className='col-12 ms-title'>Chọn chuyên khoa cho bác sĩ / gói dịch vụ</div>
                        <div className='col-12 form-group row'>
                            <div className='col-3'><h6>Chọn cơ sở y tế</h6></div>
                            <div className='col-9'>
                                <
                                    Select
                                    value={this.state.selectedClinic}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listClinic}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-6 row'>
                        <div className='col-12 ms-title'>&nbsp;</div>
                        <div className='col-12 form-group row'>
                            <div className='col-3'><h6>Chọn bác sĩ / gói dịch vụ</h6></div>
                            <div className='col-9'>
                                <
                                    Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect2}
                                    options={this.state.listDoctor}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-12 row'>
                        <div className='col-12 form-group row'>
                            <div className='col-12' style={{
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                <span>Các chuyên khoa: </span>
                                {this.state.listSpecYes.map(item => {
                                    return (<span>{item.specialtyData.name}, </span>)
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <hr />

                {this.state.selectedDoctor.value === 0 ? <></> : <div style={{ padding: '0 80px' }}>
                    <h4>Tạo danh sách chuyên khoa muốn cập nhật cho "{this.state.selectedDoctor.name}":</h4>
                    <div className='col-12 row' style={{ minHeight: '40px', backgroundColor: '#ffecf0', margin: '10px 0' }}>
                        {this.state.listSpecPick && this.state.listSpecPick.map((item, index) => {
                            return (<div className='col-2' style={{ padding: '10px 0' }}>
                                <button type="button" class="btn btn-success" onClick={() => {
                                    this.state.allSpecialty.push(item)
                                    this.state.listSpecPick.splice(index, 1)
                                    this.setState({ rerender: 0 })
                                }}>{item.name}</button>
                            </div>)
                        })}
                    </div>
                    <h4>Nhấn vào tên chuyên khoa để thêm vào danh sách cập nhật:</h4>
                    <div className='col-12 row' style={{ minHeight: '40px', backgroundColor: '#ffecf0', margin: '10px 0' }}>
                        {this.state.allSpecialty && this.state.allSpecialty.map((item, index) => {
                            return (<div className='col-2' style={{ padding: '10px 0' }}>
                                <button type="button" class="btn btn-info" onClick={() => {
                                    this.state.listSpecPick.push(item)
                                    this.state.allSpecialty.splice(index, 1)
                                    this.setState({ rerender: 0 })
                                }}>{item.name}</button>
                            </div>)
                        })}
                    </div>
                    <br />
                    <button type="button" class="btn btn-primary btn-lg" onClick={async () => {
                        let res = await deleteSpecDr(this.state.selectedDoctor.value)
                        if (res && res.errCode === 0) {
                            this.state.listSpecPick.map(async item => {
                                let res = await createSpecDr({
                                    specialtyID: item.id,
                                    dr_or_pk_ID: this.state.selectedDoctor.value
                                })
                                if (res && res.errCode === 0) {
                                    toast.success(`Thành công`)
                                }
                            })
                        }
                    }}>Lưu thay đổi</button>
                </div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditSpec);