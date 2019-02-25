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
        };
    }
    _isComponentMounted = false
    componentDidMount() {
        this._isComponentMounted = true
        this.audio = new Audio('music/' + this.props.src)
        this.audio.loop = true
        requestAnimationFrame(this.tick);
    }
    componentWillUnmount() {
        this._isComponentMounted = false
    }

    tick = () => {
        if (!this._isComponentMounted) return;
        const rotation = scale(this.audio.currentTime, 0, this.audio.duration, 0, 360) // (this.state.isPaused ? 0 : 0.1);
        this.setState({ rotation });
        requestAnimationFrame(this.tick);
    }

    togglePaused = () => {
        if (this.state.isPaused) this.audio.play()
        else this.audio.pause()
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
        const { isPaused, isMuted, isLoop, rotation } = this.state


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
                />
            </Fragment>
        )
    }
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}




export default Disk  