import React, { Component } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYDOWN } from 'react-key-handler'
import Turntable from './Turntable/Turntable'
import { MuteButton, RestartButton, PauseButton, AddButton } from '../components/Buttons'
import { Switch } from './Switch';

class Rack extends Component {

    constructor(props) {
        super(props)

        const { turntables } = this.props

        const DEFAULT_LEFTSWITCHDISK_TURNTABLE_INDEX = 0
        const DEFAULT_RIGHTSWITCHDISK_TURNTABLE_INDEX = 1
        const DEFAULT_SWITCHDISK_DISK_INDEX = 0

        const DEFAULT_LEFTSWITCHDISK_TURNTABLE = turntables[DEFAULT_LEFTSWITCHDISK_TURNTABLE_INDEX]
        const DEFAULT_RIGHTSWITCHDISK_TURNTABLE = turntables[DEFAULT_RIGHTSWITCHDISK_TURNTABLE_INDEX]
        const DEFAULT_LEFTSWITCHDISK_DISK_NAME = DEFAULT_LEFTSWITCHDISK_TURNTABLE.disks[DEFAULT_SWITCHDISK_DISK_INDEX].name
        const DEFAULT_RIGHTSWITCHDISK_DISK_NAME = DEFAULT_RIGHTSWITCHDISK_TURNTABLE.disks[DEFAULT_SWITCHDISK_DISK_INDEX].name

        this.state = {
            selectedTurntable: 0,

            isMasterPaused: true,
            isMasterMuted: false,
            leftSwitchDisk: {
                volume: 1,
                turntableIndex: DEFAULT_LEFTSWITCHDISK_TURNTABLE_INDEX,
                diskIndex: DEFAULT_SWITCHDISK_DISK_INDEX,
                diskName: DEFAULT_LEFTSWITCHDISK_DISK_NAME,
                turntableName: DEFAULT_LEFTSWITCHDISK_TURNTABLE.name
            },
            rightSwitchDisk: {
                volume: 1,
                turntableIndex: DEFAULT_RIGHTSWITCHDISK_TURNTABLE_INDEX,
                diskIndex: DEFAULT_SWITCHDISK_DISK_INDEX,
                diskName: DEFAULT_RIGHTSWITCHDISK_DISK_NAME,
                turntableName: DEFAULT_RIGHTSWITCHDISK_TURNTABLE.name
            },
            newTurntableName: ""
        }

        this.turntables = []
    }

    componentWillUnmount() {
        delete this.turntables
    }

    selectTurntable = (ev, turntable) => {
        ev.preventDefault()
        const turntableCount = this.props.turntables.length - 1

        if (turntable > turntableCount)
            turntable = 0
        else if (turntable < 0)
            turntable = turntableCount

        this.setState({ selectedTurntable: turntable })
    }

    toggleMasterPaused = () => {
        const fn = this.state.isMasterPaused ? "playAll" : "stopAll"
        Object.keys(this.turntables).map(i => this.turntables[i][fn]())
        this.setState({ isMasterPaused: !this.state.isMasterPaused })
    }

    toggleMasterMuted = () => {
        Object.keys(this.turntables).map(i => this.turntables[i].setMuteAll(!this.state.isMasterMuted))
        this.setState({ isMasterMuted: !this.state.isMasterMuted })
    }

    toggleMasterRestart = () => {
        Object.keys(this.turntables).map(i => this.turntables[i].restart())
    }

    /**
     * @param {str: [left | right]} whichDisk 
     */
    setDiskSwitch = (whichDisk, turntableIndex, diskIndex) => {
        const { turntables } = this.props


        const turntable = turntables[turntableIndex]
        this.setState({
            [whichDisk + "SwitchDisk"]: {
                turntableIndex,
                diskIndex,
                turntableName: turntable.name,
                diskName: turntable.disks[diskIndex].name,
                volume: 1,
            }
        })
    }

    handleSwitchVolumeChange = (e) => {

        const { rightSwitchDisk, leftSwitchDisk } = this.state

        const volume = e.target.value

        const leftSwitchDiskVolume = 1 - volume
        const rightSwitchDiskVolume = volume

        this.turntables[leftSwitchDisk.turntable].disks[leftSwitchDisk.disk].handleVolumeChange({ target: { value: leftSwitchDiskVolume } })
        this.turntables[rightSwitchDisk.turntable].disks[rightSwitchDisk.disk].handleVolumeChange(e)

        this.setState({
            leftSwitchDisk: { ...leftSwitchDisk, volume: leftSwitchDiskVolume },
            rightSwitchDisk: { ...rightSwitchDisk, volume: rightSwitchDiskVolume }
        })
    }

    handleNewTurnTableNameChange = (e) => {
        const newTurntableName = e.target.value
        this.setState({ newTurntableName })
    }

    onAddTurntableClicked = () => {
        this.props.addTurntable(this.state.newTurntableName)
        this.setState({ newTurntableName: "" })
    }

    removeTurntable = (turntableIndex) => {
        this.turntables.splice(turntableIndex, 1)
        this.props.removeTurntable(turntableIndex)
    }

    render() {

        const { selectedTurntable, isMasterPaused, isMasterMuted,
            leftSwitchDisk, rightSwitchDisk,
            newTurntableName,
        } = this.state

        const { turntables, title } = this.props

        return (
            <Wrapper>
                <h1>{title}</h1>
                <div style={{ marginBottom: "0.5rem" }}>
                    <PauseButton title="pause master" onClick={this.toggleMasterPaused} isActive={isMasterPaused} />
                    <MuteButton title="mute master" onClick={this.toggleMasterMuted} isActive={isMasterMuted} />
                    <RestartButton title="restart master" onClick={this.toggleMasterRestart} />
                </div>
                <TurntablesWrapper>
                    <KeyHandler
                        keyEventName={KEYDOWN}
                        code={('ArrowRight').toString()}
                        onKeyHandle={(ev) => this.selectTurntable(ev, selectedTurntable + 1)}
                    />
                    <KeyHandler
                        keyEventName={KEYDOWN}
                        code={('ArrowLeft').toString()}
                        onKeyHandle={(ev) => this.selectTurntable(ev, selectedTurntable - 1)}
                    />
                    {turntables && turntables.map((turntable, i) =>
                        <Turntable
                            onRef={ref => {
                                if (ref)
                                    this.turntables[i] = ref
                                else delete this.turntables[i]
                            }}
                            key={i}
                            turntableIndex={i}
                            isSelected={i === selectedTurntable}
                            setDiskSwitch={this.setDiskSwitch}
                            name={turntable.name}
                            disks={turntable.disks}
                            addDisk={(newDiskName, newDiskSrc) => this.props.addDisk(i, newDiskName, newDiskSrc)}
                            removeTurntable={() => this.removeTurntable(i)}
                            removeDisk={(diskIndex) => this.props.removeDisk(i, diskIndex)}
                        />)}
                    <div style={{ display: "flex" }}>
                        <StyledInput placeholder="new turntable name" value={newTurntableName} onChange={this.handleNewTurnTableNameChange} />
                        <AddButton title="add turntable" disabled={!newTurntableName} onClick={this.onAddTurntableClicked} />
                    </div>
                </TurntablesWrapper>
                <SwitchWrapper>
                    <Switch
                        leftDisk={leftSwitchDisk}
                        rightDisk={rightSwitchDisk}
                        handleSwitchVolumeChange={this.handleSwitchVolumeChange}
                    />
                </SwitchWrapper>
            </Wrapper>
        )
    }
}

const StyledInput = styled.input`
    color: ${({ theme }) => theme.text};
    background: none;
    border: none;
    font-size: 0.85rem;
    
    ::placeholder {
        font-style: italic;
        color: grey;
        text-decoration: underline;
    }
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
`

const SwitchWrapper = styled.div`
    justify-content: center;
    display: flex;
    position: absolute;
    bottom: 1.25rem;
`

const TurntablesWrapper = styled.div`
    display: flex;
    flex-direction: row;
    overflow: scroll;
    width: 100%;
    border-top: 1px solid grey;
`

export default Rack;