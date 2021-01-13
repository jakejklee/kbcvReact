import React, { Component, useState } from 'react';
import { Image, Modal, Button, Row, Col, Form, Pagination, Spinner, Carousel } from 'react-bootstrap';
import './PhotoAlbum.css'
import PhotoEdit from './PhotoEdit'
import $ from 'jquery'
import firebase from '../firebase/firebase';
import strings from './strings';
// import _ from 'lodash';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComments } from '@fortawesome/free-solid-svg-icons';

interface Props {
}
interface State {
    uploadModal: boolean;
    deleteModal: boolean;
    editModal: boolean;
    photoArr: any;
    albumTitle: string;
    editTitle: string;
    albumTitleArr: any;
    photoListArr: any;
    uploadingSpinner: boolean;
    currentTitle: any;
    photoPreview: string;
    currentDate: any;
    albumObj: any;
    currentObj: any;
    editObj: any;
    user: boolean;
    photoId: string;
}
const db = firebase.firestore();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// const primaryColor = '#5D7F9D';
class PhotoModal extends Component<Props, State> {
    public state: State;
    constructor(props: any) {
        super(props);
        this.state = {
            uploadModal: false,
            deleteModal: false,
            editModal: false,
            photoArr: [],
            albumTitle: '',
            editTitle: '',
            albumTitleArr: [],
            photoListArr: [],
            uploadingSpinner: false,
            currentTitle: '',
            photoPreview: '',
            currentDate: '',
            albumObj: {},
            currentObj: {},
            editObj: {},
            user: false,
            photoId: '',

        }
    }

    componentDidMount = () => {
        const titleListObj: any = {};
        db.collection('images').orderBy('createdAt', 'desc').get()
            .then((result) => {
                for (let i = 0; i < result.docs.length; i++) {
                    let obj = {}
                    const dataID = result.docs[i].id
                    const fullTime = new Date(result.docs[i].data().createdAt.seconds * 1000);
                    const simpleTime = monthNames[fullTime.getMonth()] + '.' +
                        fullTime.getDate() + '.' +
                        fullTime.getFullYear()
                    // console.log(monthNames[time.getMonth()] + '.' +
                    //     time.getDate() + '.' +
                    //     time.getFullYear())
                    obj = {
                        id: dataID,
                        title: result.docs[i].data().title,
                        date: simpleTime,

                    }
                    // .push(dataID, result.docs[i].data().title, simpleTime)
                    db.collection('images').doc(result.docs[i].id).collection('url')
                        .orderBy('name', 'asc').get().then((e) => {
                            for (let j = 0; j < e.docs.length; j++) {
                                let key = e.docs[j].id;
                                Object.assign(obj, { [key]: [e.docs[j].data().downUrl, e.docs[j].data().name] });
                                // obj[e.docs[j].id] = e.docs[j].data().downUrl
                                // arr.push(e.docs[j].data().downUrl);
                            }

                            if (i === 0) {
                                this.getPhotoList(obj)
                                // console.log(obj)
                            }
                        });
                    titleListObj[i] = obj;
                    // Object.assign(titleListObj, {  : arr });
                }
                this.setState({ albumObj: titleListObj })

            }).catch((err: any) => {
                console.log(err)
            })

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: true })
            } else {
                this.setState({ user: false })

                console.log('users not logged in')
            }
        });
    }

    shouldComponentUpdate(nextProps: any) {
        return nextProps === this.props
    }

    // private renderFooter = (title: string) => {
    //     const dataArr = [];
    //     const data = <Row style={{ width: '100%' }}>
    //         <Col xs={1} style={{ textAlign: 'center' }}>1</Col>
    //         <Col xs={9}>{title}</Col>
    //         <Col xs={2}>2020-Jan-03</Col>
    //     </Row>;
    //     for (let i = 0; i < 5; i++) {
    //         // dataArr.push(data);
    //         i === 0 ?
    //             dataArr.push(
    //                 <Row style={{ width: '100%', margin: 'auto' }}>
    //                     <Col xs={1} style={{ textAlign: 'center' }}>1</Col>
    //                     <Col xs={9}>{title + i + '123'}</Col>
    //                     <Col xs={2}>2020-Jan-03</Col>
    //                 </Row>
    //             )
    //             :
    //             dataArr.push(
    //                 <Row style={{ width: '100%', borderTop: '1px solid black', margin: 'auto' }}>
    //                     <Col xs={1} style={{ textAlign: 'center' }}>1</Col>
    //                     <Col xs={9}>{title + i + '123'}</Col>
    //                     <Col xs={2}>2020-Jan-03</Col>
    //                 </Row>
    //             )
    //     }
    //     return (
    //         dataArr
    //     );
    // }

    private photoHandleChange = (e: any) => {
        // this.setState({ email: mail });
        console.log(e.target.files)
        this.setState({ photoArr: e.target.files })

    }

    private titleHandleChange(title: string) {
        this.setState({ albumTitle: title });
    }
    private editTitleHandleChange(title: string) {
        this.setState({ editTitle: title });
    }

    private uploadPhotos = () => {
        this.setState({ uploadingSpinner: true });
        let today = new Date();
        // const currentDay = monthNames[today.getMonth()] + '.' +
        //     today.getDate() + '.' +
        //     today.getFullYear();

        const storageRef = firebase.storage().ref();

        db.collection('images').add({
            createdAt: today,
            title: this.state.albumTitle,
        }).then((result: any) => {
            for (let i = 0; i < this.state.photoArr.length; i++) {
                storageRef.child('images/' + result.id + '/' + this.state.photoArr[i].name)
                    .put(this.state.photoArr[i]).then((snapshot: any) => {
                        snapshot.ref.getDownloadURL().then((url: any) => {
                            db.collection('images').doc(result.id).collection('url').add({
                                downUrl: url,
                                name: this.state.photoArr[i].name
                            })
                                .then(() => {
                                    // if (i === this.state.photoArr.length - 1) {
                                    db.collection('images').doc(result.id).collection('url').get()
                                        .then((e) => {
                                            if (e.docs.length === this.state.photoArr.length) {
                                                window.location.reload(false)
                                            }
                                        })
                                    // this.setState({ uploadingSpinner: false, uploadModal: false })
                                    // }

                                })
                        })
                    });
            }
        });

    }

    private deletePhotos = () => {
        console.log(this.state.currentObj)
        // console.log(obj)
        db.collection('images').doc(this.state.currentObj.id).delete()
            .then((result) => {

                // const photoList: any = [];
                const objKeys = Object.keys(this.state.currentObj)
                const currentLength = objKeys.length - 1
                // console.log(obj)

                for (let i = 0; i < Object.keys(this.state.currentObj).length; i++) {
                    if (objKeys[i] != 'id' && objKeys[i] != 'date' && objKeys[i] != 'title') {
                        let photoKey = objKeys[i];
                        let imgRef = firebase.storage().refFromURL(this.state.currentObj[photoKey][0]);
                        imgRef.delete().then((result) => {
                            console.log(i)
                            console.log(currentLength)
                            if (i === currentLength) {
                                this.setState({ deleteModal: false })
                            }
                            if (this.state.deleteModal === false) {
                                window.location.reload(false);
                            }

                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                }
                // for (let i = 3; i < this.state.currentObj.length; i++) {
                //     let imgRef = firebase.storage().refFromURL(this.state.currentObj[i]);
                //     imgRef.delete().then((result) => {
                //         console.log(i)
                //         console.log(this.state.currentObj.length - 1)
                //         if (i === this.state.currentObj.length - 1) {
                //             this.setState({ deleteModal: false })
                //         }
                //         if (this.state.deleteModal === false) {
                //             window.location.reload(false);
                //         }

                //     }).catch((err) => {
                //         console.log(err)
                //     })
                // }
            })

    }

    private getPhotoList = (obj: any) => {
        // const carousel = document.getElementById('mainCar');
        // if (carousel) {
        //     const data = carousel.innerHTML
        //     $(carousel).html(data)

        // }
        // console.log(obj)
        const id = obj.id
        const photoList: any = [];
        const objKeys = Object.keys(obj)
        // console.log(obj)

        for (let i = 0; i < Object.keys(obj).length; i++) {
            if (objKeys[i] != 'id' && objKeys[i] != 'date' && objKeys[i] != 'title') {
                let photoKey = objKeys[i]
                photoList.push(obj[photoKey][0])
                // console.log(obj[photoKey])
            }
        }
        this.setState({ photoListArr: photoList, currentTitle: obj.title, currentObj: obj })


        // for (let i = 0; i < Object.keys(this.state.albumObj).length; i++) {
        //     if (Object.values(this.state.albumObj[i])[0] === id) {
        //         const data = this.state.albumObj[i]
        //         for (let j = 3; j < data.length; j++) {
        //             photoList.push(data[j]);
        //         }
        //         this.setState({ photoListArr: photoList, currentTitle: obj.title, currentObj: obj })
        //     }
        // }
    }

    private clickEdit = (obj: any) => {
        console.log(obj)
        this.setState({ editObj: obj });
        this.setState({ editTitle: obj[1] });
        this.setState({ editModal: true });


    }
    // const ref = firebase.storage().ref().child('images/' + title);
    // ref.listAll().then((res) => {
    //     // firebase.storage().ref().child('images/'+this.state.albumTitleArr[0])
    //     res.items.forEach((photo) => {
    //         const path = firebase.storage().ref().child('images/' + title + '/' + photo.name)
    //         console.log(path)
    //         path.getDownloadURL().then((url) => {
    //             photoList.push(url);
    //             const temp = title.split(';');
    //             let tempTitle;
    //             let tempDate;
    //             console.log(url)
    //             if (temp.length > 1) {
    //                 for (let i = 1; i < temp.length; i++) {
    //                     if (i === 1) {
    //                         tempTitle = temp[i]
    //                     } else {
    //                         tempTitle = tempTitle + ';' + temp[i];
    //                     }
    //                 }
    //                 // tempTitle = temp[1];
    //                 tempDate = temp[0];
    //             } else {
    //                 tempTitle = temp
    //             }
    //             this.setState({ photoListArr: photoList, currentTitle: tempTitle, currentDate: tempDate })
    //         })
    //     })

    // })



    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    // if (photoListArr.length > 0) {

    //     this.setState({ albumTitleArr: photoListArr });
    // }
    // return photoListArr;

    // private displayPhotos = () => {
    //     const photos = [];


    //     return photos
    // }

    private togglePhoto = (obj: any) => {
        console.log(obj)
        if (obj.id === this.state.photoId) {

            this.setState({ photoId: '' });
        } else {

            this.setState({ photoId: obj.id });
        }
        this.getPhotoList(obj);
    }
    private clickDeleteBtn = (obj: any) => {
        console.log(obj)
        this.setState({ currentObj: obj });
        this.setState({ deleteModal: true })

    }

    private displayAlbumTitle = () => {
        const titleArr = []

        if (Object.keys(this.state.albumObj).length > 0) {
            for (let i = 0; i < Object.keys(this.state.albumObj).length; i++) {
                // const id: string = Object.values(this.state.albumObj[i])[0] as string;
                const id: string = this.state.albumObj[i].id
                const title = this.state.albumObj[i].title
                const date = this.state.albumObj[i].date
                const obj = this.state.albumObj[i]

                // const title: string = Object.values(this.state.albumObj[i])[1] as string;
                // const date: string = Object.values(this.state.albumObj[i])[2] as string;
                // for (let i = 0; i < this.state.albumTitleArr.length; i++) {
                titleArr.push(
                    <Row key={Object.keys(this.state.albumObj)[i]}
                        style={{
                            width: '100%', borderBottom: '1px solid #e4e4e4', padding: '7px 0'
                        }}>
                        <Col sm={8}>
                            {/* <label onClick={() => { this.getPhotoList(this.state.albumObj[i]) }} */}
                            <label onClick={() => { this.togglePhoto(obj) }}
                                style={{ cursor: 'pointer', }}>
                                {title}
                            </label>
                        </Col>
                        <Col sm={this.state.user ? 2 : 4} className='text-center' style={{ color: '#bdbdbd' }}>
                            {date}

                        </Col>

                        {
                            this.state.user ?
                                <Col sm={'auto'}>
                                    <Button style={{ marginLeft: 10 }}
                                        onClick={() => { this.clickEdit(this.state.albumObj[i]) }}>수정</Button>
                                    <Button style={{ marginLeft: 10 }} variant='danger'
                                        // onClick={() => { this.deletePhotos(this.state.albumObj[i]) }}>삭제</Button>
                                        onClick={() => { this.clickDeleteBtn(this.state.albumObj[i]) }}>삭제</Button>
                                </Col>
                                :
                                null
                        }
                        {
                            this.state.photoId === id ?
                                <Row style={{ margin: 'auto', width: '100%', marginTop: 15 }}>
                                    <Col>
                                        <div>
                                            {this.displayPhotoCarousel()}
                                        </div>
                                    </Col>
                                </Row>
                                :
                                null
                        }

                    </Row>
                )
            }
        } else {
            titleArr.push(
                <div style={{
                    paddingTop: '30px',
                    margin: 'auto',
                    fontWeight: 'bold',
                    fontSize: 'x-large'
                }}>사진을 올려주세요</div>
            );
        }
        return titleArr;

    }
    private displayPhotos = () => {
        const photoArr = []
        for (let i = 0; i < this.state.photoListArr.length; i++) {
            photoArr.push(
                <Row style={{ width: '50%', margin: 'auto' }}>
                    <Col>
                        <Image src={this.state.photoListArr[i]} style={{ height: '100%', width: '100%' }} />
                    </Col>

                </Row>
            )
        }
        return photoArr;
    }

    private gettingImages = () => {
        // for (let i = 0; i < this.state.photoListArr.length; i++) {
        //     const temp = document.getElementsByClassName(i + 'item')
        //     console.log($(temp)[0])
        //     if (i === 0) {
        //         $(temp). addClass('active');

        //     } else {
        //         $(temp).removeClass('active');
        //     }
        // }
        // const mainCar = document.getElementsByClassName('0item')
        const imgArr = [];
        for (let i = 0; i < this.state.photoListArr.length; i++) {
            imgArr.push(
                <Carousel.Item className={i + 'item'} style={{ height: '100%', width: '100%' }}>
                    {/* <Image src={this.state.photoListArr[i]} style={{ height: '100%', width: 'auto' }} /> */}
                    <Image src={this.state.photoListArr[i]} style={{ minHeight: window.innerWidth * 0.4, maxHeight: '100%', maxWidth: '100%' }} />
                </Carousel.Item>
            )
        }
        return imgArr;
    }
    private displayPhotoCarousel = () => {
        const carouselHeight = window.innerWidth * 0.4;
        const mobileStyle = { width: '100%', margin: 'auto' }
        // const mobileStyle = { height: window.innerHeight * 0.5, width: '100%', margin: 'auto' }
        console.log(window.innerWidth)
        console.log(window.innerHeight)
        // const imageIndicator = document.getElementsByClassName('carousel-indicators').style
        return (
            <Row>
                {/* <Row style={{ margin: '20px 0', width: '100%' }}>
                    <Col style={{ fontSize: '30px', borderBottom: '1px solid #e4e4e4', }}>
                        {this.state.currentTitle}
                        {
                            this.state.user ?
                                <Button variant='danger' style={{ float: 'right' }}
                                    onClick={() => { this.setState({ deleteModal: true }) }}>삭제</Button>
                                :
                                null
                        }
                    </Col>
                </Row> */}
                <Carousel id='mainCar' slide={false} indicators={window.innerWidth < 770 ? false : true}
                    style={window.innerHeight < window.innerWidth ?
                        { height: carouselHeight, margin: 'auto', width: '100%' }
                        :
                        mobileStyle}>
                    {this.gettingImages()}
                </Carousel>
                {/* <Carousel id='mainCar' slide={false}
                    style={{ height: carouselHeight, margin: 'auto', width: '100%' }}>

                    {this.gettingImages()}
                </Carousel> */}
                {/* <div className='carousel slide' style={{height:500, margin:'auto'}}>
                    
                    {this.gettingImages()}
                </div> */}
            </Row>
        )
    }

    private renderPreviews = () => {
        let previewArr = [];
        if (this.state.photoArr[0]) {

            for (let i = 0; i < this.state.photoArr.length; i++) {
                let preview = URL.createObjectURL(this.state.photoArr[i]);
                previewArr.push(<Image style={{ width: '70%', marginTop: 10, borderRadius: 5, border: '1px solid #e4e4e4' }} src={preview}></Image>)
            }
        }
        return previewArr;
    }
    private renderEditPreviews = () => {
        const id = this.state.editObj.id
        const previewArr: any = [];
        const objKeys = Object.keys(this.state.editObj)
        // console.log(obj)

        for (let i = 0; i < Object.keys(this.state.editObj).length; i++) {
            // console.log('in?')
            if (objKeys[i] != 'id' && objKeys[i] != 'date' && objKeys[i] != 'title') {
                let photoKey = objKeys[i]
                // photoList.push(this.state.editObj[photoKey])
                console.log(this.state.editObj[photoKey])
                const imgSrc = this.state.editObj[photoKey]

                previewArr.push(
                    <Image style={{ width: '70%', marginTop: 10, borderRadius: 5, border: '1px solid #e4e4e4' }}
                        src={imgSrc} onClick={() => { this.removePic(photoKey) }} />
                )
            }
        }

        return previewArr;
    }

    private removePic = (key: any) => {

        console.log(key)
        db.collection('images').doc(this.state.editObj.id).collection('url').doc(key).delete()
            .then(() => {
                console.log()
            })

    }
    render() {
        return (
            <div>

                <Row id='photoBody' style={{ margin: 'auto' }}>
                    <Col>
                        {/* {
                            this.state.photoListArr[0] ?
                                <div>
                                    {this.displayPhotoCarousel()}
                                </div>
                                :
                                null

                        } */}
                        <div>
                            <Row style={{ marginLeft: 15, }}>
                                <Row style={{
                                    width: '100%', marginTop: 20, borderTop: '1px solid #bbb',
                                    padding: '10px 0', borderBottom: '1px solid #e4e4e4',
                                }} className='text-center'>
                                    <Col sm={8}>
                                        Title
                                    </Col>
                                    <Col sm={this.state.user ? 2 : 4}>
                                        Date
                                    </Col>
                                </Row>
                                {this.displayAlbumTitle()}
                            </Row>
                        </div>
                        <Row style={{ margin: '10px 0' }}>
                            <Col>
                                {
                                    this.state.user ?
                                        <Button style={{ float: 'right', marginRight: '10%' }}
                                            onClick={() => { this.setState({ uploadModal: true }) }}>사진올리기</Button>
                                        :
                                        null
                                }

                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Modal
                    size="lg"
                    show={this.state.uploadModal}
                    onHide={() => { this.setState({ uploadModal: false }) }}
                // aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            사진 올리기
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group controlId="formBasicLink">
                            <Form.Label>Album Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title"
                                onChange={(e: any) => { this.titleHandleChange(e.target.value) }} />
                        </Form.Group>
                        <Form>
                            <Form.File
                                id="formcheck-api-regular"

                            >
                                <Form.File.Input
                                    multiple onChange={(e: any) => { this.photoHandleChange(e) }}></Form.File.Input>
                            </Form.File>
                            <div style={{ marginTop: 10 }}>
                                {
                                    this.state.albumTitle !== '' && this.state.photoArr.length > 0 && !this.state.uploadingSpinner ?
                                        <Button onClick={() => { this.uploadPhotos() }}
                                            style={{ float: 'right', marginRight: '10%' }}>
                                            Upload
                                        </Button>
                                        :
                                        <Button id='disabledUploadBtn' disabled style={{ float: 'right', marginRight: '10%' }}>
                                            {
                                                this.state.uploadingSpinner ?
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                    :
                                                    'Upload'
                                            }</Button>
                                }
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            {
                                this.state.photoArr[0] ?
                                    this.renderPreviews()
                                    :
                                    null
                            }
                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal
                    size="lg"
                    show={this.state.editModal}
                    onHide={() => { this.setState({ editModal: false }) }}
                // aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            글 수정
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PhotoEdit
                            obj={this.state.editObj}
                        ></PhotoEdit>
                    </Modal.Body>
                </Modal>

                <Modal
                    size="sm"
                    show={this.state.deleteModal}
                    onHide={() => { this.setState({ deleteModal: false }) }}
                // aria-labelledby="example-modal-sizes-title-sm"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            삭제
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>삭제하시겠습니까?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { this.setState({ deleteModal: false }) }}>
                            취소
                        </Button>
                        <Button variant="danger" onClick={() => { this.deletePhotos() }}>
                            삭제
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        );
        // } else {
        //     return (
        //         <div>loading</div>
        //     );
        // }
    }
}
export default PhotoModal;