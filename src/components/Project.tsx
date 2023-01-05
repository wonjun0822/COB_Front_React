import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux";
import { setProjectCode } from '../redux/project'

import api from "../service/api";

interface ProjectProps {
    ProjCd: string,
    ProjNm: string
}

const Project = () => {
    const dispatch = useDispatch();

    const project = useSelector((state: RootState) => state.project);
    const [projectList, setProjectList] = useState<ProjectProps[]>([]);

    useEffect(() => {
        api({
            method: 'post',
            url: '/Common/AssignProject'
        }).then((response) => {
            setProjectList(JSON.parse(response.data.list));

            if (localStorage.getItem('project') != null && project.code === '') {
                const code = localStorage.getItem('project');

                dispatch(setProjectCode(code === null ? '' : code));
            }
        });
    }, [])

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const {target : { value }} = event;

        localStorage.setItem("project", value);

        dispatch(setProjectCode(value));
    }

    return (
        <h5 className="leftpanel-title" style={{ color: "black" }}>
            Assigned Projects : <br />

            <select value={project.code} style={{ width: "100%", height: "30px", marginTop: "5px" }} onChange={onChange}>
                <option value=''></option>

                {projectList.map((item, index) => (
                    <option key={index} value={item.ProjCd}>{item.ProjCd} {item.ProjNm}</option>
                ))}
            </select>
        </h5>
    )
}

export default Project;