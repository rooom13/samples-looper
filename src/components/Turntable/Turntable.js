import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler'
import Disk from './Disk/Disk'


class Turntable extends Component {

    state = {
        isPaused: true,
        isMuted: false,
        selectedDisk: 0,
        isSelected: false,

        newDiskName: "",
        newDiskSrc: ""

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
        const { selectedDisk, isPaused, isMuted,
            newDiskName, newDiskSrc
        } = this.state
        const { disks, isSelected, name } = this.props

        return (
            <Wrapper>
                <h3>{name}</h3>
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
                {disks && disks.map((disk, i) => {
                    const { name, src } = disk
                    const diskIndex = i
                    return (<Fragment key={i}>
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
                            src={src}
                            name={name}
                            index={diskIndex}
                            isTurntableSelected={isSelected}
                            isSelected={selectedDisk === diskIndex} />
                    </Fragment>)
                })}
                <input name="newDiskName" placeholder="new disk name" value={newDiskName} onChange={this.handleFormChange} />
                <input name="newDiskSrc" placeholder="new disk src" value={newDiskSrc} onChange={this.handleFormChange} />
                <button disabled={!(newDiskName && newDiskSrc)} onClick={this.onNewDiskClicked}>+</button>
            </Wrapper>
        )
    }

    onNewDiskClicked = () => {
        this.props.addDisk(this.state.newDiskName, this.state.newDiskSrc)
        this.setState({ newDiskName: "", newDiskSrc: "" })
    }

    handleFormChange = (e) => {
        const field = e.target.name
        const value = e.target.value
        this.setState({ [field]: value })
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