import React from "react";
import DesignContext from "../DesignContext";
import Widget from "./Widget";

import find from "lodash/find";
import findIndex from "lodash/findIndex";
import differenceBy from "lodash/differenceBy";

import { jsPlumb } from "jsplumb";

export default class DesignModel extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const widgetsMap = {};
        const widgets = props.widgets.map(widget => {
            const w = new Widget(widget);
            widgetsMap[w.key] = w;
            return w;
        });

        return {
            widgets,
            widgetsMap,
            items: props.items || []
        };
    }

    static defaultProps = {
        onChange: null,
        widgets: [],
        items: [],
        relations: []
    };

    state = {
        widgets: [],
        widgetsMap: {},
        items: [],
        activeId: null
    };

    constructor(...args) {
        super(...args);

        this.flowInstance = this.getFlowInstance();
    }

    getFlowInstance() {
        if (this.flowInstance) return this.flowInstance;

        const instance = jsPlumb.getInstance({
            // drag options
            DragOptions: { cursor: "pointer", zIndex: 2000 },
            // default to a gradient stroke from blue to green.
            PaintStyle: {
                stroke: "#000",
                strokeWidth: 2
            },
            Container: "canvas",
            ConnectionOverlays: [
                [
                    "Arrow",
                    {
                        location: 1,
                        visible: true,
                        width: 11,
                        length: 11,
                        id: "ARROW",
                        events: {
                            click: function() {
                                alert("you clicked on the arrow overlay");
                            }
                        }
                    }
                ],
                [
                    "Label",
                    {
                        label: "<span class='connection-close'>x</span>",
                        id: "label",
                        cssClass: "connection-line",
                        events: {
                            click: conn => {
                                instance.deleteConnection(conn.component);
                                this.onChange();
                            }
                        }
                    }
                ]
            ],
            //鼠标经过样式
            HoverPaintStyle: { stroke: "#ec9f2e" }
        });

        instance.bind("connection", conn => {
            //查看被连接的两个点间是否已经连接过
            var conns = instance.getConnections({
                source: conn.sourceId,
                target: conn.targetId
            });
            //如果大于1条或链接本身，则不连接
            if (conns.length > 1 || conn.sourceId === conn.targetId) {
                instance.deleteConnection(conn.connection);
            } else {
                if (instance._ignoreEvent) {
                    return;
                }
                this.onChange();
            }
        });

        return instance;
    }

    onChange(items, relations) {
        const props = this.props;
        const { onChange } = props;

        if (!items) {
            items = this.getAllItems();
        }

        if (!relations) {
            relations = this.flowInstance.getAllConnections();
            relations = relations.map(conn => {
                return {
                    sourceId: conn.sourceId,
                    targetId: conn.targetId
                };
            });
            // console.log(relations, 'abcc')
        }

        if (onChange) {
            onChange(items, relations);
        }
    }

    getWidget(key) {
        const { widgetsMap } = this.state;
        return widgetsMap[key] || null;
    }

    // isWidget(widget) {
    //     return !!widget.$$widget;
    // }

    getWidgets() {
        const { widgets } = this.state;
        return [].concat(widgets);
    }

    setActiveId(activeId) {
        this.setState({
            activeId
        });
    }

    getActiveId() {
        return this.state.activeId;
    }

    getActiveItem() {
        const activeId = this.state.activeId;

        return this.getItem(activeId) || null;
    }

    getItems(pid = null) {
        const items = this.getAllItems();
        // console.log(items, 'axxx')
        return items.filter(item => item.$pid == pid);
    }

    getAllItems() {
        return [...this.state.items];
    }

    //获取组件的所有父级ID
    getPids(fieldId) {
        const pids = [];
        let node = this.getItem(fieldId);
        if (!node.$pid) return pids;

        let currentFieldId = node.$pid;
        let pNode;
        while ((pNode = this.getItem(currentFieldId))) {
            pids.push(pNode.fieldId);
            currentFieldId = pNode.$pid;
            if (!currentFieldId) break;
        }
        // console.log(pids, 'pids');
        return pids;
    }

    updateItem(item) {
        const items = this.getAllItems();
        const fieldId = item.fieldId;
        const idx = this.getItemIndex(fieldId);

        if (idx !== -1) {
            items[idx] = item;
        }

        this.onChange(items);
    }

    addItem(item, pid = null) {
        const items = this.getAllItems();

        item.$pid = pid;

        items.push(item);

        this.setActiveId(item.fieldId);

        this.onChange(items);
    }

    removeItem(fieldId) {
        const items = this.getAllItems();
        //移除指定项目及子项目
        const ret = items.filter(item => {
            let shouldRemove = item.fieldId === fieldId;

            if (!shouldRemove) {
                const pids = this.getPids(item.fieldId);
                shouldRemove = pids.indexOf(fieldId) > -1;
            }

            return !shouldRemove;
        });

        const allConns = this.flowInstance.getAllConnections();

        //注jsPlumb返回的元对象引用，在删除过程中使用splice删除导致forEach漏删问题
        //copy出来
        [...allConns].forEach(conn => {
            if (conn.sourceId === fieldId || conn.targetId === fieldId) {
                this.flowInstance.deleteConnection(conn);
            }
        });

        this.onChange(ret);
    }

    getItemIndex(fieldId) {
        const items = this.getAllItems();
        return findIndex(items, item => item.fieldId === fieldId);
    }

    getItem(fieldId) {
        const items = this.getAllItems();
        return find(items, item => item.fieldId === fieldId);
    }

    insertBefore(item, fieldId) {
        const items = this.getAllItems();

        //判断当前item是否已经存在, 如果存在则先删除
        const oIdx = this.getItemIndex(item.fieldId);
        if (oIdx > -1) {
            items.splice(oIdx, 1);
        }

        const bItem = this.getItem(fieldId);
        item.$pid = bItem.$pid;

        //插入操作
        const idx = this.getItemIndex(fieldId);
        items.splice(idx, 0, item);

        this.onChange(items);
    }

    insertAfter(item, fieldId) {
        const items = this.getAllItems();

        //判断当前item是否已经存在, 如果存在则先删除
        const oIdx = this.getItemIndex(item.fieldId);
        if (oIdx > -1) {
            items.splice(oIdx, 1);
        }

        const prevItem = this.getItem(fieldId);
        item.$pid = prevItem.$pid;

        //插入操作 之前有删除操作, 要重新查找index
        const idx = findIndex(items, item => item.fieldId === fieldId);
        items.splice(idx, 1, items[idx], item);

        this.onChange(items);
    }

    getModel() {
        return {
            flowInstance: this.flowInstance,
            //   isWidget: this.isWidget.bind(this),
            getWidget: this.getWidget.bind(this),
            getWidgets: this.getWidgets.bind(this),
            setActiveId: this.setActiveId.bind(this),
            getActiveId: this.getActiveId.bind(this),
            getActiveItem: this.getActiveItem.bind(this),
            addItem: this.addItem.bind(this),
            getPids: this.getPids.bind(this),
            updateItem: this.updateItem.bind(this),
            getItems: this.getItems.bind(this),
            getAllItems: this.getAllItems.bind(this),
            removeItem: this.removeItem.bind(this),
            getItemIndex: this.getItemIndex.bind(this),
            getItem: this.getItem.bind(this),
            insertBefore: this.insertBefore.bind(this),
            insertAfter: this.insertAfter.bind(this)
        };
    }

    diffNodeRelactions() {
        const { relations } = this.props;
        const conns = this.flowInstance.getAllConnections();

        const newConns = differenceBy(relations, conns, conn => {
            return [conn.sourceId, conn.targetId].join("->");
        });

        const delConns = differenceBy(conns, relations, conn => {
            return [conn.sourceId, conn.targetId].join("->");
        });

        if (delConns.length) {
            this.deleteConns(delConns);
        }

        if (newConns.length) {
            this.connectNodes(newConns);
        }
    }

    componentDidUpdate() {
        this.diffNodeRelactions();
    }

    connectNodes(conns = []) {
        // console.log("connectNodes", conns);
        conns.forEach(conn => {
            this.flowInstance.connect({
                source: conn.sourceId,
                target: conn.targetId
            });
        });
    }

    deleteConns(conns = []) {
        conns.forEach(conn => {
            this.flowInstance.deleteConnection(conn.connection);
        });
    }

    componentDidMount() {
        //初始时不触发onChange
        this.flowInstance._ignoreEvent = true;

        this.diffNodeRelactions();

        this.flowInstance._ignoreEvent = false;

        // this.flowInstance.bind("click", (c) => {
        //     this.flowInstance.deleteConnection(c);
        //     this.onChange()
        // });
    }

    // componentWillUnmount() {
    //     this.flowInstance.deleteEveryConnection();
    // }

    render() {
        const { children } = this.props;
        return (
            <DesignContext.Provider value={this.getModel()}>
                {children}
            </DesignContext.Provider>
        );
    }
}
