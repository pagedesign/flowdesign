import { uuid } from '../../utils';

export default () => {
    return {
        $pid: null,
        fieldId: uuid(),
        fieldName: 'field_' + uuid(),
        taskId: uuid(),
        x: 0,
        y: 0,
        width: 90,
        height: 60,
    }
}