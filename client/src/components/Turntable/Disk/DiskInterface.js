import React, { Component } from 'react';
import styled from 'styled-components'
// import Animation from './Animation'


class DiskInterface extends Component {

    state = {
        isRestarting: false
    };


    restart = () => {
        this.props.restart()
        this.setState({isRestarting: true})
        setTimeout(() => this.setState({ isRestarting: false }), 50)

    }

    render() {

        const {
            togglePaused,
            toggleMuted,
            toggleLoop,
            isTurntableSelected,
            isPaused,
            isLoop,
            isMuted,
            rotation,
            isSelected,
            index,
            selectDisk,
        } = this.props
        const { isRestarting } = this.state

        return (
            <Wrapper isSelected={isSelected} isTurntableSelected={isTurntableSelected}>
                <Num onClick={(ev) => selectDisk(ev, index - 1)}> {index}</Num >
                < Column>
                    <Button onClick={togglePaused} isActive={isPaused} children={'P'} />
                    <Button onClick={this.restart} isActive={isRestarting} children={'R'} />
                </Column>
                {/* <Animation isPaused={isPaused} rotation={rotation} width={120} height={120} /> */}
                <Vinyl src="./sprites/disk.png" style={{ transform: `rotate(${rotation}deg)` }} />

                < Column>
                    <Button onClick={toggleMuted} isActive={isMuted} children={'M'} />
                    <Button onClick={toggleLoop} isActive={isLoop} children={'L'} />
                </Column>
            </Wrapper>
        )
    }
}

const Vinyl = styled.img`
    width: 120px;
    transform: rotate(${(props => props.rotation)}deg);
`


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
    background-color: ${props => props.isSelected ? props.isTurntableSelected ? 'brown' : 'lightgrey' : 'grey'};
`


export default DiskInterface