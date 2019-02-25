import React, { Component } from 'react';
import styled from 'styled-components'
import KeyHandler, {  KEYDOWN } from 'react-key-handler'
import Turntable from './Turntable/Turntable'

class Rack extends Component {

    state = {
        selectedTurntable: 0,
        isSelected: false

    }

    selectTurntable = (ev, turntable) => {
        ev.preventDefault()
        if (turntable < 0) turntable = this.props.turntables.length
        else if (turntable > this.props.turntables.length) turntable = 0

        this.setState({ selectedTurntable: turntable })
    }
    render() {

        const { selectedTurntable } = this.state
        const { turntables } = this.props
        let turntableCount = 0

  
        return (

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

                {turntables.map(turntable => {
                    const turntableIndex = turntableCount
                    ++turntableCount
                    return (
                        <Turntable isSelected={turntableIndex === selectedTurntable} key={turntableCount} name={turntable.name} disks={turntable.loops} />
                    )
                }
                )}
            </TurntablesWrapper>
        )
    }
}


const TurntablesWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

export default Rack;