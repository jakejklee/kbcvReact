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
                    {/* <Route path="/photo" component={PhotoAlbum} /> */}
                    {/* <Route path="/announcement" component={Announcement} /> */}
                    {/* <Route path="/Mmap" component={MobileMap} /> */}
                </div>
            </Router>
        )
    }
}

export default App;
