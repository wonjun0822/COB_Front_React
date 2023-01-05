import { useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Interface from './customattribute/interface';

import api from '../../service/api';

export interface ICodeProps {
    ID: number,
    Name: string
}

const CustomAttribute = () => {
    const [dbType, setDBType] = useState<ICodeProps[]>([]);
    const [usage, setUsage] = useState<ICodeProps[]>([]);
    const [category, setCategory] = useState<ICodeProps[]>([]);

    useEffect(() => {
        api({
            method: 'post',
            url: '/admin/CodeList',
        }).then((response) => {
            setDBType(JSON.parse(response.data.dbType));
            setUsage(JSON.parse(response.data.usage));
            setCategory(JSON.parse(response.data.category));
        });
    }, [])

    return (
        <>
            <div className='panel'>
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
                                <li>Custom Attribute Setup</li>
                            </ul>

                            <h4>Custom Attribute Setup</h4>
                        </div>
                    </div>
                </div>

                <div className="contentpanel">
                    <Tabs
                        defaultActiveKey="interface"
                        id="tab"
                        className="bar_tabs"
                    >
                        <Tab eventKey="interface" title="I/F Table Setup">
                            <Interface dbType={dbType} usage={usage} category={category} />
                        </Tab>

                        <Tab eventKey="connection" title="DB / Excel Connection">
                            DB / Excel Connection
                        </Tab>

                        <Tab eventKey="extraction" title="3D Model Attributes Extraction">
                            3D Model Attributes Extraction
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default CustomAttribute