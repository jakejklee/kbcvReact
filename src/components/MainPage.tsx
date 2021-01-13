import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import firebase from '../firebase/firebase';
import { Link } from 'react-router-dom';
// import '../vendor/bootstrap/css/bootstrap.min.css';
// import '../css/agency.css';
import PhotoAlbum from './PhotoAlbum';
import MainEditor from './MainEditor';
import strings from './strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFlickr, faYoutube, faVimeo } from '@fortawesome/free-brands-svg-icons';
import { faChurch, faLink, faInfoCircle, faHome, faEnvelope, faPhone, faTimes, faPlus, faBars } from '@fortawesome/free-solid-svg-icons';
import './MainPage.css';
import './agency.css';
import './all.css';

interface Props {

}
interface State {
    loginModal: boolean;
    linkModal: boolean;
    email: string;
    password: string;
    link: string;
    title: string;
    paragraph: string;
    videoLink: string;
    videoTitle: string;
    videoParagraph: string;
    user: boolean;
    photoModal: boolean;
    pageYOffset: number;
    mainEditorModal: boolean;
    mainPhotoObj: any;
    language: boolean;
}
let pageOffset = 0
class MainPage extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            loginModal: false,
            linkModal: false,
            photoModal: false,
            mainEditorModal: false,
            mainPhotoObj: {},
            email: '',
            password: '',
            user: false,
            link: '',
            title: '',
            paragraph: '',
            videoLink: '',
            videoTitle: '',
            videoParagraph: '',
            pageYOffset: 0,
            language: true,
        }
    }

    componentWillMount = () => {
        // console.log('test')
        firebase.firestore().collection('videoInfo').doc('Info').get().then((result) => {
            // const data = firebase.firestore().collection('videoLink').doc('videoLink').get();
            const data = result.data();
            if (data) {
                // console.log(data);
                this.setState({
                    videoLink: data.link,
                    videoTitle: data.title,
                    videoParagraph: data.paragraph,
                });
            };
        });

        firebase.firestore().collection('mainImages').orderBy('createdAt', 'desc').get().then((result) => {
            let mainObj: any = {}
            for (let i = 0; i < result.docs.length; i++) {
                mainObj[result.docs[i].id] = [result.docs[i].data().name, result.docs[i].data().url, result.docs[i].data().link]
            }
            this.setState({ mainPhotoObj: mainObj })
        })
        // console.log(this.state.mainPhotoObj)
        // console.log(window.innerWidth)
        window.addEventListener('scroll', this.handleScroll)

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log(user)
                this.setState({ user: true })
            } else {

                console.log('user')
            }
        });
    }


    private handleScroll = () => {
        // pageOffset = window.pageYOffset
        this.setState({ pageYOffset: window.pageYOffset });
        // return window.pageYOffset;
    }

    private emailHandleChange(mail: string) {
        this.setState({ email: mail });
    }

    private pwHandleChange(pw: string) {
        this.setState({ password: pw });
    }

    private linkHandleChange(newLink: string) {
        this.setState({ link: newLink });
    }
    private titleHandleChange(newTitle: string) {
        this.setState({ title: newTitle });
    }
    private paragraphHandleChange(newParagraph: string) {
        this.setState({ paragraph: newParagraph });
    }

    private changeLink = () => {
        firebase.firestore().collection('videoInfo').doc('Info').update({
            link: this.state.link,
            paragraph: this.state.paragraph,
            title: this.state.title,
        }).then((result) => {
            console.log(result);
            this.setState({ videoLink: this.state.link })
            this.setState({ videoTitle: this.state.title })
            this.setState({ videoParagraph: this.state.paragraph })
            this.setState({ link: '' })
            this.setState({ title: '' })
            this.setState({ paragraph: '' })
            this.setState({ linkModal: false })
        }).catch((e) => {
            console.log(e)
        })
    }

    private logIn = (email: string, password: string) => {
        // this.setState({ errorAlert: false });
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            console.log('Login success');
            this.setState({ email: '' });
            this.setState({ password: '' });
            this.setState({ user: true });
            this.setState({ loginModal: false });
        }).catch((error: any) => {
            console.log(error);
            // this.setState({ loginModal: false });
            // this.setState({ errorAlert: true });
        });
    }

    private logOut = () => {
        firebase.auth().signOut().then((user) => {
            this.setState({ user: false });
            // this.setState({ logOutDiv: false });
        }).catch((error) => {
            console.log(error);
        })
    }

    private renderMainIndicator = () => {
        const indicator: any = [];
        const photoObj = this.state.mainPhotoObj
        const keys = Object.keys(photoObj);
        for (let i = 0; i < keys.length; i++) {
            if (i === 0) {
                indicator.push(
                    <li data-target="#carouselExampleIndicators" data-slide-to={i} className="active"></li>
                );
            } else {
                indicator.push(
                    <li data-target="#carouselExampleIndicators" data-slide-to={i}></li>
                );
            }
        }
        return indicator;
    }

    private renderMainImages = () => {
        let images: any = [];
        const photoObj = this.state.mainPhotoObj
        const keys = Object.keys(photoObj);
        for (let i = 0; i < keys.length; i++) {
            const photoKey = keys[i]
            if (i === 0) {
                if (photoObj[photoKey][2]) {
                    images.push(
                        <div className="carousel-item active">
                            <a href={photoObj[photoKey][2]} target='_blank'>
                                <img className="d-block w-100" src={photoObj[photoKey][1]} alt="First slide" />
                            </a>
                        </div>
                    );
                } else {
                    images.push(
                        <div className="carousel-item active">
                            <img className="d-block w-100" src={photoObj[photoKey][1]} alt="First slide" />
                        </div>
                    );

                }
            } else {
                // images.push(
                //     <div className="carousel-item">
                //         <img className="d-block w-100" src={photoObj[photoKey][1]} alt={i + "slide"} />
                //     </div>
                // );
                if (photoObj[photoKey][2]) {
                    images.push(
                        <div className="carousel-item">
                            <a href={photoObj[photoKey][2]} target='_blank'>
                                <img className="d-block w-100" src={photoObj[photoKey][1]} alt={i + "slide"} />
                            </a>
                        </div>
                    );
                } else {
                    images.push(
                        <div className="carousel-item">
                            <img className="d-block w-100" src={photoObj[photoKey][1]} alt={i + "slide"} />
                        </div>
                    );

                }
            }
        }
        return images;
    }


    changeLan = () => {
        this.setState({ language: !this.state.language })
    }
    render() {
        let stringObj;
        this.state.language ?
            stringObj = strings.kr
            :
            stringObj = strings.en

        return (
            <div className="App">

                <div id='page-top'>

                    {/* <!-- Navigation --> */}
                    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav"
                        style={window.innerWidth > 770 ?
                            this.state.pageYOffset > 100 ?
                                { height: 70, backgroundColor: '#0a205a' }
                                :
                                { height: 70, }
                            :
                            {}
                        }>

                        <div className="container" id='innerMainNav' style={
                            this.state.pageYOffset > 100 && window.innerHeight < window.innerWidth ? { backgroundColor: '#0a205a' } : {}}>
                            <a className="navbar-brand js-scroll-trigger" href="#page-top">
                                <img className="img-fluid" src="img/logos/kbcvlogo.png" alt="kbcv_logo" /></a>
                            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                                data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                                aria-label="Toggle navigation">
                                Menu
                                <FontAwesomeIcon icon={faBars} className="fas" style={{ marginLeft: 5 }} />
                                {/* <i className="fas fa-bars"></i> */}
                            </button>
                            <div className="collapse navbar-collapse" id="navbarResponsive">
                                <ul className="navbar-nav text-uppercase ml-auto">
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="#sermon">{stringObj.sermon}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="#ministry">{stringObj.ministry}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="#portfolio">{stringObj.about}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="#photo">{stringObj.photo}</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link js-scroll-trigger" href="#language"
                                            onClick={() => { this.changeLan() }}>Language | {stringObj.language}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* <!-- Header --> */}
                    {/* <!--carousel slide images --> */}
                    <div id="topslide">
                        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                            <ol className="carousel-indicators">
                                {this.renderMainIndicator()}
                            </ol>
                            <div className="carousel-inner">
                                {this.renderMainImages()}
                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                        <div className='bg-light' style={{ paddingTop: 30, width: '100%', textAlign: 'center' }}>
                            {
                                this.state.user ?
                                    // <Button onClick={() => { this.setState({ linkModal: true }) }}>링크 바꾸기</Button>
                                    <Button onClick={() => { this.setState({ mainEditorModal: true }) }}>메인 이미지 변경</Button>
                                    :
                                    <div></div>
                            }
                        </div>
                        <Modal
                            size="lg"
                            show={this.state.mainEditorModal}
                            onHide={() => { this.setState({ mainEditorModal: false }) }}
                        // aria-labelledby="example-modal-sizes-title-sm"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    메인 이미지 변경
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <MainEditor
                                    photos={this.state.mainPhotoObj}
                                ></MainEditor>
                            </Modal.Body>
                        </Modal>

                    </div>

                    {/* <!-- Sermon --> */}
                    <section id="sermon" className='bg-light'>
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h2 className="section-heading text-uppercase">{stringObj.sundaySermon}</h2>
                                    <h3 className="section-subheading text-muted"></h3>

                                    <div className="embed-responsive embed-responsive-16by9">
                                        {/* <iframe className="embed-responsive-item" src="https://player.vimeo.com/video/382973596" */}
                                        <iframe className="embed-responsive-item" src={this.state.videoLink}
                                            // webkitAllowFullScreen={true}
                                            // mozallowfullscreen="true"
                                            allowFullScreen></iframe>
                                    </div>
                                    <br />
                                    <h3 className="text-center">{this.state.videoTitle}</h3>
                                    <p className="text-center text-muted">{this.state.videoParagraph}</p><br />
                                    <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger" href="https://vimeo.com/user8852275"
                                        target="_blank">설교영상 더보기</a><br /><br />
                                    {
                                        this.state.user ?
                                            <Button onClick={() => { this.setState({ linkModal: true }) }}>링크 바꾸기</Button>
                                            :
                                            <div></div>
                                    }
                                    <div>
                                        <Modal
                                            // size="sm"
                                            show={this.state.linkModal}
                                            onHide={() => { this.setState({ linkModal: false }) }}
                                            aria-labelledby="example-modal-sizes-title-sm"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title id="example-modal-sizes-title-sm">
                                                    Link Info<br></br>
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form.Group controlId="formBasicLink">
                                                    <Form.Label>Video Link</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Link" value={this.state.link}
                                                        onChange={(e: any) => { this.linkHandleChange(e.target.value) }} />
                                                </Form.Group>

                                                <Form.Group controlId="formBasicTitle">
                                                    <Form.Label>Video Title</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Title" value={this.state.title}
                                                        onChange={(e: any) => { this.titleHandleChange(e.target.value) }} />
                                                </Form.Group>

                                                <Form.Group controlId="formBasicEmail">
                                                    <Form.Label>Video Paragraph</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter Paragraph" value={this.state.paragraph}
                                                        onChange={(e: any) => { this.paragraphHandleChange(e.target.value) }} />
                                                </Form.Group>

                                                <Modal.Footer>
                                                    <Button variant="primary" type="submit" style={{}}
                                                        onClick={() => { this.changeLink() }}>
                                                        CHANGE
                            </Button>
                                                </Modal.Footer>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                                {/* <!--col-lg div--> */}
                            </div>
                            {/* <!--row--> */}
                        </div>
                        {/* <!--container--> */}
                    </section>

                    {/* <!-- Services --> */}
                    <section id="ministry">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h2 className="section-heading text-uppercase">{stringObj.ministryTeam}</h2>
                                    <h3 className="section-subheading text-muted"></h3>
                                </div>
                            </div>
                            <div className="row text-center">
                                <div className="col-md-4">
                                    <span className="fa-stack fa-4x"><a className="ministry-link text-muted" data-toggle="modal" href="#ministry1">
                                        <img className="img-fluid" src="img/ministrylogo/grow1.png" alt="kbcv_kids" /></a>
                                    </span>
                                    <h4 className="service-heading">{stringObj.kids} </h4>
                                    <p className="text-muted">미취학 어린이를 위한 영/유아부와 11세(G6)이하의 어린이들을 위한 예배입니다.
            무엇보다도 신앙안에서 하나님의 자녀요, 제자라는 정체성과 함께 예수님을 닮은 존귀한 존재로 준비되도록 돕고 있습니다.</p>
                                    <a className="ministry-link text-muted" data-toggle="modal" href="#ministry1"><strong>{stringObj.link}</strong></a>
                                    {/* <a href="kids.html" className="text-muted"><strong>바로가기</strong></a> */}
                                </div>
                                <div className="col-md-4">
                                    <span className="fa-stack fa-4x"><a className="ministry-link text-muted" data-toggle="modal" href="#ministry2">
                                        <img className="img-fluid" src="img/ministrylogo/cross1.png" alt="kbcv_youth" /></a>
                                    </span>
                                    <h4 className="service-heading">{stringObj.youth}</h4>
                                    <p className="text-muted">청소년부는 12세부터 19세(G7-G12)까지 하나님을 사랑하는 십대 청소년들로 구성되어 주일 오전11:30분에 모여 예배 드리고 있습니다.
                                    예배를 통하여 사명을 깨닫고 하나님의 나라와 뜻을 위하여 귀하게 쓰임받을 수 있도록 늘 말씀과 기도
            로 함께하고 있습니다.</p>
                                    <a className="ministry-link text-muted" data-toggle="modal" href="#ministry2"><strong>{stringObj.link}</strong></a>
                                    {/* <a href="youth.html" className="text-muted"><strong>바로가기</strong></a> */}
                                </div>
                                <div className="col-md-4">
                                    <span className="fa-stack fa-4x"><a className="ministry-link text-muted" data-toggle="modal" href="#ministry3">
                                        <img className="img-fluid" src="img/ministrylogo/love1.png" alt="kbcv_youngadult" /></a>
                                    </span>
                                    <h4 className="service-heading">{stringObj.youngAdult}</h4>
                                    <p className="text-muted">20세 이상의 미혼 청년들을 중심으로 모여 찬양과 경배, 성경공부모임, 제자훈련을 통해 예수님과 동행하는 삶을 살아가고
            믿음으로 함께 걸어가는 젊은 그리스도인들의 사랑 공동체입니다.</p>
                                    <a className="ministry-link text-muted" data-toggle="modal" href="#ministry3"><strong>{stringObj.link}</strong></a>
                                    {/* <a href="youngadult.html" className="text-muted"><strong>바로가기</strong></a> */}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="portfolio-modal modal fade" id="ministry1" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>
                                {/* <!--close-modal--> */}
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <div className="">
                                                {/* <!-- Project Details Go Here --> */}
                                                <section className="" id="photo1">

                                                    {/* <div className="container">
                                                        <div className="row"> */}
                                                    <div className="text-center">
                                                        {/* <div className="col-lg-12 text-center"> */}
                                                        <h2 className="section-heading text-uppercase">어린이부</h2>
                                                        <br></br>
                                                        <p className="item-intro text-muted"> </p>

                                                        {/* <!--carousel slide images --> */}

                                                        <div id="carouselMinistry1Indicators" className="carousel slide" data-ride="carousel">
                                                            <ol className="carousel-indicators">
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="0" className="active"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="1"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="2"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="3"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="4"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="5"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="6"></li>
                                                                <li data-target="#carouselMinistry1Indicators" data-slide-to="7"></li>

                                                            </ol>
                                                            <div className="carousel-inner ministryItem" >
                                                                <div className="carousel-item active">
                                                                    <img className="d-block w-100" src="img/children/children1.jpg" alt="First slide" />
                                                                    <div className="carousel-caption">
                                                                        <h3></h3>
                                                                        <p></p>
                                                                    </div>
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children2.jpg" alt="Second slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children3.jpg" alt="Third slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children4.jpg" alt="Fourth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children5.jpg" alt="Fifth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children6.jpg" alt="sixth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children7.jpg" alt="sixth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/children/children8.jpg" alt="sixth slide" />
                                                                </div>
                                                            </div>
                                                            <a className="carousel-control-prev" href="#carouselMinistry1Indicators" role="button" data-slide="prev">
                                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Previous</span>
                                                            </a>
                                                            <a className="carousel-control-next" href="#carouselMinistry1Indicators" role="button" data-slide="next">
                                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Next</span>
                                                            </a>
                                                        </div>



                                                        <br></br>

                                                        <img className="d-block w-100" src="img/children/child_intro.png" alt="Children Introduction" />




                                                        <p style={{ fontSize: "80%;" }}> *어린이부 프로그램은 매년 변경될 수 있음을 알려드립니다.</p>


                                                        {/* <a className="btn btn-primary text-uppercase js-scroll-trigger" href="index.html">뒤로가기</a> */}


                                                        {/* <a className="btn btn-primary text-uppercase js-scroll-trigger" href="https://www.flickr.com/photos/167839826@N06/albums" target="_blank">교회사진첩바로가기</a> */}

                                                    </div>
                                                    {/* </div>
                                                    </div> */}
                                                </section>
                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="portfolio-modal modal fade" id="ministry2" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>
                                {/* <!--close-modal--> */}
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <div className="">
                                                {/* <!-- Project Details Go Here --> */}
                                                <section className="" id="photo2">
                                                    {/* <div className="container">
                                                        <div className="row"> */}
                                                    <div className="text-center">
                                                        <h2 className="section-heading text-uppercase">청소년부</h2>
                                                        <br></br>
                                                        <p className="item-intro text-muted"> </p>

                                                        <div id="carouselMinistry2Indicators" className="carousel slide" data-ride="carousel">
                                                            <ol className="carousel-indicators">
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="0" className="active"></li>
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="1"></li>
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="2"></li>
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="3"></li>
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="4"></li>
                                                                <li data-target="#carouselMinistry2Indicators" data-slide-to="5"></li>
                                                            </ol>
                                                            <div className="carousel-inner ministryItem">
                                                                <div className="carousel-item active">
                                                                    <img className="d-block w-100" src="img/youth/youth1.jpeg" alt="First slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youth/youth2.jpeg" alt="Second slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youth/youth3.jpeg" alt="Third slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youth/youth4.jpeg" alt="Fourth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youth/youth5.jpeg" alt="Fifth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youth/youth6.jpeg" alt="sixth slide" />
                                                                </div>

                                                            </div>
                                                            <a className="carousel-control-prev" href="#carouselMinistry2Indicators" role="button" data-slide="prev">
                                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Previous</span>
                                                            </a>
                                                            <a className="carousel-control-next" href="#carouselMinistry2Indicators" role="button" data-slide="next">
                                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Next</span>
                                                            </a>
                                                        </div>
                                                        <br></br>
                                                        <img className="d-block w-100" src="img/youth/youth.png" alt="Youth_introduction" />
                                                    </div>
                                                    {/* </div>
                                                    </div> */}
                                                </section>
                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="portfolio-modal modal fade" id="ministry3" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>
                                {/* <!--close-modal--> */}
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <div className="">
                                                {/* <!-- Project Details Go Here --> */}
                                                <section className="" id="photo3">

                                                    {/* <div className="container">
                                                        <div className="row"> */}
                                                    <div className="text-center">
                                                        <h2 className="section-heading text-uppercase">청년부</h2>
                                                        <br></br>
                                                        <p className="item-intro text-muted"> </p>






                                                        {/* <!--carousel slide images --> */}

                                                        <div id="carouselMinistry3Indicators" className="carousel slide" data-ride="carousel">
                                                            <ol className="carousel-indicators">
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="0" className="active"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="1"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="2"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="3"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="4"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="5"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="6"></li>
                                                                <li data-target="#carouselMinistry3Indicators" data-slide-to="7"></li>

                                                            </ol>
                                                            <div className="carousel-inner ministryItem">
                                                                <div className="carousel-item active">
                                                                    <img className="d-block w-100" src="img/youngadult/young1.jpg" alt="First slide" />
                                                                    <div className="carousel-caption">
                                                                        <h3></h3>
                                                                        <p></p>
                                                                    </div>
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young2.jpg" alt="Second slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young3.jpg" alt="Third slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young4.JPG" alt="Fourth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young5.jpg" alt="Fifth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young6.jpg" alt="sixth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young7.jpeg" alt="sixth slide" />
                                                                </div>
                                                                <div className="carousel-item">
                                                                    <img className="d-block w-100" src="img/youngadult/young8.JPG" alt="sixth slide" />
                                                                </div>



                                                            </div>
                                                            <a className="carousel-control-prev" href="#carouselMinistry3Indicators" role="button" data-slide="prev">
                                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Previous</span>
                                                            </a>
                                                            <a className="carousel-control-next" href="#carouselMinistry3Indicators" role="button" data-slide="next">
                                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                                <span className="sr-only">Next</span>
                                                            </a>
                                                        </div>



                                                        <br></br>

                                                        <img className="d-block w-100" src="img/youngadult/youngadult.png" alt="youngadult_introduction" />

                                                        <p style={{ fontSize: "80%" }}></p>


                                                        {/* <a className="btn btn-primary text-uppercase js-scroll-trigger" href="index.html">뒤로가기</a> */}


                                                        {/* <a className="btn btn-primary text-uppercase js-scroll-trigger" href="https://www.flickr.com/photos/167839826@N06/albums" target="_blank">교회사진첩바로가기</a> */}

                                                    </div>
                                                    {/* </div>
                                                    </div> */}
                                                </section>
                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Portfolio Grid --> */}
                    <section className="bg-light" id="portfolio">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h2 className="section-heading text-uppercase">{stringObj.aboutChurch}</h2>
                                    <h3 className="section-subheading text-muted"></h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal1">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/ch_1.jpg" alt="about-church-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.historyAndVision}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal2">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/02-thumbnail.jpg" alt="senior-pastor-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.aboutPastorPaul}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal3">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/03-thumbnail1.jpg" alt="service-schedule-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.timeAndLocation}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal4">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/04-thumbnail.jpg" alt="ministers-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.pastors}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal5">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/05-thumbnail.jpg" alt="deacon-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.ordainedDecon}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                                <div className="col-md-4 col-sm-6 portfolio-item">
                                    <a className="portfolio-link" data-toggle="modal" href="#portfolioModal6">
                                        <div className="portfolio-hover">
                                            <div className="portfolio-hover-content">
                                                <FontAwesomeIcon icon={faPlus} className="fas fa-3x" />
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="img/portfolio/cg1.jpg" alt="life-group-thumbnail" />
                                    </a>
                                    <div className="portfolio-caption">
                                        <h4>{stringObj.cellGroup}</h4>
                                        <p className="text-muted"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="text-center" style={{ backgroundColor: "#9da5bd" }}>
                        <span className="fa-stack fa-4x"><a href="https://www.flickr.com/photos/167839826@N06/albums/72157712530460638"
                            target="_blank">
                            <img className="img-fluid" src="img/ministrylogo/brochure.png" alt="kbcv_brochure_2019" /></a>
                        </span>
                        <h2 className="section-heading text-uppercase" style={{ color: "black" }}><a
                            href="https://www.flickr.com/photos/167839826@N06/albums/72157712530460638" target="_blank">{stringObj.news2020}</a></h2>
                        <br />
                    </div>

                    {/* <!-- photo --> */}
                    <section className="bg-light" id="photo" >

                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12 text-center">
                                    <h2 className="section-heading text-uppercase">{stringObj.photoGallary}</h2>
                                    {/* <h3 className="section-subheading text-muted"> </h3>
                                     */}

                                    <div className="col-md-12">
                                        <ul className="list-inline social-buttons photo-social">
                                            <li className="list-inline-item">
                                                <a href="https://www.instagram.com/kbcv.canada/" target="_blank">
                                                    {/* <i className="fab fa-instagram"></i> */}
                                                    {/* <FontAwesomeIcon icon={faStar} style={{ color: primaryColor }} className='mx-lg-3 mx-sm-1 mx-md-2' /> */}
                                                    <FontAwesomeIcon icon={faInstagram} />
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="https://www.flickr.com/photos/167839826@N06/albums" target="_blank">
                                                    {/* <i className="fab fa-flickr"></i> */}
                                                    <FontAwesomeIcon icon={faFlickr} />
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <!--carousel slide images --> */}
                                    <PhotoAlbum></PhotoAlbum>
                                    {/* <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                        <ol className="carousel-indicators">
                                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
                                            <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>

                                        </ol>
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img className="d-block w-100" src="img/into-carousel/ph1.jpg" alt="First slide" />
                                                <div className="carousel-caption">
                                                    <h3></h3>
                                                    <p>미주 한인 남침례회</p>
                                                </div>
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="img/into-carousel/ph6.jpg" alt="Second slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="img/into-carousel/ph2.jpg" alt="Third slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="img/into-carousel/ph3.jpg" alt="Fourth slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="img/into-carousel/ph4.jpg" alt="Fifth slide" />
                                            </div>
                                            <div className="carousel-item">
                                                <img className="d-block w-100" src="img/into-carousel/ph5.jpg" alt="sixth slide" />
                                            </div>
                                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Previous</span>
                                            </a>
                                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span className="sr-only">Next</span>
                                            </a>
                                        </div>

                                    </div>


                                    <br />


                                    <p style={{ fontSize: '80%' }}>* 더 많은 사진을 보기 원하시는 분은 '교회사진첩'을 클릭해주세요</p>
                                    <Link className="btn btn-primary text-uppercase js-scroll-trigger"
                                     to='/photo' style={{marginRight:5}}>교회사진첩</Link> */}
                                    {/* <Button onClick={() => { this.setState({ photoModal: true }) }}>교회사진첩</Button> */}
                                    {/* <PhotoModal
                                        modalInfo={this.state.photoModal}
                                        modalHide={() => { this.setState({ photoModal: false }) }}
                                        modalUser={this.state.user}
                                    /> */}
                                    {/* <a className="btn btn-primary text-uppercase js-scroll-trigger"
                    href="https://www.flickr.com/photos/167839826@N06/albums" target="_blank">교회사진첩</a> */}

                                    {/* <a className="btn btn-primary text-uppercase js-scroll-trigger" href="https://www.instagram.com/kbcv.canada/"
                                        target="_blank">인스타그램</a> */}

                                    {/* </div> */}
                                    {/* <!--col-lg div--> */}
                                </div>
                                {/* <!--row--> */}
                            </div>
                            {/* <!--container--> */}
                        </div>
                        {/* <!--gallery--> */}
                    </section>


                    {/* <!--footer--> */}
                    <footer>
                        <div className="pt-5 pb-5 mt-lg-0">
                            <div className="container">
                                <div className="row">

                                    <div className="col-sm-12 col-md-1 text-center mb-3 mb-md-0">
                                        {/* <i className="fas fa-church fa-2x"></i> */}
                                        <FontAwesomeIcon icon={faChurch} className="fas fa-2x" />
                                    </div>

                                    <div className="col-sm-12 col-md-3 text-center text-md-left text-uppercase mb-3 mb-md-0">
                                        <p>
                                            <h6 className="text-uppercase font-weight-bold">{stringObj.serviceInfo}</h6>
                                            <p></p> {stringObj.sun1} | 9:00AM
                <br />{stringObj.sun2} | 11:30AM <br />
                                            <br />{stringObj.earlyMorningPrayer} | 6:00AM ({stringObj.tueToFri})
                <br />{stringObj.tuesday} | 10:00AM<br />
                                            <br />{stringObj.wednesday} | 7:30PM
                <br />{stringObj.friday} | 8:00PM </p>
                                    </div>
                                    <div className="col-sm-12 col-md-1 text-center mb-3 mb-md-0">
                                        {/* <i className="fas fa-link fa-2x"></i> */}
                                        <FontAwesomeIcon icon={faLink} className="fas fa-2x" />
                                    </div>
                                    <div className="col-sm-12 col-md-3 text-center text-md-left text-uppercase mb-3 mb-md-0">
                                        {/* <!-- Links --> */}
                                        <h6 className="text-uppercase font-weight-bold">{stringObj.usefulLinks}</h6>

                                        <p>
                                            <a className="bottom_link" href="http://www.duranno.com/qt/default.asp?CAT=020200" target="_blank">{stringObj.duranno}</a>
                                        </p>
                                        <p>
                                            <a className="bottom_link " href="http://www.christiantimes.ca/" target="_blank">{stringObj.christiantimes}</a>
                                        </p>
                                        <p>
                                            <a className="bottom_link" href="http://www.godpeople.com/" target="_blank">{stringObj.godpeople}</a>
                                        </p>
                                        <p>
                                            <a className="bottom_link" href="#"></a>
                                        </p>
                                    </div>
                                    <div className="col-sm-12 col-md-1 text-center mb-3 mb-md-0">
                                        {/* <i className="fas fa-info-circle fa-2x"></i> */}
                                        <FontAwesomeIcon icon={faInfoCircle} className="fas fa-2x" />
                                    </div>
                                    <div className="col-sm-12 col-md-3 text-center text-md-left  mb-3 mb-md-0">
                                        <h6 className="text-uppercase font-weight-bold">{stringObj.contact}</h6>

                                        <p>
                                            {/* <i className="fas fa-home mr-3"></i> */}
                                            <FontAwesomeIcon icon={faHome} className="fas mr-3" />
                                            1005 Kensington Ave. <br />Burnaby BC V5B 4B8</p>
                                        <p>
                                            {/* <i className="fas fa-envelope mr-3"></i> */}
                                            <FontAwesomeIcon icon={faEnvelope} className="fas mr-3" />
                                            <a href="mailto:kbcv.canada@gmail.com"
                                                style={{ color: '#fff' }}>kbcv.canada@gmail.com</a></p>
                                        <p>
                                            {/* <i className="fas fa-phone mr-3"></i> */}
                                            <FontAwesomeIcon icon={faPhone} className="fas mr-3" />
                                            + 01 604 438 7833</p>
                                        {this.state.user ?
                                            <Button onClick={() => { this.logOut() }}>로그아웃</Button>
                                            :
                                            <Button onClick={() => { this.setState({ loginModal: true }) }}>{stringObj.adminLogin}</Button>
                                        }

                                        <div>
                                            <Modal
                                                // size="sm"
                                                show={this.state.loginModal}
                                                onHide={() => { this.setState({ loginModal: false }) }}
                                                aria-labelledby="example-modal-sizes-title-sm"
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title id="example-modal-sizes-title-sm">
                                                        Admin Login<br></br>
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <Form.Group controlId="formBasicEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control type="email" placeholder="Enter email" value={this.state.email}
                                                            onChange={(e: any) => { this.emailHandleChange(e.target.value) }} />
                                                        {/* <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text> */}
                                                    </Form.Group>

                                                    <Form.Group controlId="formBasicPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control type="password" placeholder="Password" value={this.state.password}
                                                            onChange={(e: any) => { this.pwHandleChange(e.target.value) }} />
                                                    </Form.Group>
                                                    {/* <Form.Group controlId="formBasicChecbox">
                                <Form.Check type="checkbox" label="Check me out" />
                            </Form.Group> */}
                                                    <Modal.Footer>

                                                        <Button variant="primary" type="submit" style={{}}
                                                            onClick={() => { this.logIn(this.state.email, this.state.password) }}>
                                                            LOGIN
                            </Button>
                                                    </Modal.Footer>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* <!-- social media Links --> */}
                        <div className="col-md-12">
                            <ul className="list-inline quicklinks">
                                <li className="list-inline-item">
                                    <a href="#"></a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-12">
                            <ul className="list-inline social-buttons">


                                <li className="list-inline-item">
                                    <a href="https://www.instagram.com/kbcv.canada/" target="_blank">
                                        {/* <i className="fab fa-instagram"></i> */}
                                        {/* <FontAwesomeIcon icon={faStar} style={{ color: primaryColor }} className='mx-lg-3 mx-sm-1 mx-md-2' /> */}
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="https://www.flickr.com/photos/167839826@N06/albums" target="_blank">
                                        {/* <i className="fab fa-flickr"></i> */}
                                        <FontAwesomeIcon icon={faFlickr} />
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="https://www.youtube.com/channel/UCIwoai_XgmO9J0hAHk4aolw" target="_blank">
                                        {/* <i className="fab fa-youtube"></i> */}
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="https://vimeo.com/user8852275" target="_blank">
                                        {/* <i className="fab fa-vimeo"></i> */}
                                        <FontAwesomeIcon icon={faVimeo} />
                                    </a>
                                </li>
                            </ul>
                        </div>


                        {/* <!-- Copyright --> */}
                        <div className="footer-copyright text-center text-black-50 py-3">© 2019 Copyright:
      <a href="#"> kbcv.ca</a>
                        </div>
                        {/* <!-- Copyright --> */}

                    </footer>
                    {/* <!-- Footer --> */}


                    {/* <!-- Portfolio Modals --> */}

                    {/* <!-- Modal 1 --> */}
                    <div className="portfolio-modal modal fade" id="portfolioModal1" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <div className="modal-body">
                                                {/* <!-- Project Details Go Here --> */}
                                                <h2 className="text-uppercase">밴쿠버한인<br />침례교회</h2>
                                                <p className="item-intro text-muted">Korean Baptist Church Of Vancouver (KBCV) </p>
                                                {/* img slide */}
                                                <div id="portfolioModal1Indicators" className="carousel slide" data-ride="carousel">
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#portfolioModal1Indicators" data-slide-to="0" className="active"></li>
                                                    </ol>
                                                    <div className="carousel-inner ministryItem">
                                                        <div className="carousel-item active">
                                                            <img className="d-block w-100" src="img/top-photo/header-bg-5.jpg" alt="First slide" />
                                                            {/* <img className="img-fluid d-block mx-auto" src="img/top-photo/header-bg-5.jpg" alt="kbcv_church" /> */}
                                                        </div>

                                                    </div>
                                                    <a className="carousel-control-prev" href="#portfolioModal1Indicators" role="button" data-slide="prev">
                                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Previous</span>
                                                    </a>
                                                    <a className="carousel-control-next" href="#portfolioModal1Indicators" role="button" data-slide="next">
                                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Next</span>
                                                    </a>
                                                </div>

                                                <div className="container-fluid" style={{ marginTop: '100px' }}>
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-sm-4 col-lg-4" style={{ marginTop: '20px' }}>
                                                            <h4>MISSION</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                            <strong>Reach the world with the Word!</strong><br />"땅끝까지 말씀을 전파하라!"
                    </div>

                                                        <div className="col-sm-4 col-lg-4" style={{ marginTop: '20px' }}>
                                                            <h4>VISION</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                            <strong>By the Word and Pray</strong><br />말씀과 기도로 부흥하는 교회 <br /><br />
                                                            <strong>To Influence the World</strong><br />땅끝까지 복음을 전하는 교회 <br /><br />
                                                            <strong>With the Next Generation</strong><br />차세대가 부흥함을 보는 교회
                    </div>
                                                        <div className="col-sm-4 col-lg-4" style={{ marginTop: '20px' }}>
                                                            <h4>CORE VALUE</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                              하나님을 향한 <strong>예배사역</strong><br /><br />
                              신자를 향한 <strong>양육사역</strong><br /><br />
                              세상을 향한 <strong>전도사역</strong><br />
                                                        </div>
                                                    </div>
                                                </div>


                                                <hr style={{ width: '100%', marginTop: '80px', marginBottom: '10px' }}>
                                                </hr>

                                                <section id="ci">
                                                    <div className="container-fluid">
                                                        <div className="row" style={{ fontSize: '90%' }}>
                                                            <div className="col-12" style={{ marginTop: '10px' }}>
                                                                <h4>CHURCH CI</h4>
                                                                <hr className="sub_hr">
                                                                </hr>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                <img className="img-fluid" src="img/portfo-contents/kbcv-ci.jpg" alt="kbcv-ci" />
                                                <br />

                                                <hr style={{ width: '100%', margin: '0 0 10px 0' }}>
                                                </hr>



                                                {/* <!-- About --> */}
                                                <section id="about">
                                                    <div className="container-fluid">
                                                        <div className="row" style={{ fontSize: '90%' }}>
                                                            <div className="col-12" style={{ marginTop: '10px' }}>
                                                                <h4>CHURCH HISTORY</h4>
                                                                <hr className="sub_hr">
                                                                </hr>
                                1975년부터 시작된 밴쿠버한인침례교회<br />
                                모든것이 하나님의 은혜이고 기적입니다
                      </div>
                                                        </div>
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <ul className="timeline">
                                                                <li>
                                                                    <div className="timeline-image">
                                                                        <img className="rounded-circle img-fluid" src="img/about/1.jpg" alt="kbcv_church_1975" />
                                                                    </div>
                                                                    <div className="timeline-panel">
                                                                        <div className="timeline-heading">
                                                                            <h4>1975-1990</h4>
                                                                            <h4 className="subheading">GRACE</h4>
                                                                        </div>
                                                                        <div className="timeline-body">
                                                                            <p className="text-muted">-</p>

                                                                            {/* <!--link with href--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    1975-1980
                                </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample">
                                                                                <div className="card card-body">

                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>1975</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.01 - 손경환 형제 집에서 밴쿠버한인복음교회를 창립</li>
                                                                                        <li className="list-group-item">01.12 - 첫 주보를 발행</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1976</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.04 - 창립 1주년 기념예배</li>
                                                                                        <li className="list-group-item">04.30 - 밴쿠버한인침례교회로 개명</li>
                                                                                        <li className="list-group-item">06.01 - 미남침례회 교단에 가입</li>
                                                                                        <li className="list-group-item">06.11 - 손경환 전도사 1대 담임목사로 안수</li>
                                                                                        <li className="list-group-item">09.11 - 자매회 조직</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1977</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">12.04 - 미남침례회 홈미션의 지원을 받아 현 소재지 교회구입 계약</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1978</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">03.31 - 손경환 목사 사임</li>
                                                                                        <li className="list-group-item">04.16 - 유경애 전도사 부임</li>
                                                                                        <li className="list-group-item">08.20 - 이종상 목사 2대 담임목사로 부임</li>
                                                                                        <li className="list-group-item">11.29 - 이종상 목사 사임</li>
                                                                                        <li className="list-group-item">12. - 안이숙 사모 시무</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1979</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.07 - 입당감사예배</li>
                                                                                        <li className="list-group-item">05.00 - 김영록 목사 3대 담임목사로 부임</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1980</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">11.09 - 북방선교헌금모으기 시작</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>

                                                                                </div>
                                                                                {/* <!--card body--> */}
                                                                            </div>
                                                                            {/* <!--collapse--> */}


                                                                            {/* <!--link with href 2--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample2" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    1981-1990
                                </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample2">
                                                                                <div className="card card-body">

                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>1981</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">00.00 - 성경과 찬송 북방지역에 전달</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1983</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">00.00 - 성경과 주석을 활빈과 심양등에 전달</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1984</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">06.25 - 집사안수식(김동찬&안석환)</li>
                                                                                        <li className="list-group-item">12.00 - 김영록목사 사임</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1985</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">02.00 - 김기서 전도사 부임</li>
                                                                                        <li className="list-group-item">04.23~5.10 - 김동식 전도사 북방 단기선교</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1986</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">05.24 - 김기서전도사 목사안수(4대 담임목사)</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1987</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">02.20~03.25 - 김성환형제 인도네시아 단기선교</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1988</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">07.31 - 김기서목사 사임</li>
                                                                                        <li className="list-group-item">12.00 - 청소년부 멕시코 단기선교</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1989</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">02.07 - 한상휘 목사 5대 담임목사부임</li>
                                                                                        <li className="list-group-item">12.00 - 청소년부 멕시코 단기선교</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1990</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">02.05 - 김동국집사 중국파송</li>
                                                                                        <li className="list-group-item">07.00 - 김성환형제 소련&루마니아 단기선교</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample2" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>
                                                                                </div>
                                                                                {/* <!--card body--> */}
                                                                            </div>
                                                                            {/* <!--collapse--> */}

                                                                        </div>
                                                                        {/* <!--timeline-body--> */}

                                                                    </div>
                                                                    {/* <!--timeline-panel--> */}
                                                                </li>

                                                                <li className="timeline-inverted">
                                                                    <div className="timeline-image">
                                                                        <img className="rounded-circle img-fluid" src="img/about/2.jpg" alt="" />
                                                                    </div>
                                                                    <div className="timeline-panel">
                                                                        <div className="timeline-heading">
                                                                            <h4>2000</h4>
                                                                            <h4 className="subheading">BELIEF</h4>
                                                                        </div>
                                                                        <div className="timeline-body">
                                                                            <p className="text-muted">-</p>

                                                                            {/* <!--link with href 3--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample3" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    1991-2000
                                </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample3">
                                                                                <div className="card card-body">

                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>1991</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">04.28 - 한상휘 목사 사임</li>
                                                                                        <li className="list-group-item">08.00 - 청소년부 멕시코 단기선교</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1992</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">10.04 - 한바울 목사 6대 담임목사 부임</li>
                                                                                        <li className="list-group-item">10.18 - 한국 내 개척교회(등대침례교회,활천침례교회)을 후원하기로 결정</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1993</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">07.09~08.09 - 담임목사 북방단기선교</li>
                                                                                        <li className="list-group-item">07.11 - 한국어 청소년부 시작</li>
                                                                                        <li className="list-group-item">08.00 - 청소년부 멕시코 단기선교</li>
                                                                                        <li className="list-group-item">09.19 - 영어예배 시작</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1994</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.11~15 - 성경 통독 수련회</li>



                                                                                        <li className="list-group-item">
                                                                                            <h4>1995</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">09.28~29 - 선교집회(문대규목사)</li>
                                                                                        <li className="list-group-item">10.01 - 창립20주년 기념예배 및 목사안수식(김동식,김효치) & 집사안수식(이동진)</li>
                                                                                        <li className="list-group-item">10.13~11.10 - QT훈련학교(서모세목사)</li>
                                                                                        <li className="list-group-item">10.31 - 김동식목사 우즈베키스탄으로 파송</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>1998</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">00.00 - 집사안수식(소진호)</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>1999</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">-</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2000</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">-</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample3" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>


                                                                                    </ul>
                                                                                </div>
                                                                                {/* <!--card body--> */}
                                                                            </div>
                                                                            {/* <!--collapse--> */}



                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="timeline-image">
                                                                        <img className="rounded-circle img-fluid" src="img/about/3.jpg" alt="" />
                                                                    </div>
                                                                    <div className="timeline-panel">
                                                                        <div className="timeline-heading">
                                                                            <h4>2010</h4>
                                                                            <h4 className="subheading">HOPE</h4>
                                                                        </div>
                                                                        <div className="timeline-body">
                                                                            <p className="text-muted">-</p>


                                                                            {/* <!--link with href 3--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample4" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    2001-2005</a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample4">
                                                                                <div className="card card-body">

                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>2001</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">08.00 - 한바울 목사 사임</li>
                                                                                        <li className="list-group-item">08.00 - 염인철목사 임시담임목사 부임</li>
                                                                                        <li className="list-group-item">12.27~29 - 성경읽기 및 금식기도회</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2002</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.12 - 염인철목사 7대 담임목사 위임</li>
                                                                                        <li className="list-group-item">02-14~16 - 행복한 가정만들기 세미나(정동섭교수)</li>
                                                                                        <li className="list-group-item">03.15~16 - 제1회 청지기수련회(직분자수련회)</li>
                                                                                        <li className="list-group-item">09.28~29 - 안요한 목사 초청집회</li>
                                                                                        <li className="list-group-item">10.04~06 - 창립27주년 기념부흥회(윤지원목사)</li>
                                                                                        <li className="list-group-item">10.06 - 창립27주년 기념예배와 추수감사예배</li>
                                                                                        <li className="list-group-item">10.11~13 - 창립 27주년 기념 리더쉽컨퍼런스(제리 타이온 목사)</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>2003</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">03.14 - 제2회 청지기수련회(김순호 간사)</li>
                                                                                        <li className="list-group-item">05.09 - 집사은퇴식(서영석)&안수식(김동국,이해준,정평진)</li>
                                                                                        <li className="list-group-item">10.01~03 - 청소년부 멕시코 단기선교</li>
                                                                                        <li className="list-group-item">12.05 - 창립28주년 기념부흥회(권준 목사)</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2004</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.04 - 제직수련회</li>
                                                                                        <li className="list-group-item">03.03~07 - 제3회 청지기수련회(윤지원목사)</li>
                                                                                        <li className="list-group-item">03.00 - 신앙훈련 과정(생명의삶,예수님짜리,하나님을 경험하는 삶)개설</li>
                                                                                        <li className="list-group-item">03.14 - 제1기 가정교회 목자훈련 시작</li>
                                                                                        <li className="list-group-item">05.09 - 교회홈페이지개설(wwww.kbcv.ca)</li>
                                                                                        <li className="list-group-item">10.01~03 - 창립29주년 기념부흥회(이형원 목사)</li>
                                                                                        <li className="list-group-item">12.05 - 교회 도서대출 시작</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>2005</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.30 - 가정교회 목자 안수식(12명)</li>
                                                                                        <li className="list-group-item">02.06 - 목장모임 시작</li>
                                                                                        <li className="list-group-item">02.11~13 - 가정교회 간증집회(이은주 목녀)</li>
                                                                                        <li className="list-group-item">06.01 - 장준호 전도사 부임</li>
                                                                                        <li className="list-group-item">07.11~14 - 알럿베이(Alert Bay) 원주민 선교지 방문</li>
                                                                                        <li className="list-group-item">08.01~20 - 청소년부 태국 단기선교</li>
                                                                                        <li className="list-group-item">08.12~13 - 캐쉬 크릭(Cache Creek) 원주민 선교지 방문</li>
                                                                                        <li className="list-group-item">09.25 - 목사 안수식(김영구) & 집사 은퇴식(김동찬,신영선)</li>
                                                                                        <li className="list-group-item">10.01 - 집사 안수식(류인권,이용희,이원혁,임세웅) & 선교사 파송식(소진호)</li>
                                                                                        <li className="list-group-item">10.06~09 - 휴스턴 서울침례교회 평신도가정교회세미나(12명) 참석</li>
                                                                                        <li className="list-group-item">11.11~13 - 가정교회 부흥회(김인기 목사)</li>
                                                                                        <li className="list-group-item">12.04 - 장년부 1부예배(9:30am)시작</li>
                                                                                        <li className="list-group-item">12.18 - 사역헌신축제</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample4" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>


                                                                            {/* <!--link button--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample5" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    2006-2010
                                </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample5">
                                                                                <div className="card card-body">
                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>2006</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">03.10~12 - 가정교회 간증집회(곽인순 목사)</li>
                                                                                        <li className="list-group-item">03.19 - 삶공부 봄학기 개강</li>
                                                                                        <li className="list-group-item">04.03~15 - 세겹줄 기도회</li>
                                                                                        <li className="list-group-item">06.09~11 - 세크라멘트 방주선교교회 평신도가정교회세미나(11명) 참석</li>
                                                                                        <li className="list-group-item">09.03~04 - 목사목녀 수련회</li>
                                                                                        <li className="list-group-item">09.05~15 - 세겹줄 기도회</li>
                                                                                        <li className="list-group-item">09.10 - 삶공부 가을학기 개강</li>
                                                                                        <li className="list-group-item">09.15~17 - 가정교회 부흥회(김재정 목사)</li>
                                                                                        <li className="list-group-item">10.01 - 창립31주년 기념예배 및 집사안수식(류인권,이용희,이원혁,임세웅) & 선교사파송식(소진호)</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>2007</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">11.15 - 김나영 전도사 부임</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2008</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">08.31 - 염인철 목사 사임</li>
                                                                                        <li className="list-group-item">09.00 - 가정교회를 구역모임으로 변경</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2009</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">05.10- 최혁 목사 8대 담임목사로 부임</li>
                                                                                        <li className="list-group-item">06.27 - 최혁 목사 위임</li>
                                                                                        <li className="list-group-item">07.12- 금요기도회 시작</li>
                                                                                        <li className="list-group-item">08.23- 김동찬집사 중국 단기선교로 파송</li>
                                                                                        <li className="list-group-item">10.01~04- 창립34주년 선교집회(이재환 선교사)</li>
                                                                                        <li className="list-group-item">11.05- 장준호 전도사 목사 안수</li>
                                                                                        <li className="list-group-item">12.00- 사랑의박스 원주민교회(쎄아웃찬양교회)에 전달</li>

                                                                                        <li className="list-group-item">
                                                                                            <h4>2010</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.03 - 정영민 목사 부임</li>
                                                                                        <li className="list-group-item">01.05~08 - 신년특별새벽기도회</li>
                                                                                        <li className="list-group-item">01.10 - 장준호 목사가 사임</li>
                                                                                        <li className="list-group-item">01.31 - 명예권사(8명),명예집사(8명),서리집사(36명) 임명</li>
                                                                                        <li className="list-group-item">02.00 - 말씀묵상학교, 1:1제자 양육 훈련 시작</li>
                                                                                        <li className="list-group-item">03.23~04.02 - 사순절특별새벽기도회</li>
                                                                                        <li className="list-group-item">04.10~05.15 - 미션 익스포저 선교훈련(김광철,김영남,박요셉,정성헌 목사)(6주) </li>
                                                                                        <li className="list-group-item">08.01~02 - 장년부 원주민 단기선교(쎄아웃찬양교회)</li>
                                                                                        <li className="list-group-item">09.23~26 - 창립35주년 기념 선교집회(임현수 목사)</li>
                                                                                        <li className="list-group-item">11.15~28 - 베트남 단기선교</li>
                                                                                        <li className="list-group-item">12.02 - 부라직 오 전도사(U국) 목사 안수</li>
                                                                                        <li className="list-group-item">12.00- 사랑의박스 원주민교회(쎄아웃찬양교회)에 전달</li>
                                                                                        <li className="list-group-item">12.17~19- 청/장년부 원주민 단기선교(쎄아웃찬양교회)</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample5" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li className="timeline-inverted">
                                                                    <div className="timeline-image">
                                                                        <img className="rounded-circle img-fluid" src="img/about/4.jpg" alt="" />
                                                                    </div>
                                                                    <div className="timeline-panel">
                                                                        <div className="timeline-heading">
                                                                            <h4>2019</h4>
                                                                            <h4 className="subheading">LOVE</h4>
                                                                        </div>
                                                                        <div className="timeline-body">
                                                                            <p className="text-muted">-</p>

                                                                            {/* <!--link button--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample6" role="button"
                                                                                    aria-expanded="false" aria-controls="collapseExample">
                                                                                    2011-2015
                                </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample6">
                                                                                <div className="card card-body">
                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>2011</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.04~07 - 신년 특별새벽기도회</li>
                                                                                        <li className="list-group-item">01.23 - 명예집사(1명),서리집사(17명)</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>2012</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.29 - 김나영 전도사(어린이부) 사임</li>
                                                                                        <li className="list-group-item">02.24 - 일일부흥회(1차) 이기환 선교사 (터키)</li>
                                                                                        <li className="list-group-item">03.04 - 션킴 전도사 부임(어린이부)</li>
                                                                                        <li className="list-group-item">04.08 - 침례식<br />청소년부:우철희,임현규,임현지,최주은<br />청년:김윤석,손진영<br />장년:박준식,이영진,정원선</li>
                                                                                        <li className="list-group-item">05.07~09 - 영성훈련(어메이징 그레이스)<br />참가자: 구은영, 김귀선, 김필구, 박준식,소태영, 윤수안, 오향근, 이한규, 정영숙</li>
                                                                                        <li className="list-group-item">05.19~27 - 아버지 학교<br />참가자: 김상현, 김종성, 김호균, 박영호</li>

                                                                                        <li className="list-group-item">06.15 - 일일부흥회(2차) 박신일 목사(그레이스한인교회)</li>

                                                                                        <li className="list-group-item">07.15 - 침례식-청년 : 김준석, 장년: 조미경</li>
                                                                                        <li className="list-group-item">08.13~24 - 청년부 캄보디아 단기선교
                                      <br />참가자: 정영민 김석경, 최청순, 최경진, 손징영, 정재영, 김가람, 정수아</li>
                                                                                        <li className="list-group-item">10.05 - 일일부흥회(3차)</li>
                                                                                        <li className="list-group-item">10.07 - 교회창립주일 및 선교사 파송(윤수안 선교사(케냐) & 한상철, 최청순
                                      선교사(캄보디아)<br />침례식-장년부 : 모선영</li>
                                                                                        <li className="list-group-item">12.23 - 성탄길거리찬양(브로드웨이 스테이션), 사랑의 선물(쌔아웃 원주민 교회), 북한콩보내기
                                      헌금(퍼스트스텝스)</li>


                                                                                        <li className="list-group-item">
                                                                                            <h4>2013</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.27 - 선교파송마침: 소진호, 김재선</li>
                                                                                        <li className="list-group-item">02.03 - 침례식 (임정아)</li>
                                                                                        <li className="list-group-item">03.16~24 - 청소년부 과테말라 선교</li>
                                                                                        <li className="list-group-item">05.09~11 - 영성훈련(연합 3기 어메이징 그레이스) <br />
                                                                참가자: 곽경애, 남명희, 박영호, 송민자, 이숙영, 이장추</li>
                                                                                        <li className="list-group-item">05.31~06.02 - 심령부흥회 : 김대성 목사(소명중앙교회</li>
                                                                                        <li className="list-group-item">06.15 - 캄보디아 단기선교 후원바자회</li>
                                                                                        <li className="list-group-item">08.01~03 - 할랏 원주민 어린이 여름성경학교<br />쉬메이너스 찬양집회</li>
                                                                                        <li className="list-group-item">08.04~05 - 쉬메이너스 찬양예배</li>
                                                                                        <li className="list-group-item">08.12~24 - 캄보디아 단기선교(깜퐁참)<br />참가자: 정영민, 남명희, 김귀선, 최경진,
                                      황보현희, 김가람, 최용락 </li>
                                                                                        <li className="list-group-item">11.28~30 - 연합4기 어메이징그레이스 / 참가자: 엄정인</li>
                                                                                        <li className="list-group-item">11.17 - 사임 줄리강 전도사(청소년부)
                                      임명 존청 전도사(청소년부 임시)</li>
                                                                                        <li className="list-group-item">12.08 - 할랏 지역 성탄선물 전달</li>
                                                                                        <li className="list-group-item">12.22 - 침례식(신동국)</li>




                                                                                        <li className="list-group-item">
                                                                                            <h4>2014</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.02 - 신임 권사 집사 임명<br />
                                                                - 권사: 김명자, 정길자<br />
                                                                - 집사: 박영호, 엄정인, 정정례, 조미경</li>
                                                                                        <li className="list-group-item">02.16 - 최혁 목사 사임</li>
                                                                                        <li className="list-group-item">05.14~27 - 중국단기선교(션킴, 존청 전도사)</li>
                                                                                        <li className="list-group-item">06.14 - 선교 바자회</li>
                                                                                        <li className="list-group-item">06.22 - 선교사파송: 김동국, 안미선 (캄보디아)</li>
                                                                                        <li className="list-group-item">08.01~02 - 쉬메이너스 찬양예배</li>
                                                                                        <li className="list-group-item">08.11~23 - 캄보디아 단기선교(깜퐁참)<br /> 참가자: 정영민, 김필구, 남명희, 김준형,
                                      김윤혜, 황보현희</li>
                                                                                        <li className="list-group-item">08.15 - 캄보디아 단기선교 후원바자회</li>
                                                                                        <li className="list-group-item">08.23 - 폴 민 목사 부임</li>
                                                                                        <li className="list-group-item">10.05 - 창립 39주년 기념예배 및 폴민 목사 취임예배</li>




                                                                                        <li className="list-group-item">
                                                                                            <h4>2015</h4>
                                                                                        </li>
                                                                                        <li className="list-group-item">01.04 - 새해 첫 침례식 (침례자 : 김효근, 남명희, 소태영, 송민자, 김태균)</li>
                                                                                        <li className="list-group-item">01.05~10 - 신년특별 새벽기도</li>
                                                                                        <li className="list-group-item">01.11 - 정영민 목사 사임</li>
                                                                                        <li className="list-group-item">01.14 - 수요예배 다시 시작</li>
                                                                                        <li className="list-group-item">01.18 - 박대윤 목사 청년부담당</li>
                                                                                        <li className="list-group-item">01.25 - 교회명칭 변경을 위한 공청회 개최 </li>
                                                                                        <li className="list-group-item">02.01 - 신도사무총회개최</li>
                                                                                        <li className="list-group-item">03.29 - 상반기 새가족환영회</li>
                                                                                        <li className="list-group-item">03.31 - 고난주간 특별새벽기도회(4월3일까지)</li>
                                                                                        <li className="list-group-item">04.03 - 고난주간 특별새벽기도회</li>
                                                                                        <li className="list-group-item">04.05 - 부활절 연합예배(본교회당)</li>
                                                                                        <li className="list-group-item">04.12 - 신앙생활 기초반(12주), 한국어 학교 시작 (12주)</li>
                                                                                        <li className="list-group-item">04.13 - 밴쿠버지역 침례교회목회자 모임(본교회당)</li>
                                                                                        <li className="list-group-item">04.25 - 춘계 교회 대청소</li>
                                                                                        <li className="list-group-item">05.01 - 청년부 수련회(5/1~5/3)</li>
                                                                                        <li className="list-group-item">05.17 - 네팔지진피해 복구를 위한 특별구제헌금, 어린이부 P.A.T</li>
                                                                                        <li className="list-group-item">05.23 - V.B.S를 위한 어린이부 교사 세미나</li>
                                                                                        <li className="list-group-item">06.20 - 선교와 교육부를 위한 바자회</li>
                                                                                        <li className="list-group-item">06.28 - 침례식 (침례자 : 장성업, 신한나, 최용락, 김연수)</li>
                                                                                        <li className="list-group-item">07.12 - 전교인 야유예배</li>
                                                                                        <li className="list-group-item">08.02 - 사라회/아브라함회 수양회(8/2~8/3)</li>
                                                                                        <li className="list-group-item">08.16 - 임시사무총회 – 안수집사선출(김효근, 소태영, 이윤선, 장성업)</li>
                                                                                        <li className="list-group-item">09.06 - 구역장 수양회(9/6~9/7)
                                                                                                    </li>
                                                                                        <li className="list-group-item">09.19 - 하반기 새가족 환영회</li>
                                                                                        <li className="list-group-item">09.26 - 추계 교회 대청소</li>
                                                                                        <li className="list-group-item">09.27 - 호칭장로 임명식</li>
                                                                                        <li className="list-group-item">10.04 - 창립 40주년 기념 예배<br />
                                                                안수집사 임직 감사예배(오후 5시)(집사 안수-김효근, 소태영, 이윤선, 장성업)</li>
                                                                                        <li className="list-group-item">10.10~11.21 - 지도자 성경 공부반</li>
                                                                                        <li className="list-group-item">10.11 - 밴한제자반 개강(10주 과정)</li>
                                                                                        <li className="list-group-item">10.31 - Holy Win Night</li>
                                                                                        <li className="list-group-item">12.06~20 - 사랑의 선물 박스</li>
                                                                                        <li className="list-group-item">12.28~30 - 청년부 수련회</li>
                                                                                        <a data-toggle="collapse" href="#collapseExample6" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                            {/* <!--link button--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample7" role="button" aria-expanded="false"
                                                                                    aria-controls="collapseExample">
                                                                                    2016-2017
                    </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample7">
                                                                                <div className="card card-body">
                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>2016</h4>
                                                                                        </li>

                                                                                        <li className="list-group-item">01.03 - 새해 첫 침례식 (침례자 : 노진주, 박상글, 이지영, 정하림)</li>
                                                                                        <li className="list-group-item">01.04~09 - 신년특별 새벽기도회</li>
                                                                                        <li className="list-group-item">01.10~24 - 귀납법적 성경연구 특강</li>
                                                                                        <li className="list-group-item">01.17 - 한국어 학교 개강</li>
                                                                                        <li className="list-group-item">01.31~02.21 - 레위기 특강</li>
                                                                                        <li className="list-group-item">02.21 - 전년결산 정기총회</li>
                                                                                        <li className="list-group-item">02.28~05.01 - 밴한제자반 2기</li>
                                                                                        <li className="list-group-item">03.21~25 - 고난주간 특별새벽기도회</li>
                                                                                        <li className="list-group-item">04.30 - 춘계 대청소</li>
                                                                                        <li className="list-group-item">05.21 - 삶공부 봄학기 개강</li>
                                                                                        <li className="list-group-item">06.12 - Fort Mcmurray 이재민들을 위한 특별 구제헌금</li>
                                                                                        <li className="list-group-item">06.18 - 선교 바자회</li>
                                                                                        <li className="list-group-item">06.26~07.03 - 교회 미니 부흥회</li>
                                                                                        <li className="list-group-item">07.07~09 - 어린이부 여름성경학교 개강</li>
                                                                                        <li className="list-group-item">07.10 - 전교인 야외예배</li>
                                                                                        <li className="list-group-item">07.30 - 청소년부 리드릿</li>
                                                                                        <li className="list-group-item">07.31 - 신도사무총회 상반기 결산보고</li>
                                                                                        <li className="list-group-item">08.08~20 - A2F 난민선교(김동국, 안미선 집사) 개강</li>
                                                                                        <li className="list-group-item">09.04 - 구역장 수련회</li>
                                                                                        <li className="list-group-item">09.17 - 중국어 클래스 개설</li>
                                                                                        <li className="list-group-item">09.18 - 임시신도 사무총회(교회건물을 부동산에 내 놓는 것에 관한 건)</li>
                                                                                        <li className="list-group-item">09.24 - 추계 교회 대청소</li>
                                                                                        <li className="list-group-item">09.25~11.27 - 밴한제자반 Advanced Class</li>
                                                                                        <li className="list-group-item">10.01 - Woman's Leadership Seminar</li>
                                                                                        <li className="list-group-item">10.31 - Holy Win Night </li>
                                                                                        <li className="list-group-item">11.12 - Mission Intensive 선교훈련(6개월 과정)</li>
                                                                                        <li className="list-group-item">11.12 - 새가족 만찬 및 환영회</li>
                                                                                        <li className="list-group-item">11.20 - 임시신도 사무총회(교회 매매에 관한 건)</li>
                                                                                        <li className="list-group-item">11.20~12.18 - 사랑의 선물 박스 봄학기 개강</li>
                                                                                        <li className="list-group-item">11.30 - 수요 찬양의 밤</li>
                                                                                        <li className="list-group-item">12.04~18 - 기초성경공부(유일한 구원자 예수 그리스도) 개강</li>
                                                                                        <li className="list-group-item">12.18 - 임시신도 사무총회(2017년 예산안 심의)</li>
                                                                                        <li className="list-group-item">12.25 - Lottie Moon 성탄 선교헌금</li>



                                                                                        <li className="list-group-item">
                                                                                            <h4>2017</h4>
                                                                                        </li>

                                                                                        <li className="list-group-item">01.01 - 새해 첫 침례식(침례자-김영순, 민해나, 박원준, 정하언)</li>
                                                                                        <li className="list-group-item">01.02~07 - 신년특별 새벽기도회</li>
                                                                                        <li className="list-group-item">01.15 - 호칭장로 임명식(호칭장로-서상오, 소진호, 한상철 장로)</li>

                                                                                        <li className="list-group-item">01.22 - 제직 Orientation & 김동식 목사 - 협동목사에서 소망회 담당목사</li>

                                                                                        <li className="list-group-item">01.29 - 전년 결산 정기총회<br />정경조 목사 사임</li>

                                                                                        <li className="list-group-item">03.09~18 - 예루살렘 성지순례
                                                                                        김동국, 김효근, 남명희, 류인권, 문경린, 민원옥, 박경환, 박인숙, 서상오, 소태영,
                                                                                        송민자. 안미선 오향근, 윤석녀, 폴 민, 허윤금 이상 16명 </li>

                                                                                        <li className="list-group-item">04.08 - Mission Intensive 선교훈련(6개월 과정) 마침
                                                                                                        </li>

                                                                                        <li className="list-group-item">04.10~14 - 고난주간 특별 새벽기도회 </li>

                                                                                        <li className="list-group-item">04.23~05.14 - 밴한 새가족반(신앙생활 입문)</li>

                                                                                        <li className="list-group-item">05.06 - 춘계 교회 대청소 </li>

                                                                                        <li className="list-group-item">06.18 - 침례식 - 김아름, 김주만, 이규혜, 한미영</li>

                                                                                        <li className="list-group-item">06.19 - 소망회 야유회</li>

                                                                                        <li className="list-group-item">06.22~24 - 청년부 수련회</li>

                                                                                        <li className="list-group-item">06.29~07.01- 어린이부 VBS</li>

                                                                                        <li className="list-group-item">07.09 - 전교인 야외예배 </li>

                                                                                        <li className="list-group-item">07.13~15 - 밴쿠버 아일랜드 원주민 단기선교 </li>

                                                                                        <li className="list-group-item">08.27 - 교역자 임명
                                                                                        예배부 담당 : 오성훈 전도사
                                                                                                     Youth 담당 : 박상글 전도사 </li>

                                                                                        <li className="list-group-item">09.10 - 결산 임시총회</li>
                                                                                        <li className="list-group-item">09.16 - 새가족 환영회 </li>
                                                                                        <li className="list-group-item">09.30 - 추계 교회 대청소</li>
                                                                                        <li className="list-group-item">10.08 - 창립 42주년 기념 예배</li>
                                                                                        <li className="list-group-item">10.31 - Holy Win Night </li>
                                                                                        <li className="list-group-item">12.09 - 새가족부 연말세미나 및 축하모임</li>
                                                                                        <li className="list-group-item">12.10 - 전체 안수집사 회의 </li>
                                                                                        <li className="list-group-item">12.17 - 신년 예산안 임시총회</li>
                                                                                        <li className="list-group-item">12.24 - 성탄축하 행사 - 구역별 찬양대회 Lottie Moon 성탄 선교헌금 </li>
                                                                                        <a data-toggle="collapse" href="#collapseExample7" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>


                                                                            {/* <!--link button--> */}
                                                                            <p>
                                                                                <a className="btn2" data-toggle="collapse" href="#collapseExample8" role="button" aria-expanded="false"
                                                                                    aria-controls="collapseExample">
                                                                                    2018-2019
                    </a>
                                                                            </p>
                                                                            <div className="collapse" id="collapseExample8">
                                                                                <div className="card card-body">
                                                                                    <ul className="list-group" style={{ fontSize: '11px' }}>
                                                                                        <li className="list-group-item">
                                                                                            <h4>2018-2019</h4>
                                                                                        </li>

                                                                                        <li className="list-group-item">01.02~06 - 신년 특별새벽기도회</li>
                                                                                        <li className="list-group-item">01.21 - 공청회 실시(총회의 안건을 위해)</li>
                                                                                        <li className="list-group-item">01.24 - 청년부 헌신예배</li>
                                                                                        <li className="list-group-item">01.28 - 전년 결산총회
                          제직회 오리엔테이션 </li>
                                                                                        <li className="list-group-item">02.04~11 - 신약성경 통독 모임</li>
                                                                                        <li className="list-group-item">02.25 - 임시총회 - 박상글 전도사 목사 안수건</li>
                                                                                        <li className="list-group-item">03.18~25 - 구약성경 통독 모임</li>
                                                                                        <li className="list-group-item">03.26~30 - 고난주간 특별새벽기도회</li>
                                                                                        <li className="list-group-item">03.30 - 성금요 치유기도회</li>
                                                                                        <li className="list-group-item">04.15 - 교역자 세미나 - Expository Preaching </li>
                                                                                        <li className="list-group-item">04.21 - 춘계 교회 대청소 </li>
                                                                                        <li className="list-group-item">04.22~29 - 구약성경 통독 모임</li>
                                                                                        <li className="list-group-item">05.20~27 - 구약성경 통독 모임 </li>
                                                                                        <li className="list-group-item">06.03 - 신약, 구약성경 통독 모임 마침
                          - 김동찬, 김영혜, 김숙연, 박옥희, 소재선, 소진호, 폴민,민원옥, 박대윤, 한미영, 박상글 </li>
                                                                                        <li className="list-group-item">06.21~23 - 청년부 수련회 </li>
                                                                                        <li className="list-group-item">06.24 - 박상글 전도사 목사 안수식 </li>
                                                                                        <li className="list-group-item">06.29~07.01 - 어린이부 VBS</li>
                                                                                        <li className="list-group-item">07.08 - 전교인 야외예배 </li>
                                                                                        <li className="list-group-item">07.22 - 펜윅 협동선교헌금 모금
                        </li>
                                                                                        <li className="list-group-item">08.02~04 - 밴쿠버 아일랜드 원주민 단기선교 </li>
                                                                                        <a data-toggle="collapse" href="#collapseExample8" style={{ fontSize: '15px', textDecoration: 'none' }}>
                                                                                            <li className="list-group-item btn2" >
                                                                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                                close
                                                                                        </li>
                                                                                        </a>
                                                                                    </ul>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </li>
                                                                <li className="timeline-inverted">
                                                                    <div className="timeline-image" style={{ backgroundColor: '#ffb70b' }}>
                                                                        <h4>Be Part
                        <br />Of His
                        <br />Story!</h4>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    {/* </div> */}
                                                    {/* </li> */}
                                                    {/* </div> */}
                                                    {/* </div> */}
                                                    {/* </li>
                                                            </ul> */}
                                                    {/* </div> */}
                                                    {/* </div> */}
                                                </section>



                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                              Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Modal 2 --> */}
                    <div className="portfolio-modal modal fade" id="portfolioModal2" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                    {/* <!--1r--> */}
                                </div>
                                {/* <!--close-modal--> */}

                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 mx-auto">
                                            <div className="modal-body">
                                                {/* <!-- Project Details Go Here --> */}
                                                <h2 className="text-uppercase">담임목사소개</h2>
                                                <p className="item-intro text-muted">Pastor Paul </p>

                                                {/* img slide */}
                                                <div id="portfolioModal2Indicators" className="carousel slide" data-ride="carousel">
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#portfolioModal2Indicators" data-slide-to="0" className="active"></li>
                                                    </ol>
                                                    <div className="carousel-inner ministryItem">
                                                        <div className="carousel-item active">
                                                            <img className="d-block w-100" src="img/portfolio/pastor_main.jpg" alt="First slide" />
                                                            {/* <img className="img-fluid d-block mx-auto" src="img/portfolio/pastor_main.jpg" alt="kbcv-senior-pastor" /> */}
                                                        </div>

                                                    </div>
                                                    <a className="carousel-control-prev" href="#portfolioModal2Indicators" role="button" data-slide="prev">
                                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Previous</span>
                                                    </a>
                                                    <a className="carousel-control-next" href="#portfolioModal2Indicators" role="button" data-slide="next">
                                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Next</span>
                                                    </a>
                                                </div>



                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '20px' }}>
                                                            <h4>환영합니다</h4>
                                                            <hr className="sub_hr">
                                                            </hr>

                                                            <p className="text-center">밴쿠버 한인 침례교회 홈페이지에 방문하신 여러분들을 환영합니다.</p>
                                                            <p>저희 교회는 지난 44년 동안 밴쿠버의 이민자들을 위한 지역교회의 사명을 감당하여 왔습니다.
                        예수 그리스도의 구원의 기쁜 소식은 온 세상 사람들이 들어야 합니다. 뿐만 아니라 오는 세대에게도 이 기쁜 복음의 바통을 넘겨주기 원합니다. </p>
                                                            <p>
                                                                함께 주님의 제자로서 이 일을 동역해 나아가기를 소망합니다.</p>


                                                        </div>
                                                    </div>
                                                </div>



                                                <ul className="list-inline">
                                                    <li></li>
                                                    <li></li>
                                                    <li></li>
                                                </ul>
                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Modal 3 --> */}
                    <div className="portfolio-modal modal fade" id="portfolioModal3" tabIndex={-1} role="dialog" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 mx-auto">
                                            <div className="modal-body">


                                                {/* <!-- Project Details Go Here --> */}

                                                <h2 className="text-uppercase">및 오시는 길</h2>
                                                <p className="item-intro text-muted">Service Schedule & Location</p>
                                                {/* img slide */}
                                                <div id="portfolioModal3Indicators" className="carousel slide" data-ride="carousel">
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#portfolioModal3Indicators" data-slide-to="0" className="active"></li>
                                                        <li data-target="#portfolioModal3Indicators" data-slide-to="1"></li>
                                                        <li data-target="#portfolioModal3Indicators" data-slide-to="2"></li>
                                                    </ol>
                                                    <div className="carousel-inner ministryItem">
                                                        <div className="carousel-item active">
                                                            <img className="d-block w-100" src="img/church/worship1.jpg" alt="First slide" />
                                                        </div>
                                                        <div className="carousel-item">
                                                            <img className="d-block w-100" src="img/church/worship2.jpg" alt="Second slide" />
                                                        </div>
                                                        <div className="carousel-item">
                                                            <img className="d-block w-100" src="img/church/worship3.jpg" alt="Third slide" />
                                                        </div>

                                                    </div>

                                                    <a className="carousel-control-prev" href="#portfolioModal3Indicators" role="button" data-slide="prev">
                                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Previous</span>
                                                    </a>
                                                    <a className="carousel-control-next" href="#portfolioModal3Indicators" role="button" data-slide="next">
                                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Next</span>
                                                    </a>
                                                </div>

                                            </div>
                                            {/* <!--carousel--> */}



                                            <div className="container-fluid">
                                                <div className="row" style={{ fontSize: '90%' }}>
                                                    <div className="col-12" style={{ marginTop: '20px' }}>
                                                        <h4>예배시간</h4>
                                                        <hr className="sub_hr">
                                                        </hr>

                                                    </div>
                                                </div>
                                            </div>

                                            <img className="img-fluid d-block mx-auto" src="img/portfo-contents/kbcv-schedule.png" alt="service_schedule" />



                                            {/* <!-- 예배캠페인 --> */}
                                            <div className="container-fluid">
                                                <div className="row" style={{ fontSize: '90%' }}>
                                                    <div className="col-12" style={{ marginTop: '20px' }}>
                                                        <h4>예배 캠페인</h4>
                                                        <hr className="sub_hr">
                                                        </hr>


                                                        {/* <!--유튜브영상안내--> */}
                                                        <div className="container">
                                                            <div className="embed-responsive embed-responsive-16by9">
                                                                <iframe width="560" height="315" src="https://www.youtube.com/embed/_fxcaNfWJ_I"
                                                                    frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen></iframe>
                                                            </div>
                                                            <br />
                                                            <p className="text-center text-muted"></p><br />
                                                        </div>
                                                        {/* <!--container--> */}



                                                        <div className="container text-center ">

                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <a href="#demo" data-toggle="collapse">
                                                                        <img src="img/portfo-contents/etiq.png" className=" image-responsive" style={{ width: '100%' }}
                                                                            alt="Church_Etiquette" />
                                                                    </a>

                                                                    <div id="demo" className="collapse">

                                                                        <img className="img-fluid d-block mx-auto" src="img/portfo-contents/details.png"
                                                                            alt="church_etiquette_details" />
                                                                        <p><em> 하나님은 영이시니 신령과 진정으로 예배할지니라 (요4:24) </em></p>
                                                                        <br />
                                                                        <br />
                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        {/* <!--예배캠페인 col-12 --> */}
                                                    </div>
                                                </div>




                                                {/* <!-- 오시는길 --> */}

                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                                            <h4>오시는길</h4>
                                                            <hr className="sub_hr">
                                                            </hr>

                                                        </div>
                                                    </div>
                                                </div>

                                                <br />
                                                {/* <!--유튜브영상안내--> */}
                                                <div className="container">
                                                    <div className="embed-responsive embed-responsive-16by9">
                                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/9SaDToSA9xg"
                                                            frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen></iframe>
                                                    </div>
                                                    <br />
                                                    <p className="text-center text-muted">* 3D 구글맵을 통한 교회의 모습</p><br />
                                                </div>
                                                {/* <!--container--> */}

                                                <img className="img-fluid d-block mx-auto" src="img/portfo-contents/church_location.png"
                                                    alt="church_location" />
                                                <br />


                                                {/* <!--Google map--> */}
                                                <div id="map-container-google-2" className="z-depth-1-half map-container" style={{ height: '500px' }}>

                                                    <iframe
                                                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2603.081130028239!2d-122.9725922!3d49.2748599!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5486775078c0858d%3A0xb178b97b8e1e1390!2s1005+Kensington+Ave%2C+Burnaby%2C+BC+V5B+2A6!5e0!3m2!1sen!2sca!4v1547530039053"
                                                        width="100%" height="450" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
                                                </div>

                                                {/* <!--Google Maps--> */}

                                                {/* <!-- Grid column --> */}
                                                <div className="row" style={{ fontSize: '80%' }}>
                                                    <div className="col-sm-4">
                                                        <FontAwesomeIcon icon={faHome} className="fas mr-3" />
                                                    1005 Kensington Ave. <br />Burnaby BC V5B 4B8
                    {/* </p> */}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <FontAwesomeIcon icon={faEnvelope} className="fas mr-3" />
                                                        <a href="mailto:kbcv.canada@gmail.com" target="_top">kbcv.canada@gmail.com</a>
                                                        {/* </p> */}
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <FontAwesomeIcon icon={faPhone} className="fas mr-3" />
                                                    + 01 604 438 7833</div>
                                                </div>

                                                <ul className="list-inline">
                                                    <li></li>
                                                    <li></li>
                                                    <li></li>
                                                </ul>

                                                <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                    <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                        Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* <!-- Modal 4 --> */}
                    <div className="portfolio-modal modal fade" id="portfolioModal4" tabIndex={-1} role="dialog" aria-hidden="true"
                        style={{ width: '100%' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">

                                <div className="close-modal" data-dismiss="modal">
                                    <div className="lr">
                                        <div className="rl"></div>
                                    </div>
                                </div>

                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-12 mx-auto">
                                            <div className="modal-body">

                                                {/* <!-- Project Details Go Here --> */}
                                                <h2 className="text-uppercase">교역자소개</h2>
                                                <p className="item-intro text-muted">Pastors </p>
                                                {/* img slide */}
                                                <div id="portfolioModal4Indicators" className="carousel slide" data-ride="carousel">
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#portfolioModal4Indicators" data-slide-to="0" className="active"></li>
                                                    </ol>
                                                    <div className="carousel-inner ministryItem">
                                                        <div className="carousel-item active">
                                                            <img className="d-block w-100" src="img/portfolio/04-full.jpg" alt="First slide" />
                                                            {/* <img className="img-fluid d-block mx-auto" src="img/portfolio/04-full.jpg" alt="" /> */}
                                                        </div>

                                                    </div>
                                                    <a className="carousel-control-prev" href="#portfolioModal4Indicators" role="button" data-slide="prev">
                                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Previous</span>
                                                    </a>
                                                    <a className="carousel-control-next" href="#portfolioModal4Indicators" role="button" data-slide="next">
                                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                        <span className="sr-only">Next</span>
                                                    </a>
                                                </div>


                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '50px' }}>
                                                            <h4></h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                                할레루야!<br />
                                                                KBCV 교역자분들을 소개합니다
                    </div>
                                                    </div>
                                                </div>
                                                <p></p>
                                                <p></p>

                                                <h4 className="section-heading text-uppercase" style={{ marginTop: '100px' }}> PASTORS</h4>
                                                <div className="card-group">

                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top rounded-circle" id="minister-img" src="img/team/sub01_profile01_1.jpg"
                                                            alt="Card image cap " />
                                                        <div className="card-body">
                                                            <h5 className="card-title">김동식 <small>목사</small></h5>
                                                            <p className="card-text">소망회</p>
                                                            <p className="card-text"><small className="text-muted">kbcv.canada@gmail.com</small></p>
                                                        </div>
                                                    </div>

                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top rounded-circle" id="minister-img" src="img/team/sub01_profile02.jpg"
                                                            alt="Card image cap" />
                                                        <div className="card-body">
                                                            <h5 className="card-title">박대윤 <small>목사</small></h5>
                                                            <p className="card-text">청년부 | 행정</p>
                                                            <p className="card-text"><small className="text-muted">daeyun2010<br />@ hotmail.com</small></p>
                                                        </div>
                                                    </div>

                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top rounded-circle" id="minister-img" src="img/team/sub01_profile07.jpg"
                                                            alt="Card image cap" />
                                                        <div className="card-body">
                                                            <h5 className="card-title">박상글 <small>목사</small></h5>
                                                            <p className="card-text"><small>청소년부 | 새가족 | 행정</small></p>
                                                            <p className="card-text"><small className="text-muted">prodat<br />@ naver.com</small></p>
                                                        </div>
                                                    </div>

                                                </div>

                                                <br />

                                                <div className="card-group">
                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top" src="img/team/sub01_profile05.jpg" alt="Card image cap" />
                                                        <div className="card-body">
                                                            <h5 className="card-title">한미영 <br /><small>전도사</small></h5>
                                                            <p className="card-text">어린이부</p>
                                                            <p className="card-text"><small className="text-muted">joliehmy<br />@ hotmail.com</small></p>
                                                        </div>
                                                    </div>
                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top" src="img/team/sub01_profile08.jpg" alt="Card image cap" />
                                                        <div className="card-body">
                                                            <h5 className="card-title">오성훈 <br /><small>전도사</small></h5>
                                                            <p className="card-text">찬양 | 예배</p>
                                                            <p className="card-text"><small className="text-muted">ydgos<br />@ naver.com</small></p>
                                                        </div>
                                                    </div>
                                                    <div className="card" id="card-minister">
                                                        <img className="card-img-top" src="img/team/sub01_profile06.jpg" alt="Card image cap" />
                                                        <div className="card-body">
                                                            <h5 className="card-title">신한나<br /><small>교사</small></h5>
                                                            <p className="card-text">영아부</p>
                                                            <p className="card-text"><small className="text-muted">gkddk6423<br />@ gmail.com</small></p>
                                                        </div>
                                                    </div>

                                                </div>


                                            </div>
                                            {/* </section> */}



                                            <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                    Close </button>

                                        </div>
                                        {/* <!--modalbody--> */}
                                    </div>
                                    {/* <!--modalsize 8--> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* <!-- Modal 5 섬기는사람들  --> */}
                <div className="portfolio-modal modal fade" id="portfolioModal5" tabIndex={-1} role="dialog" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="close-modal" data-dismiss="modal">
                                <div className="lr">
                                    <div className="rl"></div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-8 mx-auto">
                                        <div className="modal-body">
                                            {/* <!-- Project Details Go Here --> */}

                                            <h2 className="text-uppercase">섬기는사람들</h2>
                                            <p className="item-intro text-muted">Ordained Deacon </p>
                                            {/* img slide */}
                                            <div id="portfolioModal5Indicators" className="carousel slide" data-ride="carousel">
                                                <ol className="carousel-indicators">
                                                    <li data-target="#portfolioModal5Indicators" data-slide-to="0" className="active"></li>
                                                </ol>
                                                <div className="carousel-inner ministryItem">
                                                    <div className="carousel-item active">
                                                        <img className="d-block w-100" src="img/portfolio/05-full.jpg" alt="First slide" />
                                                        {/* <img className="img-fluid d-block mx-auto" src="img/portfolio/05-full.jpg" alt="" /> */}
                                                    </div>

                                                </div>
                                                <a className="carousel-control-prev" href="#portfolioModal5Indicators" role="button" data-slide="prev">
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                                <a className="carousel-control-next" href="#portfolioModal5Indicators" role="button" data-slide="next">
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </div>



                                            {/* <!--제직--> */}
                                            <section id="Deacon">
                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '10px' }}>
                                                            <h4>제직회소개</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                                            제직회분들을 소개합니다

                      </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="container">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th><small><strong></strong></small></th>
                                                                <th>Name</th>
                                                                <th>Position</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>01</td>
                                                                <td>소 태 영</td>
                                                                <td>회 장</td>

                                                            </tr>
                                                            <tr>
                                                                <td>02</td>
                                                                <td>이 해 준</td>
                                                                <td>총 무</td>

                                                            </tr>
                                                            <tr>
                                                                <td>03</td>
                                                                <td>정 경 민</td>
                                                                <td>서 기</td>

                                                            </tr>
                                                            <tr>
                                                                <td>04</td>
                                                                <td>김 동 국<br /></td>
                                                                <td>재 정 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>05</td>
                                                                <td>정 경 민<br /><small>부팀장</small></td>
                                                                <td>재 정 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>06</td>
                                                                <td>김 영 민<br /><small>부팀장</small></td>
                                                                <td>재 정 부</td>

                                                            </tr>

                                                            <tr>
                                                                <td>07</td>
                                                                <td>류 인 권</td>
                                                                <td>예 배 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>08</td>
                                                                <td>김 종 직<br /><small>부팀장</small></td>
                                                                <td>예 배 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>09</td>
                                                                <td>임 세 웅<br /></td>
                                                                <td>구역&새가족부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>10</td>
                                                                <td>소 태 영</td>
                                                                <td>선 교 부<br /></td>

                                                            </tr>
                                                            <tr>
                                                                <td>11</td>
                                                                <td>장 성 업</td>
                                                                <td>전 도 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>12</td>
                                                                <td>박스티브</td>
                                                                <td>관 리 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>13</td>
                                                                <td>김효근<br /><small>부팀장</small></td>
                                                                <td>관 리 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>14</td>
                                                                <td>김 영 민</td>
                                                                <td>교 육 부</td>

                                                            </tr>
                                                            <tr>
                                                                <td>15</td>
                                                                <td>양 희 찬</td>
                                                                <td>멀티미디어</td>

                                                            </tr>
                                                            <tr>
                                                                <td>16</td>
                                                                <td>임 광 희<br /><small>부팀장</small></td>
                                                                <td>멀티미디어</td>

                                                            </tr>
                                                            <tr>
                                                                <td>17</td>
                                                                <td>이 해 준</td>
                                                                <td>성가대장</td>
                                                            </tr>



                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* <!--안수집사소개--> */}
                                            <section id="Deacon">
                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '10px' }}>
                                                            <h4>안수집사소개</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                                            안수집사분들을 소개합니다

                      </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="container">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th><small><strong></strong></small></th>
                                                                <th>Name</th>
                                                                <th>Position</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>01</td>
                                                                <td>정 평 진</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>02</td>
                                                                <td>류 인 권</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>03</td>
                                                                <td>이 해 준</td>
                                                                <td>안수집사</td>

                                                            </tr>

                                                            <tr>
                                                                <td>04</td>
                                                                <td>김 동 국</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>05</td>
                                                                <td>임 세 웅</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>06</td>
                                                                <td>김 효 근</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>07</td>
                                                                <td>소 태 영</td>
                                                                <td>안수집사</td>

                                                            </tr>
                                                            <tr>
                                                                <td>08</td>
                                                                <td>장 성 업</td>
                                                                <td>안수집사</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* <!--은퇴안수집사소개--> */}
                                            <section id="Deacon">
                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '10px' }}>
                                                            <h4>은퇴안수집사소개</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                                              은퇴안수집사분들을 소개합니다
                        <br />* 장로로 호칭함

                      </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="container">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th><small><strong></strong></small></th>
                                                                <th>Name</th>
                                                                <th>Position</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>01</td>
                                                                <td>김 요 섭</td>
                                                                <td>장 로</td>

                                                            </tr>
                                                            <tr>
                                                                <td>02</td>
                                                                <td>문 경 린</td>
                                                                <td>장 로</td>

                                                            </tr>
                                                            <tr>
                                                                <td>03</td>
                                                                <td>서 상 오</td>
                                                                <td>장 로</td>

                                                            </tr>

                                                            <tr>
                                                                <td>04</td>
                                                                <td>서 영 석</td>
                                                                <td>장 로</td>

                                                            </tr>
                                                            <tr>
                                                                <td>05</td>
                                                                <td>소 진 호</td>
                                                                <td>장 로</td>

                                                            </tr>
                                                            <tr>
                                                                <td>06</td>
                                                                <td>양 주 석</td>
                                                                <td>장 로</td>

                                                            </tr>
                                                            <tr>
                                                                <td>07</td>
                                                                <td>유 승 환</td>
                                                                <td>장 로</td>
                                                            </tr>
                                                            <tr>
                                                                <td>08</td>
                                                                <td>한 상 철</td>
                                                                <td>장 로</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>



                                            {/* <!-- 찬양 & 예배팀--> */}

                                            <section id="Deacon">
                                                <div className="container-fluid">
                                                    <div className="row" style={{ fontSize: '90%' }}>
                                                        <div className="col-12" style={{ marginTop: '10px' }}>
                                                            <h4>찬양&예배팀소개</h4>
                                                            <hr className="sub_hr">
                                                            </hr>
                                                                                  팀명 : 헤세드(Hesed)<br />



                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="container">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th><small><strong></strong></small></th>
                                                                <th>Name</th>
                                                                <th>Position</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>01</td>
                                                                <td>오 성 훈</td>
                                                                <td>인도자</td>

                                                            </tr>
                                                            <tr>
                                                                <td>02</td>
                                                                <td>임 광 희</td>
                                                                <td>베이스</td>

                                                            </tr>
                                                            <tr>
                                                                <td>03</td>
                                                                <td>김 원 식</td>
                                                                <td>베이스</td>

                                                            </tr>
                                                            <tr>
                                                                <td>04</td>
                                                                <td>김 영 민</td>
                                                                <td>드 럼</td>

                                                            </tr>
                                                            <tr>
                                                                <td>05</td>
                                                                <td>최 용 락</td>
                                                                <td>일렉기타</td>

                                                            </tr>
                                                            <tr>
                                                                <td>06</td>
                                                                <td>이 윤 지</td>
                                                                <td>건반1</td>

                                                            </tr>
                                                            <tr>
                                                                <td>07</td>
                                                                <td>신 한 나</td>
                                                                <td>건반2</td>

                                                            </tr>
                                                            <tr>
                                                                <td>08</td>
                                                                <td>성 자 인</td>
                                                                <td>건반3</td>

                                                            </tr>
                                                            <tr>
                                                                <td>09</td>
                                                                <td>김 인</td>
                                                                <td>건반4</td>

                                                            </tr>
                                                            <tr>
                                                                <td>10</td>
                                                                <td>백 선 희</td>
                                                                <td>건반5</td>

                                                            </tr>
                                                            <tr>
                                                                <td>11</td>
                                                                <td>박 수 자</td>
                                                                <td>싱 어</td>

                                                            </tr>
                                                            <tr>
                                                                <td>12</td>
                                                                <td>구 은 영</td>
                                                                <td>싱 어</td>

                                                            </tr>
                                                            <tr>
                                                                <td>13</td>
                                                                <td>양 희 찬</td>
                                                                <td>싱 어</td>

                                                            </tr>
                                                            <tr>
                                                                <td>14</td>
                                                                <td>양채은</td>
                                                                <td>싱 어</td>
                                                            </tr>
                                                            <tr>
                                                                <td>15</td>
                                                                <td>양윤주</td>
                                                                <td>싱 어</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <br />

                                            <ul className="list-inline" style={{ fontSize: '80%' }}>
                                                <li>* 밴쿠버한인침례교회 찬양팀 "헤세드"는 예배가 회복되고,
                    <br />이를 통해 모든이들이 하나님을 만날 수 있도록 함께 기도하고 예배합니다.</li><p>
                                                    <li>참다운 예배를 추구하며 하나님의 마음을 가지고 함께 예배드리길 원하시는 모든 분들을 초청합니다.</li>
                                                </p><p>
                                                    <li>연습 : 매주 금요일/주일 </li>
                                                </p>
                                            </ul>



                                            <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                    Close </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Modal 6 cell & life group--> */}
                <div className="portfolio-modal modal fade" id="portfolioModal6" tabIndex={-1} role="dialog" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="close-modal" data-dismiss="modal">
                                <div className="lr">
                                    <div className="rl"></div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 mx-auto">
                                        <div className="modal-body">
                                            {/* <!-- Project Details Go Here --> */}
                                            <h2 className="text-uppercase">구역모임소개</h2>
                                            <p className="item-intro text-muted">Cell Group</p>

                                            {/* img slide */}
                                            <div id="portfolioModal6Indicators" className="carousel slide" data-ride="carousel">
                                                <ol className="carousel-indicators">
                                                    <li data-target="#portfolioModal6Indicators" data-slide-to="0" className="active"></li>
                                                </ol>
                                                <div className="carousel-inner ministryItem">
                                                    <div className="carousel-item active">
                                                        <img className="d-block w-100" src="img/portfolio/06-full.jpg" alt="First slide" />
                                                        {/* <img className="img-fluid d-block mx-auto" src="img/portfolio/06-full.jpg" alt="" /> */}
                                                    </div>

                                                </div>
                                                <a className="carousel-control-prev" href="#portfolioModal6Indicators" role="button" data-slide="prev">
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="sr-only">Previous</span>
                                                </a>
                                                <a className="carousel-control-next" href="#portfolioModal6Indicators" role="button" data-slide="next">
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="sr-only">Next</span>
                                                </a>
                                            </div>



                                            <div className="container-fluid">
                                                <div className="row" style={{ fontSize: '90%' }}>
                                                    <div className="col-12" style={{ marginTop: '20px' }}>
                                                        <h4>Cell Group</h4>
                                                        <hr className="sub_hr">
                                                        </hr>
                                                        <p> </p>


                                                    </div>
                                                </div>
                                            </div>



                                            <div className="row">
                                                <div className="col-sm">
                                                    <p><strong>소망회1</strong><br />
                                                        <strong>리더 : 김준기&한양자</strong><br />
                                                                                          박옥희,김요섭,김윤주,김명자<br />
                                                                                          남애희,민병희,서영석,전복단<br />
                                                                                          양주석,최인숙,이한규,정영숙,제갈순이</p>
                                                </div>

                                                <div className="col-sm">
                                                    <p><strong>소망회2</strong><br />
                                                        <strong>리더 : 김준기&한양자</strong><br />
                                                                                          정길자,박경환,갈정무,안옥선<br />
                                                                                          유승환,유은정,김동식,김봉희<br />
                                                                                          박봉주,백정해,박지균,이경순<br />
                                                                                          김민숙,김경자</p>
                                                </div>



                                                <div className="col-sm">
                                                    <p><strong>청지기</strong><br />
                                                        <strong>리더 : 서상오&허윤금</strong><br />
                                                                                          김동식,김숙연,문경린,윤석녀<br />
                                                                                          한상철,최청순,소진호,소재선<br />
                                                                                          정이영,임재옥,정윤희,김화자<br />
                                                                                          조태문,이형민,유동수,유경실<br />
                                                                                          유남선,김효근,한양자</p>
                                                </div>
                                            </div>

                                            <hr>
                                            </hr>
                                            <div className="row">
                                                <div className="col-sm">
                                                    <p><strong>버나비</strong><br />
                                                        <strong>리더 : 김효근&남명희</strong><br />
                                                                                          박준식,박석남,김기종,김영순A<br />
                                                                                          유병철,우미순,손승수,손진자<br />
                                                                                          장성업,김난희,김규봉,김경란<br />
                                                                                          황태하,김 경,임춘배,임영선<br />
                                                                                          김영순B</p>
                                                </div>


                                                <div className="col-sm">
                                                    <p><strong>코퀴틀람1</strong><br />
                                                        <strong>리더 : 류인권&오향근</strong><br />
                                                                                          이해준,이명순,박서진,김정원<br />
                                                                                          최원준,최우진,유남선,유영애<br />
                                                                                          변인호,변현옥,함상우,함영국<br />
                                                                                          박스티브,김소희,황미영,최연흥<br />
                                                                                          강진구</p>
                                                </div>

                                                <div className="col-sm">
                                                    <p><strong>코퀴틀람2</strong><br />
                                                        <strong>리더 : 김동국&안미선</strong><br />
                                                                                          조서진,여민영,박수웅,송원정<br />
                                                                                          김원식,김인,김미미,윌리암이<br />
                                                                                          정정례,윌리암,한미영</p>

                                                </div>
                                            </div>

                                            <hr>
                                            </hr>

                                            <div className="row">
                                                <div className="col-sm">
                                                    <p><strong>리치몬드1</strong><br />
                                                        <strong>리더 : 소태영&송민자</strong><br />
                                                                                          임세웅,구은영,이희철,안봉선<br />
                                                                                          현기훈,김귀선,채종헌,최은영<br />
                                                                                          김향숙,폴첸,정평진,임경선<br />
                                                                                          조항원,조호정,시즈미에쯔오,오안나</p>
                                                </div>

                                                <div className="col-sm">
                                                    <p><strong>디모데1</strong><br />
                                                        <strong>리더 : 임광희&이윤지</strong><br />
                                                                                          윤성배,윤지혜,엄태건,전혜진<br />
                                                                                          양채은,김태은</p>
                                                </div>

                                                <div className="col-sm">
                                                    <p><strong>디모데2</strong><br />
                                                        <strong>리더 : 김종직&양윤주</strong><br />
                                                                                          최용락,신한나,스텔라팽,버라드강<br />
                                                                                          이동은</p>
                                                </div>
                                            </div>

                                            <hr>
                                            </hr>

                                            <div className="row">

                                                <div className="col-sm">
                                                    <p><strong>디모데3</strong><br />
                                                        <strong>리더 : 정경민&성자인</strong><br />
                                                                                          민병일,허은미,김인수,노여진<br />
                                                                                          김성환,박진희,정혜수</p>
                                                </div>

                                                <div className="col-sm">
                                                    <p><strong>디모데4</strong><br />
                                                        <strong>리더 : 양희찬&백선희</strong><br />
                                                                                          김영민,김민소,조성훈,이은정<br />
                                                                                          김종혁,윤주영</p>
                                                </div>


                                                <div className="col-sm">
                                                    <p><strong>청년구역1</strong><br />
                                                        <strong>리더 : 장예림</strong><br />
                                                                                          김한솔,김주만,김연수,도현혜<br />
                                                                                          박민주,박효인,이규혜,이재하<br />
                                                                                          황성호,노희상</p>
                                                </div>

                                            </div>



                                            <ul className="list-inline">
                                                <li> </li>
                                                <li> </li>
                                                <li> </li>
                                            </ul>
                                            <button className="btn btn-primary" data-dismiss="modal" type="button">
                                                <FontAwesomeIcon icon={faTimes} className="fas" style={{ marginRight: 5 }} />
                                                                                      Close </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            // </div>
        );
    }
}
export default MainPage;
