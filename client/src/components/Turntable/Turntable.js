import React, { Component, Fragment } from 'react';
// import styled from 'styled-components'
import KeyHandler, { KEYPRESS } from 'react-key-handler'
import Disk from './Disk/Disk'


class Turntable extends Component {

    state = {
        selectedDisk: 0

    }

    selectDisk = (ev, disk) => {
        ev.preventDefault()
        this.setState({ selectedDisk: disk })
    }
    render() {
        let diskCount = 0
        const { selectedDisk } = this.state
        return (
            this.props.disks.map(loop => {
                const diskIndex = diskCount
                diskCount++
                return (<Fragment key={loop}>
                    <KeyHandler
                        keyEventName={KEYPRESS}
                        keyValue={(diskIndex + 1).toString()}
                        onKeyHandle={(ev) => this.selectDisk(ev, diskIndex)}
                    />

                    <Disk
                        src={loop}
                        index={diskIndex + 1}
                        isSelected={selectedDisk === diskIndex} >{loop}</Disk>
                </Fragment>)
            }

            )

        )
    }


}

export default Turntable;