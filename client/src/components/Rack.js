import React, { Component } from 'react';
import styled from 'styled-components'
import KeyHandler, { KEYDOWN } from 'react-key-handler'
import Turntable from './Turntable/Turntable'

class Rack extends Component {

    state = {
        selectedTurntable: 0,
        isSelected: false

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
    render() {

        const { selectedTurntable } = this.state
        const { turntables, title } = this.props

        return (
            <div>
                <h1>{title}</h1>
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
                    {turntables.map((turntable, i) => <Turntable isSelected={i === selectedTurntable} key={i} name={turntable.name} disks={turntable.loops} />)}
                </TurntablesWrapper>
            </div>
        )
    }
}


const TurntablesWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

export default Rack;