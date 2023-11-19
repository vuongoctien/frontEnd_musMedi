import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SearchClinic.scss'
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/Section/HomeFooter'
import Select from 'react-select'
import { getAllSpecialty } from '../../services/userService';
import _ from 'lodash';
import { bodau } from './bodauTiengViet';

class SearchClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listchuyenkhoa: []
        }
    }

    async componentDidMount() {
        document.title = 'Danh sách chuyên khoa'
        let res = await getAllSpecialty()
        if (res && res.errCode === 0) {
            this.setState({ listchuyenkhoa: res.data })
        }
        console.log(this.state.listchuyenkhoa)
    }






    render() {

        return (
            <div className='searchclinic-container'>
                <HomeHeader />
                <div style={{ minHeight: '100vh', padding: '0 80px' }}>
                    <h6>&nbsp;</h6>
                    <h1>Chọn chuyên khoa</h1>
                    <h6>&nbsp;</h6>
                    <div className='row'>
                        {this.state.listchuyenkhoa.map(spec => {
                            // background-repeat  : no-repeat;
                            // background-size    : contain;
                            // background-position: center;
                            return (<div className='col-6' style={{ display: 'flex', margin: '30px 0' }}>
                                <div style={{
                                    height: '100px',
                                    width: '170px',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${spec.image})`
                                }}></div>
                                <div style={{ padding: '10px 30px' }}>
                                    <a href={`/detail-speciatly/${spec.id}`}>
                                        <h2>{spec.name}</h2>
                                    </a>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchClinic)
