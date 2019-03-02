import React, { Component, Fragment } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import DiskInterface from './DiskInterface'

class Disk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: 0,
            isPaused: true,
            isMuted: false,
            isLoop: true,

            duration: 0,
            currentTime: 0,
        };
        this.startedAt = 0
        this.pausedAt = 0
    }

    _isComponentMounted = false
    componentDidMount() {
        this._isComponentMounted = true

        // html5 audio
        this.audio = new Audio('music/' + this.props.src)
        this.audio.loop = true

        //web audio API
        this.actx = new (window.AudioContext || window.webkitAudioContext)()
        this.gainNode = this.actx.createGain()
        this.gainNode.connect(this.actx.destination)

        fetch('music/' + this.props.src, { mode: "cors" })
            .then((resp) => resp.arrayBuffer())
            .then(buffer => this.actx.decodeAudioData(buffer, buffer => {
                this.buffer = buffer
                this.setState({
                    isAudioLoaded: true,
                    duration: buffer.duration
                })
            }))
        requestAnimationFrame(this.tick.bind(this));

        // setInterval(()=>       console.log(this.state.currentTime), 1000)
    }
    componentWillUnmount() {
        this._isComponentMounted = false
    }

    play = () => {
        console.log('play')

        // if(!this.manualStop === 2)
        
        this.srcNode = this.actx.createBufferSource();  // create audio source
        this.srcNode.onended = () => {
            // this.setState({ isPaused: true })
        }
        this.srcNode.buffer = this.buffer;


        // use decoded buffer
        this.srcNode.connect(this.gainNode);    // create output
        this.srcNode.loop = this.state.isLoop;
        
        const offset = this.pausedAt % this.state.duration
        this.srcNode.start(0, offset)
        this.startedAt = this.actx.currentTime - offset
        this.setState({ isPaused: false })
        // console.log(this.startedAt)
    }



    stop = (shouldKeep) => {
        if(!this.srcNode)return
        console.log('stop')


        const elapsed = this.actx.currentTime - this.startedAt
        this.srcNode.stop()
        this.pausedAt = elapsed

        console.log(shouldKeep ? 'shouldKeep' : 'shouldPause')
        this.setState({isPaused: !shouldKeep})

    }

    restart = () => {
        setTimeout(()=>this.setState({isRestarting: false}), 50)
        if(!this.srcNode)return;

        
        this.setState({ currentTime: 0,
        isRestarting: true })
        this.stop(!this.state.isPaused)
        this.pausedAt = 0
        if (!this.state.isPaused) this.play()


    }

    tick = () => {

        if (!this._isComponentMounted) return;

        if (!this.state.isPaused) {
            const currentTime = this.actx.currentTime - this.startedAt


            this.setState({ currentTime: currentTime % this.state.duration })
        }
        const rotation = scale(this.state.currentTime, 0, this.audio.duration, 0, 360) // (this.state.isPaused ? 0 : 0.1);
        this.setState({ rotation });

        requestAnimationFrame(this.tick.bind(this));
    }

    togglePaused = () => {
        if(!this.state.isAudioLoaded)return;


        if (this.state.isPaused) this.play()
        else this.stop()


    }
    toggleLoop = () => {
       if(this.srcNode)
        this.srcNode.loop = !this.state.isLoop;

        this.setState({
            isLoop: !this.state.isLoop
        })
    }
    toggleMuted = () => {
        this.gainNode.gain.setValueAtTime(this.state.isMuted ? 1 : 0, this.actx.currentTime);


        // this.audio.muted = !this.state.isMuted
        this.setState({
            isMuted: !this.state.isMuted
        })
    }



    render() {
        const { isSelected, index, selectDisk, isTurntableSelected } = this.props
        const { isPaused, isMuted, isLoop, rotation, duration, isAudioLoaded, isRestarting } = this.state


        return (

            <Fragment>
                {isTurntableSelected && isSelected &&
                    <Fragment>
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={'p'}
                            onKeyHandle={this.togglePaused}
                        />
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={'m'}
                            onKeyHandle={this.toggleMuted}
                        />
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={'l'}
                            onKeyHandle={this.toggleLoop}
                        />
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={'r'}
                            onKeyHandle={this.restart}
                        />
                    </Fragment>
                }

                <DiskInterface
                    selectDisk={selectDisk}
                    index={index}
                    togglePaused={this.togglePaused}
                    toggleMuted={this.toggleMuted}
                    toggleLoop={this.toggleLoop}
                    restart={this.restart}
                    isRestarting={isRestarting}
                    isPaused={isPaused}
                    isLoop={isLoop}
                    isMuted={isMuted}
                    isTurntableSelected={isTurntableSelected}
                    isSelected={isSelected}
                    rotation={rotation}
                    duration={duration}
                    isAudioLoaded={isAudioLoaded}
                />
                {/* {
                    (Object.entries(this.state).map(a => <div key={a}>{a[0] + ' : ' + a[1] + '\n'}</div>))

                }
                <div>{'manual :' +this.manualStop}</div> */}
            </Fragment>
        )
    }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}




export default Disk  