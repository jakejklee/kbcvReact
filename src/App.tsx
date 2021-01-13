import React from 'react';
import MainPage from './components/MainPage';
import PhotoAlbum from './components/PhotoAlbum';
// import Announcement from './components/screens/Announcement';
import { BrowserRouter as Router, Route, } from 'react-router-dom';

interface Props {
}

class App extends React.Component<Props> {

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={MainPage} />
                </div>
            </Router>
        )
    }
}

export default App;
