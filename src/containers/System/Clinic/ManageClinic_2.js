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
import 'react-image-lightbox/style.css';
import { getAllClinic, editClinic } from '../../../services/userService'
import { reject } from 'lodash';
import { emitter } from '../../../utils/emitter';


const mdParser = new MarkdownIt()

class ManageClinic_2 extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrClinic: [],
            render: 0
        }
    }

    async componentDidMount() {
        document.title = 'danh sách CSYT'
        let response = await getAllClinic()
        if (response && response.errCode === 0) {
            this.setState({
                arrClinic: response.data.reverse() //đảo ngược mảng
            })
        }
    }

    render() {
        let arrClinic = this.state.arrClinic
        console.log('arrClinic', arrClinic)

        return (
            <div className="manageclinic2">
                <div className='text-center'>
                    <h3>Danh sách CSYT</h3>
                </div>
                <div style={{ padding: '0 170px' }}>
                    <table>
                        <tbody>
                            <tr>
                                <th>id</th>
                                <th></th>
                                <th>Tên </th>
                                <th>Tỉnh thành</th>
                                <th>Tên đăng nhập</th>
                                <th style={{ textAlign: 'center' }}>Trạng thái</th>
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
                                        <td>{item.province}</td>
                                        <td>{item.nickName}</td>
                                        <td id='status-clinic' style={{ textAlign: 'center' }}>
                                            {item.status === 1 ?
                                                <button className='btn btn-outline-success btn-lg' onClick={async () => {
                                                    if (window.confirm(`Hành động này sẽ ẩn '${item.name}' khỏi hệ thống. Bạn chắc chắn với lựa chọn của mình chứ?`) == true) {
                                                        item.status = 0
                                                        let res = await editClinic(item)
                                                        if (res && res.errCode === 0) {
                                                            // alert('Cập nhật trạng thái thành công')
                                                            this.setState({ render: 0 }) // để render lại thôi

                                                        } else {
                                                            toast.error('Lỗi!')
                                                        }
                                                    }
                                                }}><i class="fas fa-check"></i></button>
                                                :
                                                <button className='btn btn-outline-danger btn-lg' onClick={async () => {
                                                    if (window.confirm(`Hành động này sẽ hiện '${item.name}' trở lại hệ thống. Bạn chắc chắn với lựa chọn của mình chứ?`) == true) {
                                                        item.status = 1
                                                        let res = await editClinic(item)
                                                        if (res && res.errCode === 0) {
                                                            // alert('Cập nhật trạng thái thành công')
                                                            this.setState({ render: 0 }) // để render lại thôi
                                                        } else {
                                                            toast.error('Lỗi!')
                                                        }
                                                    }
                                                }}><i class="fas fa-times"></i></button>
                                            }
                                        </td>
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