import api from "../service/api";
import React, { useState } from "react";

const Login = () => {
    const [singleId, setSingleId] = useState('');

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (singleId === '') {
            alert('Enter the Single Id.');
        }

        else {
            api({
                method: 'post',
                url: '/Login/Login',
                params: {
                    'singleId': singleId
                }
            }).then((response) => {
                const accessToken = response.data;

                localStorage.setItem("token", accessToken);

                window.dispatchEvent(new Event("storage"));
            });
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {target : { value }} = event;

        setSingleId(value);
    }

    return (
        <div className="panel panel-signin">
            <div className="panel-body" style={{ border: 'solid 2px', borderStyle: 'inset', borderColor: '#0D72C1' }}>
                <div className="text-center">
                    <img src={ require("@/images/logo-primary.png") } alt="Chain Logo" />
                </div>

                <br />
                    
                <form onSubmit={onSubmit}>
                    <div className="input-group mb15">
                        <span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
                        <input type="text" value={singleId} className="form-control" placeholder="Single ID" onChange={onChange} />
                    </div>

                    <div className="clearfix">
                        <div className="pull-right">
                            <button type="submit" className="btn btn-success">Sign In<i className="fa fa-angle-right ml5"></i></button>
                        </div>
                    </div>                      
                </form>
            </div>
        </div> 
    )
}

export default Login