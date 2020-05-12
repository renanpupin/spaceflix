import React, { Component } from 'react';
import axios from 'axios';
import logo from './assets/logo-full-horizontal.svg';
import play from './assets/play.svg';
import close from './assets/close.svg';
import './App.css';

import Modal from 'react-modal';

Modal.setAppElement('#root')

export default class App extends Component{
    constructor(props){
        super(props);

        this.state = {
            loading: true,
            visible: false,
            videos: [],
            selectedVideo: null,
        }
    }

    componentDidMount() {
        this.getVideos();
    }

    getVideos = async () => {
        try{
            let response = await axios({
                method: 'GET',
                url: `/api/video`
            });
            console.log(response.data);

            if(response.data?.success !== true){
                throw new Error(response.data?.message);
            }

            this.setState({
                videos: response.data.videos
            })
        }catch (err) {
            console.log(err);

            alert(err.message);
        }finally {
            this.setState({
                loading: false
            });
        }
    }

    play = (item) => {
        console.log("play", item);

        this.setState({
            visible: true,
            selectedVideo: item
        });
    }

    render(){
        return (
            <div className="app">
                <div className={"logo-wrapper"}>
                    <img src={logo} className="logo" alt="logo" />
                </div>
                <div>
                    <ul className={"video-list"}>
                        {this.state.videos.map((item, index) => {
                            return(
                                <li key={index} className={"video-list-item"} style={{backgroundImage: `url(/api/thumb/${item.thumb})`}}>
                                    <p className={"title"}>{item.name}</p>
                                    <div className={"video-mask"}/>

                                    <button className={"play-button"} onClick={() => {this.play(item)}}>
                                        <img src={play} className={"play"} alt="play" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <Modal
                    isOpen={this.state.visible}
                    onRequestClose={() => {
                        this.setState({
                            visible: false,
                            selectedVideo: null
                        });
                    }}
                    closeTimeoutMS={200}
                    style={{
                        overlay: {
                            // position: 'fixed',
                            // top: 0,
                            // left: 0,
                            // right: 0,
                            // bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)'
                        },
                        content : {
                            top                   : '50%',
                            left                  : '50%',
                            right                 : 'auto',
                            bottom                : 'auto',
                            marginRight           : '-50%',
                            transform             : 'translate(-50%, -50%)',
                            backgroundColor: '#fff'
                        }
                    }}
                    contentLabel="Video Modal"
                >
                    <button
                        className={"close-button"}
                        onClick={() => {
                            this.setState({
                                visible: false,
                            });
                        }}
                    >
                        <img src={close} className={"close"} alt="close" />
                    </button>
                    <div style={{marginTop: 20}}>
                        <video id="videoPlayer" controls className="video">
                            <source src={`/api/video/${this.state.selectedVideo?.file}`} type="video/mp4"/>
                        </video>
                        <p className={"font"}>Video from: <a href={this.state.selectedVideo?.font} target="_blank" rel="noopener noreferrer">{this.state.selectedVideo?.font}</a></p>
                    </div>
                </Modal>
            </div>
        );
    }
}
