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
    p
    _isComponentMounted = false
    componentDidMount() {
        this._isComponentMounted = true

        // html5 audio
        this.audio = new Audio('music/' + this.props.src)
        this.audio.loop = true

        //web audio API
        this.actx = new (window.AudioContext || window.webkitAudioContext)()

        fetch('music/' + this.props.src, { mode: "cors" })
            .then((resp) => resp.arrayBuffer())
            .then(buffer => this.actx.decodeAudioData(buffer, buffer => {
                this.buffer = buffer
                this.setState({
                    isAudioLoaded: true,
                    duration: buffer.duration
                })
            }))
        requestAnimationFrame(this.tick);
    }
    componentWillUnmount() {
        this._isComponentMounted = false
    }

    play = () => {
        this.srcNode = this.actx.createBufferSource();  // create audio source
        this.srcNode.buffer = this.buffer;             // use decoded buffer
        this.srcNode.connect(this.actx.destination);    // create output
        this.srcNode.loop = this.state.isLoop;

        const offset = this.pausedAt % this.state.duration
        this.srcNode.start(0, offset)
        this.startedAt = this.actx.currentTime - offset
        console.log(this.startedAt)
    }

    stop = () => {
        const elapsed = this.actx.currentTime - this.startedAt
        this.srcNode.stop()
        this.pausedAt = elapsed
        console.log(this.srcNode)

    }


    tick = () => {
        if (!this._isComponentMounted) return;

        if (!this.state.isPaused) {
            const elapsed = this.actx.currentTime - this.pausedAt - this.startedAt

            this.setState({ currentTime: this.pausedAt + elapsed })
            const rotation = scale(this.state.currentTime, 0, this.audio.duration, 0, 360) // (this.state.isPaused ? 0 : 0.1);
            this.setState({ rotation });
        }



        requestAnimationFrame(this.tick);
    }

    togglePaused = () => {
        // if (this.state.isPaused) this.audio.play()
        // else this.audio.pause()

        if (this.state.isPaused) this.play()
        else this.stop()


        this.setState({
            isPaused: !this.state.isPaused
        })
    }
    toggleLoop = () => {
        this.audio.loop = !this.state.isLoop

        this.setState({
            isLoop: !this.state.isLoop
        })
    }
    toggleMuted = () => {
        this.audio.muted = !this.state.isMuted
        this.setState({
            isMuted: !this.state.isMuted
        })
    }
    restart = () => {
        this.audio.currentTime = 0
        this.setState({ rotation: 0 })

    }


    render() {
        const { isSelected, index, selectDisk, isTurntableSelected } = this.props
        const { isPaused, isMuted, isLoop, rotation, duration, isAudioLoaded } = this.state


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
                    isPaused={isPaused}
                    isLoop={isLoop}
                    isMuted={isMuted}
                    isTurntableSelected={isTurntableSelected}
                    isSelected={isSelected}
                    rotation={rotation}
                    duration={duration}
                    isAudioLoaded={isAudioLoaded}
                />
            </Fragment>
        )
    }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}




export default Disk  