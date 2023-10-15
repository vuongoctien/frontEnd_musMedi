import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux'
import Header from '../containers/Header/Header';
import ManageDoctor from '../containers/System/Admin/ManageDoctor'
import ManageSpecialty from '../containers/Patient/Specialty/ManageSpecialty';
import ManageClinic from '../containers/System/Clinic/ManageClinic';
import ManageClinic_2 from '../containers/System/Clinic/ManageClinic_2';
import AddClinic from '../containers/System/Clinic/AddClinic'

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                < div className="system-container" >
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/user-redux" component={UserRedux} />
                            <Route path="/system/manage-doctor" component={ManageDoctor} />
                            <Route path="/system/manage-speciatly" component={ManageSpecialty} />
                            <Route path="/system/manage-clinic_RUD" component={ManageClinic} />
                            <Route path="/system/manage-clinic_CR" component={ManageClinic_2} />
                            <Route path="/system/addClinic" component={AddClinic} />

                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
