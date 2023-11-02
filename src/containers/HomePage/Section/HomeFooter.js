import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';



class HomeFooter extends Component {

    render() {


        return (
            <div className='home-footer'>
                <div className='row'>
                    <div className='col-1'>

                    </div>
                    <div className='col-4'>
                        <div className='musMedi'></div>
                        <div className='b'><b>Công ty cổ phần công nghệ musMedi</b></div>
                        <h6>
                            <i className="fas fa-map-marker-alt"></i>
                            Lô B4/D21, Khu đô thị mới Cầu Giấy,
                            Phường Dịch Vọng Hậu, Quận Cầu Giấy,
                            Thành phố Hà Nội, Việt Nam
                        </h6>
                        <h6>
                            <i className="fas fa-check-circle"></i>
                            ĐKKD số: 0106790291. Sở KHĐT Hà Nội cấp ngày 16/03/2015
                        </h6>
                        <div className='bocongthuong'></div>
                        <div className='noname'>
                            <b>Văn phòng tại TP Hồ Chí Minh</b>
                            <p>Số 01, Hồ Bá Kiện, Phường 15, Quận 10</p>
                        </div>
                        <div className='noname'>
                            <b>Hỗ trợ khách hàng</b>
                            <p>support@bookingcare.vn (7h30 - 18h)</p>
                        </div>
                        <div className='noname'>
                            <b>Hotline</b>
                            <p>024-7301-2468 (7h30 - 18h)</p>
                        </div>

                    </div>
                    <div className='col-3' style={{ paddingTop: '30px' }}>
                        <div className='a'><a href='bookingcare.com'>    Liên hệ hợp tác</a></div>
                        <div className='a'><a href='bookingcare.com'>    Danh bạ y tế</a></div>
                        <div className='a'><a href='bookingcare.com'>  Sức khỏe doanh nghiệp</a></div>
                        <div className='a'><a href='bookingcare.com'>  Gói chuyển đổi số doanh nghiệp</a></div>
                        <div className='a'><a href='bookingcare.com'>  Tuyển dụng</a></div>
                        <div className='a'><a href='bookingcare.com'>  Câu hỏi thường gặp</a></div>
                        <div className='a'><a href='bookingcare.com'>  Điều khoản sử dụng</a></div>
                        <div className='a'><a href='bookingcare.com'>  Chính sách Bảo mật</a></div>
                        <div className='a'><a href='bookingcare.com'>  Quy trình hỗ trợ giải quyết khiếu nại</a></div>
                        <div className='a'><a href='bookingcare.com'>  Quy chế hoạt động</a></div>
                    </div>
                    <div className='col-3'>
                        <br /><br /><b>Đối tác bảo trợ nội dung</b>
                        <div className='doitacbaotronoidung'></div>
                    </div>
                </div>
                <div className='copyright'>&copy; 2024 VuongNgocTien. More infomation, please visit my youtube channel <a target='_blank' href='https://www.youtube.com/'>  &#8594; Click here &#8592; </a></div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
