import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import './SoLuongDaDat.scss'
import { xemSoLuongDaDat } from '../../../../services/userService';


/** Không cần lằng nhằng gì cả, khai báo 1 câu là được
 * thằng con SoLuongDaDat cứ tự nhiên sử dụng dữ liệu từ cha ListDoctor truyền xuống 
 * Còn mấy cái lằng nhằng, nào mapDispath nào adminAction nào actionType gì gì đó, nó là Redux
*/

class SoLuongDaDat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            list: []
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate() {
        let res = await xemSoLuongDaDat({
            dr_or_pk_ID: this.props.dr_or_pk_ID,
            date: this.props.date,
        })
        if (res && res.errCode === 0) this.state.data = res.data
        let uniqueSet = new Set(this.state.data.map(item => item = item.clockTime))
        this.state.list = [...uniqueSet]
        this.state.list = this.state.list.sort()
        console.log(this.state.data)
        /**
         * Có một điều đáng lưu ý, nếu mình console.log ở đây thì ok dữ liệu hiện chuẩn
         * Nhưng nếu log ở chỗ render thì dữ liệu không khớp
         * Rất may, khi mình bấm mở modal, dữ liệu sẽ chính xác
         * Không biết componentDidUpdate và render khác gì nhau
         * Nhưng điều đó không còn quan trọng nữa
         * Làm thêm vài chức năng nữa mình sẽ dừng lại, nửa năm trời hì hục, kể cũng hoài niệm
         * Nửa năm nay đầu tắt mặt tối với chuyên đề ...
         */
    }



    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}// dòng này không bỏ được đâu, đừng nghịch dại
                size='sm'
                centered
                className='soluongdat'
            >
                <div style={{ padding: '5px 10px' }}>
                    <div>
                        <span><i style={{ color: 'lightblue', border: '1px solid black' }} className="fas fa-square-full"></i>
                            : Số bệnh nhân đang chờ duyệt</span>
                        <br />
                        <span><i style={{ color: 'lightgreen', border: '1px solid black' }} className="fas fa-square-full"></i>
                            : Số bệnh nhân đã được nhận khám</span>
                    </div>
                    <div className='text-center'>
                        <br />
                        {this.state.list.length === 0 ? <p>Chưa có bệnh nhân nào đặt khám trong ngày này</p> : <></>}
                        <table>
                            {this.state.list.map(clockTime => {
                                return (<tr>
                                    <td>{clockTime}</td>
                                    <td style={{ backgroundColor: 'lightblue' }}>
                                        {this.state.data.filter(item => item.clockTime === clockTime && (item.status === 'Chưa xem' || item.status === 'Chờ duyệt')).length}
                                    </td>
                                    <td style={{ backgroundColor: 'lightgreen' }}>
                                        {this.state.data.filter(item => item.clockTime === clockTime && item.status === 'Chấp nhận').length}
                                    </td>
                                </tr>)
                            })}
                        </table>
                        <br />
                        {this.state.list.length === 0 ? <></> : <p>Quý khách dựa trên số lượng đã đặt để chọn lịch khám phù hợp nhất</p>}
                        <br />
                        <button type="button" class="btn btn-danger" onClick={this.props.closeModal}>Đóng</button>
                    </div>

                </div>
            </Modal >
        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SoLuongDaDat);