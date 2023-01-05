import React from "react";

const AdminProjectList = () => {
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
                            <li>Project List</li>
                        </ul>

                        <h4>Project List</h4>
                    </div>
                </div>
            </div>

            <div className="contentpanel">
                Project List
            </div>
        </>
    )
}

export default AdminProjectList