import { useEffect } from "react";
import { useParams } from 'react-router-dom'
import DataGrid from 'devextreme-react/data-grid';
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const ActionSummary = () => {
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
                            <li>Summary</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="contentpanel">
                Action Summary
            </div>
        </>
    )
}

export default ActionSummary