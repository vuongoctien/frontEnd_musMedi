import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SearchClinic.scss'
import HomeHeader from '../HomePage/HomeHeader';
import HomeFooter from '../HomePage/Section/HomeFooter'
import Select from 'react-select'
import { getAllClinic } from '../../services/userService';
import _ from 'lodash';
import { bodau } from './bodauTiengViet';

class SearchClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 3 cái hơi cồng kềnh nhưng clinic thì cứ tạm thế
            allClinic: [],
            filterClinic: [],
            showClinic: [],

            provinces: [],
            selectedProvince: {
                "label": ">> không có tỉnh thành được chọn <<",
                "value": 0
            },
        }
    }

    async componentDidMount() {
        document.title = 'Cơ sở y tế'
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                allClinic: res.data ? res.data : [],
                filterClinic: res.data ? res.data : [],
                showClinic: res.data ? res.data : []
            })
            let uniqueSet = new Set(this.state.allClinic.map(clinic => clinic.province))
            this.setState({ provinces: [...uniqueSet] })
        }
    }

    buildDataInputSelect = (inputData) => { // nạp mảng ['HN','TPHCM','',...] vào
        let result = [{
            "label": ">> không có tỉnh thành được chọn <<",
            "value": 0
        }]
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {}
                object.label = item
                object.value = item
                result.push(object)
            })
        }
        return result
    }

    handleOnChangeProvince = async (selectedOption) => {
        this.setState({ selectedProvince: selectedOption })
        if (selectedOption.value === 0) {
            this.setState({
                filterClinic: this.state.allClinic,
                showClinic: this.state.allClinic
            })
        } else {
            this.setState({
                filterClinic: this.state.allClinic.filter(item => item.province === selectedOption.value),
                showClinic: this.state.allClinic.filter(item => item.province === selectedOption.value)
            })
        }
        document.getElementById('stringsearch').value = ''
        document.getElementById('search').setAttribute('class', 'animation')
        setTimeout(() => { document.getElementById('search').setAttribute('class', '') }, 100)
    }

    handleOnChangeInput = (event) => {
        if (event.target.value === '') {
            this.setState({ showClinic: this.state.filterClinic })
        } else {
            this.setState({
                showClinic: _.filter(this.state.filterClinic, (item) => {
                    return _.includes(bodau(item.name).toLowerCase(), bodau(event.target.value).toLowerCase())
                })
            })
        }
    }

    render() {
        // console.log('state', this.state)
        return (
            <div className='searchclinic-container'>
                <HomeHeader />
                <div className='searchclinic-content'>
                    <div className='row '>
                        <div className='col-3'><h2>Cơ sở y tế</h2></div>
                        <div className='col-2'></div>
                        <div className='col-4'>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleOnChangeProvince}
                                options={this.buildDataInputSelect(this.state.provinces)}
                            />
                        </div>
                        <div className='col-3'>
                            <div>
                                <div id="search"><input id='stringsearch' type="text" placeholder="Tìm kiếm"
                                    onChange={(event) => { this.handleOnChangeInput(event) }}
                                /><i class="fas fa-search"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: '10px', minHeight: '100vh' }}>
                        {this.state.showClinic.map(clinic => {
                            return (<div className='col-3 clinic'>
                                <div className='clinic-avatar'
                                    style={{ backgroundImage: `url(${clinic.image})` }}></div>
                                <div className='clinic-name'>
                                    <a href={`../detail-clinic/${clinic.id}`}>{clinic.name}</a>
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
