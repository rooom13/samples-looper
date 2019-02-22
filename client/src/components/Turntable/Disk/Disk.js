import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import Animation from './Animation'
import KeyHandler, { KEYPRESS } from 'react-key-handler'


class Disk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: 0,
            isPaused: true,
            isMuted: false,
            isLoop: true,
            isRestarting: false
        };

        this.tick = this.tick.bind(this);
    }
    _isComponentMounted = false
    componentDidMount() {
        this._isComponentMounted = true
        this.audio = new Audio('music/'+ this.props.src)
        this.audio.loop= true
        requestAnimationFrame(this.tick);
    }
    componentWillUnmount() {
        this._isComponentMounted = false
    }

    tick() {
        if (!this._isComponentMounted) return;
        const rotation = this.state.rotation + (this.state.isPaused ? 0 : 0.1);
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
        this.setState({isRestarting: true})
        this.audio.currentTime = 0
        this.setState({rotation: 0})
        setTimeout(()=>this.setState({isRestarting: false}), 50)

    }


    render() {
        const { isSelected, index, selectDisk, isTurntableSelected } = this.props
        const { isPaused, isMuted, isLoop, isRestarting } = this.state

        return (
            <Wrapper
                isSelected={isSelected}
                isTurntableSelected = {isTurntableSelected}
            >
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
                <Num onClick={(ev) => selectDisk(ev,index - 1)}>{index}</Num>
                < Column>
                    <Button onClick={this.togglePaused} isActive={isPaused} children={'P'} />
                    <Button onClick={this.restart} isActive={isRestarting} children={'R'} />
                </Column>

                <Animation isPaused={isPaused} rotation={this.state.rotation} width={50} height={50} />
                < Column>
                    <Button onClick={this.toggleMuted} isActive={isMuted} children={'M'} />
                    <Button onClick={this.toggleLoop} isActive={isLoop} children={'L'} />
                </Column>
            </Wrapper>
        )
    }
}


const Num = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    background-color: black;
    border-radius: 50%;
    padding: 1rem;
    color: white;
`
const Button = styled.button`

height: 100%;

${(props) => (props.isActive && `
background-color: blue;  `
    )};

`
const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    
`

const Wrapper = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0.5rem;

    background-color: grey;
    ${(props) => (props.isSelected && props.isTurntableSelected && `
    background-color: brown;  `
    )};

    ${(props) => (props.isSelected && `
    border: 1px solid black;  `
    )};
    

`


export default Disk  