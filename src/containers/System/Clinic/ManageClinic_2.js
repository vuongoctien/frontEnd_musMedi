import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite'
import './ManageClinic_2.scss';
import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify';
import { template } from 'lodash';
import Select from 'react-select'
import Lightbox from 'react-image-lightbox';
import { getAllClinic, createNewUserService, deleteUserService, editUserService } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';


const mdParser = new MarkdownIt()

class ManageClinic_2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrClinic: [],
        }
    }

    async componentDidMount() {
        document.title = 'danh sách CSYT'
        let response = await getAllClinic()
        if (response && response.errCode === 0) {
            this.setState({
                arrClinic: response.data
            })
        }
    }

    render() {
        let arrClinic = this.state.arrClinic
        arrClinic.reverse() // đảo ngược mảng
        console.log('arrClinic', arrClinic)

        return (
            <div className="clinic-container row mt-5 mx-4">
                <div className='col-6'>
                    <a href='/adLogin/admin/clinicAdd'>
                        <button className='btn btn-primary'>
                            <i className="fas fa-plus"></i>  Thêm CSYT mới
                        </button>
                    </a>
                </div>
                <div className='col-6'>
                    <br></br>
                    <h3>Danh sách CSYT</h3>
                </div>
                <div className='col-12 mt-2'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>id</th>
                                <th></th>
                                <th>Tên </th>
                                <th>Địa chỉ (đến cấp huyện) </th>
                                <th>Tỉnh thành</th>
                                <th>Tên đăng nhập</th>
                                <th></th>
                            </tr>
                            {arrClinic && arrClinic.map((item, index) => {

                                return (
                                    <tr key={index}>
                                        <td><br />{item.id}<br /><br /></td>
                                        <td>
                                            <div className='clinic-image' style={{ backgroundImage: `url(${item.image})` }}></div>
                                            {/* Chỗ này phải giải thích thêm: bên API mình đã Buffer rồi, qua đây không cần nữa, dùng luôn */}
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td>{item.province}</td>
                                        <td>{item.nickName}</td>
                                        <td>
                                            <a href='https://zentlemen.vn/' target="_blank"><i className="fas fa-external-link-alt"></i></a>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='col-12'>
                    <br></br><br></br><br></br><br></br>
                </div>

            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic_2);