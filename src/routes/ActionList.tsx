import React, { useEffect } from "react";
import { useParams } from 'react-router-dom'
import DataGrid from 'devextreme-react/data-grid';
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const ActionList = () => {
    const params = useParams();
    const tree = useSelector((state: RootState) => state.tree);

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
                            <li>Project Detail</li>
                            <li>{tree.class === 'O' ? 'Official Tag List' : tree.class === 'I' ? 'Internal Tag List' : 'Un-Official Tag List'}</li>
                        </ul>

                        <h4>{tree.class === 'O' ? 'Official Tag List' : tree.class === 'I' ? 'Internal Tag List' : 'Un-Official Tag List'}</h4>
                    </div>
                </div>
            </div>

            <div className="contentpanel">
                <div className="panel-heading">
                    <h3 className="panel-title">{tree.text}</h3>
                </div>
            </div>
        </>
    )
}

export default ActionList