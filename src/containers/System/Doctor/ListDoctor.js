//
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ListDoctor.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import { getAllDoctorByClinicId } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';
import logo from '../../../assets/musMedi.png'
import * as actions from "../../../store/actions";


const mdParser = new MarkdownIt()

class ListDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctor: []
        }
    }

    async componentDidMount() {
        document.title = `danh sách bác sĩ | ${this.props.userInfo.name}`
        let res = await getAllDoctorByClinicId(this.props.userInfo.id)
        this.setState({ arrDoctor: res.all_doctor_of_clinic })
    }



    render() {
        console.log('state listDoctor', this.state.arrDoctor)
        return (
            <div className='row'>
                <div className='col-12 text-center'><h1>Danh sách bác sĩ</h1></div>
                <div className='col-12'><hr /></div>
                <div className='col-1'></div>
                <div className='col-8'><h2>Bác sĩ</h2></div>
                <div className='col-3'><a href='/system/addDoctor'><button type="button" class="btn btn-outline-success"><i className="fas fa-plus"></i> Thêm bác sĩ mới</button></a></div>
                <div className='col-1'></div>
                <div className="col-10 row list-doctor">
                    {this.state.arrDoctor && this.state.arrDoctor.map((item, index) => {
                        return (
                            <div className='col-4 child-doctor' >
                                <div className="row">
                                    <div className='col-3 doctor-image' style={{ backgroundImage: `url(${new Buffer(item.image, 'base64').toString('binary')})` }}></div>
                                    <div className='col-9'>
                                        <h6 style={{ fontStyle: 'italic', opacity: '0.8' }}>-- {item.position}</h6>
                                        <br />
                                        <h5 style={{ fontWeight: '500' }}>{item.name}</h5>
                                        <div className="d-flex w-100 justify-content-between">
                                            <h5 className="mb-1"></h5>
                                            <small><h1><button title='Bấm để xem chi tiết' type="button" className="btn btn-link"
                                                onClick={() => { alert('ok') }}><i className="fas fa-info-circle"></i>
                                            </button></h1></small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}



                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ListDoctor);