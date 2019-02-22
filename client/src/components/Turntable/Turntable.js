import React, { Component, Fragment } from 'react';
// import styled from 'styled-components'
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler'
import Disk from './Disk/Disk'


class Turntable extends Component {

    state = {
        selectedDisk: 0

    }

    selectDisk = (ev, disk) => {
        ev.preventDefault()
        if(disk < 0 ) disk = this.props.disks.length
        else if(disk > this.props.disks.length ) disk = 0
        
        this.setState({ selectedDisk: disk  })
    }
    render() {
        let diskCount = 0
        const { selectedDisk } = this.state
        return (

            <Fragment>
                 <KeyHandler
                            keyEventName={KEYDOWN}
                            code={('ArrowDown').toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, selectedDisk +1 )}
                        />
                 <KeyHandler
                            keyEventName={KEYDOWN}
                            code={('ArrowUp').toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, selectedDisk - 1 )}
                        />

                {this.props.disks.map(loop => {
                    const diskIndex = diskCount
                    diskCount++
                    return (<Fragment key={loop}>
                        <KeyHandler
                            keyEventName={KEYPRESS}
                            keyValue={(diskIndex + 1).toString()}
                            onKeyHandle={(ev) => this.selectDisk(ev, diskIndex)}
                        />

                        <Disk
                            selectDisk={this.selectDisk}
                            src={loop}
                            index={diskIndex + 1}
                            isSelected={selectedDisk === diskIndex} >{loop}</Disk>
                    </Fragment>)
                }

                )}
            </Fragment>

        )
    }


}

export default Turntable;