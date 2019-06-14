import data from '../common/data';
import PropertyPanel from './PropertyPanel';
import icon from './icon.png';

const XType = 'EX_TASKFLOW_NODE';
const Title = '流程';

export default {
    xtype: "EX_TASKFLOW_NODE",
    title: "流程",
    icon: icon,
    WidgetProperty: PropertyPanel,

    data() {
        return {
            ...data(),
            xtype: XType,
            title: Title,
        }
    }
};