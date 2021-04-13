import React, { Component, Fragment } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYPRESS, KEYDOWN } from 'react-key-handler'
import Disk from './Disk/Disk'


class Turntable extends Component {

    state = {
        selectedDisk: 0,
        isSelected: false

    }

    selectDisk = (ev, disk) => {
        ev.preventDefault()
        const diskCount = this.props.disks.length - 1
        if (disk < 0) disk = diskCount
        else if (disk > diskCount) disk = 0

        this.setState({ selectedDisk: disk })
    }
    render() {

        let diskCount = 0
        const { selectedDisk } = this.state
        const { disks, isSelected } = this.props
        const subfolder= disks[0].split("/")[1]
        return (
            <Wrapper>
                <h3>{subfolder}</h3>
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
                {disks.map(loop => {
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
                            isTurntableSelected={isSelected}
                            isSelected={selectedDisk === diskIndex} >{loop}</Disk>
                    </Fragment>)
                }

                )}
            </Wrapper>

        )
    }


}

const Wrapper = styled.div`
    border: 2px solid black;
    width:100%;
`
export default Turntable;