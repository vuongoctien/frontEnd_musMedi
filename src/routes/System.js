import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserRedux from '../containers/System/Admin/UserRedux';//nếu bỏ dòng này thì chỗ Markdown toang luôn
import Header from '../containers/Header/Header';
import AddDoctor from '../containers/System/Doctor/AddDoctor';
import AddMediPackage from '../containers/System/Doctor/AddMediPackage';
import ListDoctor from '../containers/System/Doctor/ListDoctor';
import EditDoctor from '../containers/System/Doctor/EditDoctor';
import ManageSchedule from '../containers/System/Doctor/ManageSchedule';
// import ThoiGianBieu from '../containers/System/Doctor/ThoiGianBieu';
import LichBieu from '../containers/System/Doctor/LichBieu';
import CapNhatLich from '../containers/System/Doctor/CapNhatLich';
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
                            {/* <Route path="/system/user-redux" component={UserRedux} /> */}

                            <Route path="/system/addDoctor" component={AddDoctor} />
                            <Route path="/system/addMediPackage" component={AddMediPackage} />
                            <Route path="/system/listDoctor" component={ListDoctor} />
                            <Route path="/system/editDoctor" component={EditDoctor} />
                            <Route path="/system/editScheduleDoctor" component={ManageSchedule} />
                            {/* <Route path="/system/ThoiGianBieu" component={ThoiGianBieu} /> */}
                            <Route path="/system/LichBieu/:dd&:mm&:yy" component={LichBieu} />
                            <Route path="/system/CapNhatLich/:dd&:mm&:yy&:dr_or_pk_ID&:dr_or_pk" component={CapNhatLich} />

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
