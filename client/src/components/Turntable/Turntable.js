import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler'
import Disk from './Disk/Disk'


class Turntable extends Component {

    state = {
        isPaused: true,
        isMuted: false,
        selectedDisk: 0,
        isSelected: false

    }
    disks = {}

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }



    selectDisk = (ev, disk) => {
        ev.preventDefault()
        const diskCount = this.props.disks.length - 1
        if (disk < 0) disk = diskCount
        else if (disk > diskCount) disk = 0

        this.setState({ selectedDisk: disk })
    }

    togglePaused = () => {
        if (this.state.isPaused)
            this.playAll()
        else
            this.stopAll()
    }

    playAll = () => {
        Object.keys(this.disks).map(diskIndex => this.disks[diskIndex]["play"]())
        this.setState({ isPaused: false })
    }

    stopAll = () => {
        Object.keys(this.disks).map(diskIndex => this.disks[diskIndex]["stop"]())
        this.setState({ isPaused: true })
    }

    setMuteAll = (shouldMute) => {
        Object.keys(this.disks).map(diskIndex => this.disks[diskIndex].setMute(shouldMute))
        this.setState({ isMuted: shouldMute })
    }

    toggleMuted = () => {
        this.setMuteAll(!this.state.isMuted)
    }

    restart = () => {
        Object.keys(this.disks).map(diskIndex => this.disks[diskIndex].restart())
    }
    render() {
        const { selectedDisk, isPaused, isMuted } = this.state
        const { disks, isSelected } = this.props
        const subfolder = disks[0].split("/")[1]
        return (

            <Wrapper>
                <h3>{subfolder}</h3>
                <Button onClick={this.togglePaused} isActive={isPaused}>P</Button>
                <Button onClick={this.toggleMuted} isActive={isMuted}>M</Button>
                <Button onClick={this.restart}>R</Button>
                {isSelected &&
                    <Fragment>
                        <KeyHandler
                            keyEventName={KEYDOWN}
                            code={('ArrowDown').toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, selectedDisk + 1)}
                        />
                        <KeyHandler
                            keyEventName={KEYDOWN}
                            code={('ArrowUp').toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, selectedDisk - 1)}
                        />
                    </Fragment>
                }
                {disks.map((loop, i) => {
                    const diskIndex = i
                    return (<Fragment key={loop}>
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={(diskIndex).toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, diskIndex)}
                        />

                        <Disk
                            setLeftDiskSwitch={() => this.props.setDiskSwitch("left", this.props.turntableIndex, diskIndex)}
                            setRightDiskSwitch={() => this.props.setDiskSwitch("right", this.props.turntableIndex, diskIndex)}
                            onRef={ref => this.disks[diskIndex] = ref}
                            selectDisk={this.selectDisk}
                            src={loop}
                            index={diskIndex}
                            isTurntableSelected={isSelected}
                            isSelected={selectedDisk === diskIndex} >{loop}</Disk>
                    </Fragment>)
                })}
            </Wrapper>
        )
    }
}

const Wrapper = styled.div`
    border: 2px solid black;
    width: 100%;
`

export const Button = styled.button`
    ${(props) => (props.isActive && `
        background-color: blue;  `
    )};
`
export default Turntable;