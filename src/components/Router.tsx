import { Route, Routes, useNavigate, useRoutes } from 'react-router-dom';
import loadable from "@loadable/component";
import Login from '../routes/Login';
import Main from '../routes/Main';
import NotFound from './ERROR_404';
import LeftNavigation from './LeftNavigation';
import api from '../service/api';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../redux'
import { useEffect, useState } from 'react';
import { MainMenu, setMainMenu, setSubMenu, SubMenu } from '../redux/menu';

interface ILogin {
    isLogin: Boolean
}

const AppRouter = ({ isLogin }: ILogin) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuVisible, setMenuVisible] = useState(true);

    const menu = useSelector((state: RootState) => state.menu);

    const onMenuVisible = () => {
        setMenuVisible((prev) => !prev);
    }

    const setAuthMainMenu = (list: MainMenu[]) => {
        dispatch(setMainMenu(list));
    }

    const setAuthSubMenu = (list: SubMenu[]) => {    
        dispatch(setSubMenu(list));
    }

    const AuthMenuRoutes = () => useRoutes((mapRoutesForUse()));

    useEffect(() => {
        if (isLogin) {         
            api({
                method: 'post',
                url: '/Common/AuthorityMenu'
            }).then((response) => {
                setAuthMainMenu(JSON.parse(response.data.menu));
                setAuthSubMenu(JSON.parse(response.data.subMenu));
            });
        }

        else {
            const token = localStorage.getItem('token')

            if (!token) {
                localStorage.removeItem("project");

                navigate('/')
            }
        }
    }, [isLogin]);

    const mapRoutesForUse = () => {
        return [{
            path: '/',
            element: <Main />,
            children: childRoute()
        }, {
            path: '/*',
            element: <NotFound />,
            children: []
        }];
    };

    const childRoute = () => {
        return menu.subMenu.map((menu) => {
            const Component = loadable(() => import(`../routes${menu.Path}`).then(module => module.default));

            return {
                path: menu.Url,
                element: <Component />
            };
        });
    }

    return (
        <>
            {!isLogin ? (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
            ) : (
                <>
                    <div className="headerwrapper">
                        <div className="header-left">
                            <div className="pull-left">
                                <img src={require("../images/logo.png")} alt="" />
                            </div>
                        </div>

                        <div className="header-menu-visible">
                            {isMenuVisible ? (
                                <div className="menu-collapse_mod" onClick={onMenuVisible} style={{ cursor: "pointer" }}>
                                    <i className="glyphicon glyphicon-chevron-left"></i>
                                </div>
                            ) : (
                                <div className="menu-collapse_mod" onClick={onMenuVisible} style={{ cursor: "pointer" }}>
                                    <i className="glyphicon glyphicon-chevron-right"></i>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mainwrapper">
                        {isMenuVisible ? (
                            <LeftNavigation />
                        ) : ''}

                        <div className="mainpanel" style={{ marginLeft: isMenuVisible? "230px" : "" }}>
                            <AuthMenuRoutes />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default AppRouter;