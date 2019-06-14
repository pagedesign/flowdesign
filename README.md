# flow-design-core 流程设计器

`npm install --save flow-design-core`

## Usage

```
import FlowDesigner from 'flow-design-core';
import widgets from './widgets'

function App() {
    const [metadata, onMetadataChange] = React.useState({
        items: []
    })

    return (
        <div style={{
            margin: "30px auto",
            width: 1400,
            minHeight: 500
        }}>
            <FormDesigner widgets={widgets} metadata={metadata} onChange={onMetadataChange} />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))

```

## FlowDesigner

### props

#### widgets 
设计器控件列表

#### metadata 控件布局属性
eg:
```
{
    items: []
}
```

#### onChange
布局发生改变时触发

## WidgetDropAccepter

### props

#### items

#### pid

