import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './styles/index.less';

import HomePage from './components/homePage';

class App extends Component {
    render() {
        return <HomePage />;
    }
}

ReactDom.render(<App/>, document.querySelector('#root'));
