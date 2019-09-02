import data from "../common/data";
import PropertyPanel from "./PropertyPanel";
import icon from "./icon.png";

const XType = "EX_START_NODE";
const Title = "开始";

export default {
    xtype: XType,
    title: Title,
    icon: icon,
    WidgetProperty: PropertyPanel,

    data() {
        return {
            ...data(),
            xtype: XType,
            title: Title
        };
    }
};
