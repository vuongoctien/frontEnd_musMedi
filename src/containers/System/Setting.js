import React, { Component } from 'react';
import { connect } from 'react-redux';

class Setting extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        document.getElementsByClassName('fa-cog')[0].setAttribute("style", "color:brown;")
    }


    render() {
        return (
            <>Đây là setting</>
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

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
