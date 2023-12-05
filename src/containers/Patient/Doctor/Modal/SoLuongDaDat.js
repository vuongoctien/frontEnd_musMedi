import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';


/** Không cần lằng nhằng gì cả, khai báo 1 câu là được
 * thằng con SoLuongDaDat cứ tự nhiên sử dụng dữ liệu từ cha ListDoctor truyền xuống 
 * Còn mấy cái lằng nhằng, nào mapDispath nào adminAction nào actionType gì gì đó, nó là Redux
*/

class SoLuongDaDat extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) { }

    render() {

        return (
            <Modal
                isOpen={this.props.isOpen}// dòng này không bỏ được đâu, đừng nghịch dại
                size='sm'
                centered
            >
                <div style={{ padding: '5px 10px' }}>
                    <div className='text-center'>
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