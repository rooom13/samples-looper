import React, { Component } from 'react';
import styled from 'styled-components'

import Animation from './Animation'
import { scale } from '../../../utils/functions';
import { TypicalButton, PauseButton, MuteButton, RestartButton, LoopButton } from '../../../components/Buttons'
import { VolumeRange } from '../../../components/VolumeRange'


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
                        <PauseButton title="pause" onClick={togglePaused} isActive={isPaused} />
                        <RestartButton title="restart" onClick={this.props.restart} isActive={isRestarting} />
                    </Column>
                    <Column>
                        {isAudioLoaded && isAnimation ?
                            <Animation idSrc={idSrc} buffer={buffer} isPaused={isPaused} progress={progress} width={120} height={120} />
                            :
                            <Vinyl src={isAudioLoaded && "./sprites/disk.png"} style={{ transform: `rotate(${rotation}deg)` }} />}
                    </Column>
                    <Column>
                        <MuteButton title="mute" onClick={toggleMuted} isActive={isMuted} />
                        <LoopButton title="toggle loop" onClick={toggleLoop} isActive={isLoop} />
                    </Column>
                    <Column>
                        <TypicalButton title="send to Switch L" onClick={this.props.setLeftDiskSwitch} children={'🇱 L'} />
                        <TypicalButton title="send to Switch R" onClick={this.props.setRightDiskSwitch} children={'🇷 R'} />
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
                    <VolumeRange volume={volume} onChange={this.props.handleVolumeChange} value={volume} />
                    <span style={{ fontSize: "0.75rem", width: "3rem", textAlign: "right" }}>{(volume * 100).toFixed()} %</span>
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
    border-radius: 5px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${props => props.isSelected ? props.isTurntableSelected ? 'brown' : 'grey' : 'dimgrey'};
    box-shadow: 0px 0px 6px 1px ${({ theme }) => theme.shadow};
`


export default DiskInterface