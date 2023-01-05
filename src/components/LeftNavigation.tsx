import Menu from './Menu'
import Project from './Project'

const LeftNavigation = () => {
    return (
        <>
            <div className="leftpanel">
                <div className="media profile-left">
                    <div className="pull-left profile-thumb">
                        <img className="img-circle" src={ require("../images/photos/profile.png") } alt="" />
                    </div>

                    <div className="media-body">
                        <div style={{ float: "left" }}>
                            <h4 className="media-heading">wonjun</h4>
                            <div>
                                <small className="text-muted">Log Out</small>
                                <i className="glyphicon glyphicon-log-out" style={{ marginLeft: 10 }}></i>
                            </div>
                        </div>

                        <div className="setting">
                            <a href="#cog" style={{ color: "gray", verticalAlign: "middle" }} title="UPV Model Server Setting">
                                <i className="fa fa-cog fa-2x fa-fw"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <Project />

                <h5 className="leftpanel-title" style={{ color: "black" }}>
                    시스템 관리자 : 서승희 프로(1081)<br />
                    시스템 관리자 : 김동훈 프로(1468)
                </h5>

                <Menu />
            </div>
        </>
    )
}

export default LeftNavigation