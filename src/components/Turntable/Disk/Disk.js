import React, { Component, Fragment } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import DiskInterface from './DiskInterface'
import { scale } from '../../../utils/functions'
import styled from 'styled-components';
// import { analyze } from 'web-audio-beat-detector';

class Disk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            isPaused: true,
            isMuted: false,
            isLoop: true,
            volume: 1,
            playbackRate: 1,
            originalDuration: 0,
            duration: 0,
            currentTime: 0,
            tempo: null
        };
        this.startedAt = 0
        this.pausedAt = 0
    }

    _isComponentMounted = false

    componentDidMount() {
        this.props.onRef(this)
        this._isComponentMounted = true
        //web audio API
        this.actx = new (window.AudioContext || window.webkitAudioContext)()
        this.gainNode = this.actx.createGain()
        this.gainNode.connect(this.actx.destination)
        fetch(this.props.src, { "mode": "cors" })
            .then((resp) => resp.arrayBuffer())
            .then(buffer => this.actx.decodeAudioData(buffer, buffer => {
                this.buffer = buffer
                this.setState({
                    isAudioLoaded: true,
                    originalDuration: buffer.duration,
                    duration: buffer.duration
                })
                // analyze(this.buffer)
                //     .then((tempo) => {
                //         this.setState({ tempo })
                //     })
            }))
        requestAnimationFrame(this.tick.bind(this));
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
        this._isComponentMounted = false
    }

    play = () => {
        if (!this.state.isPaused) return

        delete this.srcNode
        this.srcNode = this.actx.createBufferSource();  // create audio source
        this.srcNode.onended = () => {
            // this.setState({ isPaused: true })
        }
        this.srcNode.buffer = this.buffer;

        // use decoded buffer
        this.srcNode.connect(this.gainNode);    // create output
        this.srcNode.loop = this.state.isLoop;
        this.srcNode.playbackRate.value = this.state.playbackRate;

        const offset = this.pausedAt % this.state.originalDuration
        this.srcNode.start(0, offset)
        this.startedAt = this.actx.currentTime - offset
        this.setState({ isPaused: false })
    }

    stop = (resetTime = false, fn = null) => {
        if (!this.srcNode) return
        const elapsed = resetTime ? 0 : this.actx.currentTime - this.startedAt
        this.srcNode.stop()
        this.pausedAt = elapsed
        this.setState({ isPaused: true }, fn)
    }

    restart = () => {
        if (!this.srcNode) return;
        this.setState({ isRestarting: true })
        setTimeout(() => this.setState({ isRestarting: false }), 50)
        this.setState({
            currentTime: 0,
        })
        const shouldKeepPlaying = !this.state.isPaused
        this.stop(true, shouldKeepPlaying ? this.play : null)
    }

    tick = () => {

        if (!this._isComponentMounted) return;

        if (!this.state.isPaused) {
            const currentTime = this.actx.currentTime - this.startedAt

            this.setState({ currentTime: currentTime % this.state.duration })
        }
        const progress = scale(this.state.currentTime, 0, this.state.originalDuration, 0, 100) * this.state.playbackRate
        this.setState({ progress });

        requestAnimationFrame(this.tick.bind(this));
    }

    togglePaused = () => {
        if (!this.state.isAudioLoaded) return;
        if (this.state.isPaused) this.play()
        else this.stop()
    }

    toggleLoop = () => {
        if (this.srcNode)
            this.srcNode.loop = !this.state.isLoop;

        this.setState({
            isLoop: !this.state.isLoop
        })
    }

    toggleMuted = () => {
        const shouldMute = !this.state.isMuted
        this.setMute(shouldMute)
    }

    setMute = (shouldMute) => {
        const volume = shouldMute ? 0 : this.state.volume
        this.gainNode.gain.setValueAtTime(volume, this.actx.currentTime);
        this.setState({
            isMuted: shouldMute
        })
    }

    handleVolumeChange = (e) => {
        const volume = e.target.value
        this.gainNode.gain.setValueAtTime(this.state.isMuted ? 0 : volume, this.actx.currentTime);
        this.setState({
            volume: volume
        })
    }

    handlePlaybackRate = (e) => {
        const playbackRate = e.target.value
        if (isNaN(playbackRate)) return

        if (this.srcNode)
            this.srcNode.playbackRate.value = playbackRate;
        this.setState({
            playbackRate: playbackRate,
            duration: this.state.originalDuration / playbackRate,
        })
    }

    handleDuration = (e) => {
        const duration = e.target.value
        if (isNaN(duration)) return

        const playbackRate = this.state.originalDuration / duration
        if (this.srcNode)
            this.srcNode.playbackRate.value = playbackRate;
        this.setState({
            playbackRate: playbackRate,
            duration: duration,
        })
    }

    render() {
        const { isSelected, index, selectDisk, isTurntableSelected, src, name } = this.props
        const { isPaused, isMuted, isLoop, progress, duration, isAudioLoaded, isRestarting, volume, playbackRate } = this.state
        return (
            <Wrapper>
                <div>{name}</div>{this.state.tempo}
                <button onClick={this.props.removeDisk} style={{ top: "0", right: "0", position: "absolute" }}>X</button>
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
                    </Fragment>}
                <DiskInterface
                    setLeftDiskSwitch={this.props.setLeftDiskSwitch}
                    setRightDiskSwitch={this.props.setRightDiskSwitch}
                    selectDisk={selectDisk}
                    index={index}
                    togglePaused={this.togglePaused}
                    toggleMuted={this.toggleMuted}
                    toggleLoop={this.toggleLoop}
                    handleVolumeChange={this.handleVolumeChange}
                    handlePlaybackRate={this.handlePlaybackRate}
                    handleDuration={this.handleDuration}
                    restart={this.restart}
                    isRestarting={isRestarting}
                    isPaused={isPaused}
                    isLoop={isLoop}
                    volume={volume}
                    isMuted={isMuted}
                    isTurntableSelected={isTurntableSelected}
                    isSelected={isSelected}
                    progress={progress}
                    duration={duration}
                    playbackRate={playbackRate}
                    isAudioLoaded={isAudioLoaded}
                    buffer={isAudioLoaded && this.buffer}
                    idSrc={src}
                />
            </Wrapper>
        )
    }
}

const Wrapper = styled.div`
    position: relative;
`

export default Disk