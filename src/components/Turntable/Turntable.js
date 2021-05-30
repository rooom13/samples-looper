import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler'
import Disk from './Disk/Disk'
import { DeleteButton, PauseButton, MuteButton, RestartButton, AddButton } from '../../components/Buttons'

class Turntable extends Component {

    state = {
        isPaused: true,
        isMuted: false,
        selectedDisk: 0,
        isSelected: false,

        newDiskName: "",
        newDiskSrc: ""
    }

    disks = []

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
        this.disks = []
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
                <Title>{name} {" "}
                    <DeleteButton title="delete turntable" onClick={this.props.removeTurntable} style={{ top: "0", right: "0", position: "absolute" }} />
                    <PauseButton title="pause turntable" onClick={this.togglePaused} isActive={isPaused} />
                    <MuteButton title="mute turntable" onClick={this.toggleMuted} isActive={isMuted} />
                    <RestartButton title="restart turntable" onClick={this.restart} /*isActive={isRestarting}*/ />
                </Title>
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
                            onRef={ref => {
                                if (ref) this.disks[diskIndex] = ref
                                else delete this.disks[diskIndex]
                            }}
                            selectDisk={this.selectDisk}
                            src={src}
                            key={src} // needed for remounting
                            name={name}
                            index={diskIndex}
                            isTurntableSelected={isSelected}
                            isSelected={selectedDisk === diskIndex}
                            removeDisk={(() => this.removeDisk(diskIndex))}
                        />
                    </Fragment>)
                })}
                <div style={{ display: "flex" }}>
                    <StyledInput name="newDiskName" placeholder="new disk name" value={newDiskName} onChange={this.handleFormChange} />
                    <StyledInput name="newDiskSrc" placeholder="new disk src" value={newDiskSrc} onChange={this.handleFormChange} />
                    <AddButton title="add disk" disabled={!(newDiskName && newDiskSrc)} onClick={this.onNewDiskClicked} />
                </div>
                <div style={{ height: "13rem" }} />
            </Wrapper>
        )
    }

    removeDisk = (diskIndex) => {
        this.disks.splice(diskIndex, 1)
        this.props.removeDisk(diskIndex)
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

const StyledInput = styled.input`
    color: ${({ theme }) => theme.text};
    background: none;
    border: none;
    font-size: 1rem;
    width: 100%;
    
    ::placeholder {
        font-style: italic;
        color: grey;
        text-decoration: underline;
    }
`

const Title = styled.div`
    margin: 0.75rem 0;
    font-size: 1.5rem;
    font-weight: bolder;
    font-variant: small-caps;
`

const Wrapper = styled.div`
    position: relative;
    width: max-content;
    margin: 0.25rem;

    ::after {
        height: 10rem;
    }
`

export default Turntable;