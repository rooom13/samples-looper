import React, { Component } from 'react';
import styled from 'styled-components'
import Animation from './Animation'
import { scale } from '../../../utils/functions';


class DiskInterface extends Component {

    state = {
        isRestarting: false
    };


    restart = () => {
        this.props.restart()
        this.setState({ isRestarting: true })
        setTimeout(() => this.setState({ isRestarting: false }), 50)

    }

    render() {

        const {
            togglePaused,
            toggleMuted,
            toggleLoop,
            restart,
            isTurntableSelected,
            isPaused,
            isLoop,
            isMuted,
            progress,
            isSelected,
            index,
            selectDisk,
            duration,
            isAudioLoaded,
            isRestarting,
            buffer,
            idSrc
        } = this.props

        const isAnimation = false


        const rotation = scale(progress, 0, 100, 0, 360)

        return (
            <Wrapper isSelected={isSelected} isTurntableSelected={isTurntableSelected}>
                <Row>
                    <Num onClick={(ev) => selectDisk(ev, index - 1)}> {index}</Num >
                    <Column>
                        <Button onClick={togglePaused} isActive={isPaused} children={'P'} />
                        <Button onClick={restart} isActive={isRestarting} children={'R'} />
                    </Column>
                    <Column>
                        {isAudioLoaded && isAnimation ?
                            <Animation idSrc={idSrc} buffer={buffer} isPaused={isPaused} progress={progress} width={120} height={120} />
                            :
                            <Vinyl src={isAudioLoaded && "./sprites/disk.png"} style={{ transform: `rotate(${rotation}deg)` }} />}
                    </Column>
                    < Column>
                        <Button onClick={toggleMuted} isActive={isMuted} children={'M'} />
                        <Button onClick={toggleLoop} isActive={isLoop} children={'L'} />
                    </Column>
                    {/* < Column>
                        <Duration onChange={e => console.log(e.target.value)} placeholder={isAudioLoaded && duration} />
                    </Column> */}
                </Row>
                <Row>
                    <input type="range" min="0" max="2" step="0.01" value={this.props.volume} onChange={this.props.handleVolumeChange} />{(this.props.volume * 100).toFixed()} %
                </Row>
            </Wrapper>
        )
    }
}

const vinylSize = "4.5rem";

const Vinyl = styled.img`
    width: ${vinylSize};
    transform: rotate(${(props => props.rotation)}deg);
`
const Duration = styled.input`
    border: 1px solid black;
    padding: 0.25rem;    
    width: 2.5rem;
`

const Num = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
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
    margin: 0.25rem;
`

const Row = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.isSelected ? props.isTurntableSelected ? 'brown' : 'lightgrey' : 'grey'};
`


export default DiskInterface