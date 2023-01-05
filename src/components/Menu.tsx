import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { setSelectedTree, Tree } from '../redux/tree'

import { TreeItem, TreeView, TreeItemContentProps, useTreeItem, TreeItemProps } from "@mui/lab";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import clsx from "clsx";
import Typography from "@mui/material/Typography";

import api from "../service/api";
import { useDispatch } from "react-redux";

const Menu = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const menu = useSelector((state: RootState) => state.menu);
    const project = useSelector((state: RootState) => state.project);

    const [activeMenuParent, setActiveMenuParent] = useState('');
    const [activeMenu, setActiveMenu] = useState('');
    const [openParent, setOpenParent] = useState('');
    const [treeList, setTreeList] = useState<Tree[]>([]);

    useEffect(() => {
        fnCheckUrl();

        function fnCheckUrl() {
            setActiveMenu(window.location.pathname);

            if (window.location.pathname.split('/').length === 3) {
                const parent = window.location.pathname.split('/')[1];

                setActiveMenuParent(parent);
                setOpenParent(parent);
            }

            else {
                setActiveMenuParent('');
                setOpenParent('');
            }
        }

        window.addEventListener('popstate', fnCheckUrl);

        return () => {
            window.removeEventListener('popstate', fnCheckUrl);
        }
    }, []);

    useEffect(() => {
        if (project.code.length > 0) {
            fnGetActionList();
        }

        function fnGetActionList() {
            api({
                method: 'post',
                url: '/Common/ProjectActionList',
                params: {
                    'projectCode': project.code
                }
            }).then((response) => {
                setTreeList(JSON.parse(response.data.actionList));

                if (openParent === 'ActionList') {
                    const treeCode = window.location.pathname.split('/')[2];

                    if (JSON.parse(response.data.actionList).filter(function(e: { id: number }) { return e.id.toString() === treeCode }).length === 0) {
                        navigate('/')
                    }

                    else {
                        dispatch(setSelectedTree(JSON.parse(response.data.actionList).filter(function(e: { id: number }) { return e.id.toString() === treeCode })[0]))
                    }

                    setOpenParent('');

                    setTimeout(function() {
                        setOpenParent('ActionList');
                    }, 0);
                }
            });
        }
    }, [project.code])

    const onClickParent = (event: React.MouseEvent<HTMLElement>, parent: string) => {
        setOpenParent((prev) => prev.toLowerCase() === parent.toLowerCase() ? '' : parent);
    }

    const onLinkClick = (event: React.MouseEvent<HTMLElement>, parent: string, menu: string) => {
        setActiveMenuParent(parent);
        setActiveMenu(menu);

        setOpenParent(parent);
    }

    const onTreeClick = (event: React.MouseEvent<HTMLElement>, id: string, parent: string, menu: string) => {
        const tree = treeList.filter(function(e) { return e.id.toString() === id })[0];

        dispatch(setSelectedTree(tree))

        onLinkClick(event, parent, menu);
    }

    const CustomContent = React.forwardRef(function CustomContent(
        props: TreeItemContentProps,
        ref
    ) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
         } = props;
      
        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection
        } = useTreeItem(nodeId);
      
        const icon = iconProp || expansionIcon || displayIcon;

        const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleExpansion(event);
        };
      
        const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleSelection(event)
        };
      
        return (
            <div
                className={clsx(className, classes.root, {
                    [classes.expanded]: expanded,
                    [classes.selected]: selected,
                    [classes.disabled]: disabled
                })}
                ref={ref as React.Ref<HTMLDivElement>}
            >
                <div onClick={handleExpansionClick} className={classes.iconContainer}>
                    {icon}
                </div>

                <Typography
                    onClick={handleSelectionClick}
                    component="div"
                    className={classes.label}
                >
                    <Link to={'/ActionList/' + nodeId} onClick={(e) => onTreeClick(e, nodeId, 'ActionList', '/ActionList')}>
                        {label}
                    </Link>
                </Typography>
            </div>
        );
    });

    const renderExpanded = () => {
        return treeList.filter(x => treeList.filter(c => c.parent.toString() === x.id.toString()).length > 0).map((list: Tree) => {
            return list.id.toString()
        });
    }

    const renderTreeView = () => {
        return (
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={renderExpanded()}
                selected={window.location.pathname.split('/')[1] === 'ActionList' ? window.location.pathname.split('/')[2] : ''}
            >
                {treeList.filter(x => x.parent === '#').map((node: Tree) => {
                    return renderTreeItem(node)
                })}
            </TreeView>
        )
    }
  
    const renderTreeItem = (node: Tree) => {
        return (
            <CustomTreeItem key={node.id.toString()} nodeId={node.id.toString()} label={node.text} >
                {treeList.filter(x => x.parent.toString() === node.id.toString()).length > 0 ? 
                    treeList.filter(x => x.parent.toString() === node.id.toString()).map((children) => renderTreeItem(children)) : null}
            </CustomTreeItem>
        )
    }

    const CustomTreeItem = (props: TreeItemProps) => (
        <TreeItem
            {...props}
            ContentComponent={CustomContent}
        />
    )

    return (
        <>
            <ul className="nav nav-pills nav-stacked"> 
                <nav>
                    {menu.mainMenu.map((mainMenu, index) => {
                        const subMenu = menu.subMenu.filter(x => x.MenuIdx == mainMenu.Idx);

                        if (mainMenu.MenuName === 'Action List') {
                            return (
                                <li key={index} className="parent">
                                    <div className={activeMenuParent.toLowerCase() === mainMenu.MenuType.toLowerCase() ? "active" : ""} onClick={(e) => onClickParent(e, mainMenu.MenuType)}>
                                        <i className={mainMenu.MenuIcon}></i>
                                        {mainMenu.MenuName}
                                    </div>

                                    {openParent.toLowerCase() == mainMenu.MenuType.toLowerCase() ? (
                                        <ul>
                                            <div>
                                                {renderTreeView()}
                                            </div>
                                        </ul>
                                    ) : ''}
                                </li>
                            )
                        }

                        else if (subMenu.length === 1) {
                            return (
                                <li key={index}>
                                    <Link to={subMenu[0].Url} onClick={(e) => onLinkClick(e, '', subMenu[0].Url)}>
                                        <div className={activeMenu === subMenu[0].Url ? "active" : ""}>
                                            <i className={mainMenu.MenuIcon}></i>
                                            {mainMenu.MenuName}
                                        </div>
                                    </Link>
                                </li>
                            )
                        }

                        else {
                            return (
                                <li key={index} className="parent">
                                    <div className={activeMenuParent.toLowerCase() === mainMenu.MenuType.toLowerCase() ? "active" : ""} onClick={(e) => onClickParent(e, mainMenu.MenuType)}>
                                        <i className={mainMenu.MenuIcon}></i>
                                        {mainMenu.MenuName}
                                    </div>

                                    {openParent.toLowerCase() == mainMenu.MenuType.toLowerCase() ? (
                                        <ul className="children">
                                            {subMenu.map((sub, index) => {
                                                return (
                                                    <li key={index} className={activeMenu === sub.Url ? "active" : ""}>
                                                        <Link to={sub.Url} onClick={(e) => onLinkClick(e, mainMenu.MenuType, sub.Url)}>{sub.SubMenuName}</Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : ''}
                                </li>
                            )
                        }
                    })}
                </nav>
            </ul>
        </>
    )
};

export default Menu;