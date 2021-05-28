import React, { Component } from 'react';
import styled from 'styled-components'

import Animation from './Animation'
import { scale } from '../../../utils/functions';
import TypicalButton from '../../../components/TypicalButton'


class DiskInterface extends Component {

    state = {
        isRestarting: false
    };

    render() {

        const {
            togglePaused,
            toggleMuted,
            toggleLoop,
            isTurntableSelected,
            isPaused,
            isLoop,
            isMuted,
            progress,
            isSelected,
            index,
            selectDisk,
            duration,
            playbackRate,
            volume,
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
                        <TypicalButton onClick={togglePaused} isActive={isPaused} children={'P'} />
                        <TypicalButton onClick={this.props.restart} isActive={isRestarting} children={'R'} />
                    </Column>
                    <Column>
                        {isAudioLoaded && isAnimation ?
                            <Animation idSrc={idSrc} buffer={buffer} isPaused={isPaused} progress={progress} width={120} height={120} />
                            :
                            <Vinyl src={isAudioLoaded && "./sprites/disk.png"} style={{ transform: `rotate(${rotation}deg)` }} />}
                    </Column>
                    <Column>
                        <TypicalButton onClick={toggleMuted} isActive={isMuted} children={'M'} />
                        <TypicalButton onClick={toggleLoop} isActive={isLoop} children={'L'} />
                    </Column>
                    <Column>
                        <TypicalButton onClick={this.props.setLeftDiskSwitch} children={'to Switch L'} />
                        <TypicalButton onClick={this.props.setRightDiskSwitch} children={'to Switch R'} />
                    </Column>
                    <Column>
                        <Duration onChange={this.props.handleDuration} type={"number"} value={duration} />
                        <Duration onChange={this.props.handlePlaybackRate} type={"number"} value={playbackRate} step="0.001" />
                        <Row>
                            <TypicalButton onClick={() => this.props.handlePlaybackRate({ target: { value: this.props.playbackRate * 0.5 } })} children={'x0.5'} />
                            <TypicalButton onClick={() => this.props.handlePlaybackRate({ target: { value: this.props.playbackRate * 2 } })} children={'x2'} />
                        </Row>
                    </Column>
                </Row>
                <Row>
                    <input type="range" min="0" max="2" step="0.01" value={volume} onChange={this.props.handleVolumeChange} />{(this.props.volume * 100).toFixed()} %
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
    width: 5rem;
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
`

const Wrapper = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.isSelected ? props.isTurntableSelected ? 'brown' : 'lightgrey' : 'grey'};
`


export default DiskInterface