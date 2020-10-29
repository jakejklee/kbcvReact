import React, { Component, useState } from 'react';
import { Image, Modal, Button, Row, Col, Form, Pagination, Spinner, Tabs, Tab, Table, Container, TabPane } from 'react-bootstrap';
import './PhotoAlbum.css'
// import $ from 'jquery'
import firebase from '../firebase/firebase';
// import _ from 'lodash';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faComments } from '@fortawesome/free-solid-svg-icons';

interface Props {
    photos: any
}
interface State {
    photoArr: any;
    isHover: boolean;
    delArr: any;
    albumTitle: string;
    link: string;
    isUpdating: boolean;
    loadingDelPage: boolean;
}
const db = firebase.firestore();
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// const primaryColor = '#5D7F9D';
class MainEditor extends Component<Props, State> {
    public state: State;
    constructor(props: any) {
        super(props);
        this.state = {
            photoArr: [],
            delArr: [],
            isHover: false,
            albumTitle: '',
            isUpdating: false,
            loadingDelPage: false,
            link: '',
        }
    }

    private gettingImageData = (editObj: any) => {
        const photoArr: any = [];

        // console.log(editObj)
        const objKeys = Object.keys(editObj)
        for (let i = 0; i < Object.keys(editObj).length; i++) {
            if (objKeys[i] != 'id' && objKeys[i] != 'date' && objKeys[i] != 'title') {
                let photoKey = objKeys[i]
                photoArr.push(
                    <Col xs={3} style={{ marginBottom: 20 }}>
                        <Row style={{ height: '90%' }}>
                            <Col>
                                <Image src={editObj[photoKey][1]} style={{ width: '100%', padding: 3, borderRadius: 7 }} />
                            </Col>
                        </Row>
                        <Row style={{ overflowX: 'hidden' }}>
                            <Col>
                                {editObj[photoKey][0]}
                            </Col>
                        </Row>
                    </Col>
                );
            }
        }
        return photoArr;
    }

    private hovered = (id: string) => {
        this.setState({ isHover: true });
        const element = document.getElementById(id);

        if (element !== null) {
            if (element.style.color !== 'red') {

                element.style.color = 'blue';
                element.style.textDecoration = 'underline';
            }
        }
    }

    private notHovered = (id: string) => {
        this.setState({ isHover: false });
        const element = document.getElementById(id);

        if (element !== null) {
            if (element.style.color !== 'red') {
                element.style.textDecoration = 'none';
                element.style.color = 'black';
            }
        }
    }

    private addDelArr = (id: string) => {
        const element = document.getElementById(id);

        if (element !== null) {
            if (element.style.color === 'red') {
                element.style.color = 'black';
            } else {
                element.style.color = 'red';
            }
        }
        if (this.state.delArr.length == 0) {
            this.setState({ delArr: [...this.state.delArr, id] })
        } else {
            // console.log(this.state.delArr)
            for (let i = 0; i < this.state.delArr.length; i++) {
                if (this.state.delArr[i] == id) {
                    // delPicArr.splice(id, 1)
                    const delPicArr = this.state.delArr;
                    delPicArr.splice(i, 1);
                    console.log(delPicArr)
                    this.setState({ delArr: delPicArr })
                    return;
                } else {
                    // delPicArr.push(id)
                    this.setState({ delArr: [...this.state.delArr, id] })

                }
            }
        }


    }

    private gettingDelData = (editObj: any) => {
        const photoArr: any = [];
        const objKeys = Object.keys(editObj);

        for (let i = 0; i < Object.keys(editObj).length; i++) {
            if (objKeys[i] != 'id' && objKeys[i] != 'date' && objKeys[i] != 'title') {
                let photoKey = objKeys[i]
                photoArr.push(
                    <Col xs={3} onMouseEnter={() => { this.hovered(photoKey) }}
                        onMouseLeave={() => { this.notHovered(photoKey) }}
                        onClick={() => { this.addDelArr(photoKey) }}
                        style={{ cursor: this.state.isHover ? 'pointer' : 'none', marginBottom: 20 }}>
                        <Row style={{ height: '90%' }}>
                            <Col>
                                <Image src={editObj[photoKey][1]} style={{ width: '100%', padding: 3, borderRadius: 7 }} />
                            </Col>
                        </Row>
                        <Row id={photoKey} style={{ overflowX: 'hidden', }}>
                            <Col>
                                {editObj[photoKey][0]}
                            </Col>
                        </Row>
                    </Col>
                );
            }
        }
        return photoArr;
    }

    private addingHandleChange = (e: any) => {
        // this.setState({ email: mail });
        console.log(e.target.files)
        this.setState({ photoArr: e.target.files })

    }

    private addPhotos = (editObj: any) => {
        this.setState({ isUpdating: true });
        let today = new Date();
        const photoArrLength = this.state.photoArr.length
        const currentPhotoLength = Object.keys(editObj).length
        const storageRef = firebase.storage().ref();

        for (let i = 0; i < photoArrLength; i++) {
            storageRef.child('mainImages/' + this.state.photoArr[i].name)
                .put(this.state.photoArr[i]).then((snapshot: any) => {
                    snapshot.ref.getDownloadURL().then((url: any) => {
                        db.collection('mainImages').add({
                            url: url,
                            name: this.state.photoArr[i].name,
                            createdAt: today,
                            link: this.state.link
                        })
                            .then(() => {
                                db.collection('mainImages').get()
                                    .then((e) => {
                                        if (e.docs.length - photoArrLength === currentPhotoLength) {
                                            window.location.reload(false)
                                        }
                                    })
                            })
                    })
                }).catch((error) => {
                    console.log(error)
                    return;
                });
        }
    }

    private deletePics = () => {
        this.setState({ isUpdating: true })
        const editObj = this.props.photos
        const deleteList = this.state.delArr
        const refreshLength = Object.keys(editObj).length - deleteList.length
        for (let i = 0; i < deleteList.length; i++) {
            console.log(editObj.id)
            db.collection('mainImages').doc(deleteList[i]).delete().then(() => {
                const deleteRef = firebase.storage().ref().child('mainImages/' + editObj[deleteList[i]][0])
                deleteRef.delete().then(() => {
                    if (i === deleteList.length - 1) {
                        db.collection('mainImages').get()
                            .then((e) => {
                                console.log(e.docs.length)
                                console.log(refreshLength)
                                if (e.docs.length === refreshLength) {
                                    window.location.reload(false)
                                }
                            })
                    }
                }).catch((error) => {
                    console.log(error)
                })
            })

        }
    }

    private linkHandleChange = (linkAddress: string) => {
        console.log(linkAddress)
        this.setState({ link: linkAddress });
    }
    // private titleHandleChange = (title: string) => {
    //     this.setState({ albumTitle: title });
    // }

    // private changeTitle = (editObj: any) => {
    //     this.setState({ isUpdating: true })
    //     const docRef = db.collection('images').doc(editObj.id)
    //     return docRef.update({
    //         title: this.state.albumTitle
    //     }).then((result) => {
    //         console.log(result)
    //         window.location.reload(false)
    //     })

    // }
    render() {
        const editObj = this.props.photos

        return (
            <div>
                <Tabs defaultActiveKey="add" transition={false} id="noanim-tab-example">
                    <Tab eventKey="add" title="사진추가">
                        <Container
                            style={{
                                margin: '10px 0 30px 0', textAlign: 'center', border: '1px solid black', borderRadius: 7,
                                paddingBottom: '30px'
                            }}>
                            <Row style={{ margin: '10px 0 10px 0' }}>
                                <Col>
                                    현재 목록
                                </Col>
                            </Row>
                            <Row>

                                {this.gettingImageData(editObj)}
                            </Row>
                        </Container>
                        <Form>
                            <Form.File
                                id="formcheck-api-regular"
                            >
                                <Form.File.Input
                                    onChange={(e: any) => { this.addingHandleChange(e) }}></Form.File.Input>
                            </Form.File>

                            <Form.Label style={{ marginTop: 10 }}>링크(option): </Form.Label>
                            <Form.Control type="text" placeholder="Enter link address" style={{ marginBottom: 10 }}
                                onChange={(e: any) => { this.linkHandleChange(e.target.value) }} />


                            {this.state.isUpdating ?
                                <Button
                                    style={{ float: 'right', marginRight: '10%' }}
                                    disabled>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </Button>
                                :
                                this.state.photoArr.length > 0 ?
                                    <Button onClick={() => { this.addPhotos(editObj) }}
                                        style={{ float: 'right', marginRight: '10%' }}>
                                        사진추가
                                        </Button>
                                    :
                                    <Button
                                        style={{ float: 'right', marginRight: '10%' }}
                                        disabled>사진추가</Button>
                            }
                        </Form>
                    </Tab>

                    <Tab eventKey="delete" title="사진삭제">
                        <Container
                            style={{
                                margin: '10px 0 30px 0', textAlign: 'center', border: '1px solid black', borderRadius: 7,
                                paddingBottom: '30px'
                            }}>
                            <Row style={{ margin: '10px 0 10px 0' }}>
                                <Col>
                                    현재 목록
                                </Col>
                            </Row>
                            <Row>

                                {this.gettingDelData(editObj)}
                            </Row>
                        </Container>
                        {this.state.isUpdating ?
                            <Button
                                style={{ float: 'right', marginRight: '10%' }}
                                disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </Button>
                            :
                            this.state.delArr.length > 0 ?
                                <Button style={{ float: 'right', marginRight: '10%' }}
                                    onClick={() => { this.deletePics() }}>삭제</Button>
                                :
                                <Button
                                    style={{ float: 'right', marginRight: '10%' }}
                                    disabled>삭제</Button>
                        }
                    </Tab>

                    {/* <Tab eventKey="editTitle" title="제목변경">
                        <Form.Group controlId="formBasicLink">
                            <Form.Label>제목 변경</Form.Label>
                            <Form.Control type="text" placeholder="Enter Title"
                                onChange={(e: any) => { this.titleHandleChange(e.target.value) }} />
                        </Form.Group>
                        {this.state.isUpdating ?
                            <Button
                                style={{ float: 'right', marginRight: '10%' }}
                                disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </Button>
                            :
                            this.state.albumTitle ?
                                <Button
                                    style={{ float: 'right', marginRight: '10%' }}
                                    onClick={() => { this.changeTitle(editObj) }}>수정</Button>
                                :
                                <Button
                                    style={{ float: 'right', marginRight: '10%' }}
                                    disabled>수정</Button>
                        }

                    </Tab> */}

                </Tabs>
            </div >
        );
    }
}
export default MainEditor;