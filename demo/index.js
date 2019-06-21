import React from 'react';
import ReactDOM from 'react-dom';

import FormDesigner from '../src';

import widgets from './widgets';

import '../src/style';

function getMetadata() {
    const r = localStorage.getItem('_m_');
    return r ? JSON.parse(r) : {
        items: [],
        relations: [],
    }
}

function App() {
    const [metadata, onMetadataChange] = React.useState(getMetadata());

    localStorage.setItem('_m_', JSON.stringify(metadata));

    console.log(metadata)

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        }}>
            <FormDesigner
                widgets={widgets}
                metadata={metadata}
                onChange={onMetadataChange}
            />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))