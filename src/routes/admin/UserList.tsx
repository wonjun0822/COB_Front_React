import React from "react";

const AdminUserList = () => {
    return (
        <>
            <div className="pageheader">
                <div className="media">
                    <div className="pageicon pull-left">
                        <i className="fa fa-th-list"></i>
                    </div>

                    <div className="media-body">
                        <ul className="breadcrumb">
                            <li>
                                <i className="glyphicon glyphicon-home"></i>
                            </li>
                            <li>Admin</li>
                            <li>User List</li>
                        </ul>

                        <h4>User List</h4>
                    </div>
                </div>
            </div>

            <div className="contentpanel">
                User List
            </div>
        </>
    )
}

export default AdminUserList