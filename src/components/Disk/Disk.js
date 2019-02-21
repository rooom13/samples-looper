import React, { Component } from 'react';
import styled from 'styled-components'
import Animation from './Animation'


class Disk extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotation: 0,
            isPaused: false,
            isMuted: false,
            isLoop: false,
        };
        
        this.audio=  new Audio('music/amen_break.wav')
        this.tick = this.tick.bind(this);
    }
    _isComponentMounted = false
    componentDidMount() {
        this._isComponentMounted = true
        requestAnimationFrame(this.tick);
        this.audio.play()
    }
    componentWillUnmount() {
        this._isComponentMounted = false
    }

    tick() {
        if (!this._isComponentMounted) return;
        const rotation = this.state.rotation + 0.1;
        this.setState({ rotation });
        requestAnimationFrame(this.tick);
    }

    render() {
        const { isSelected } = this.props
        const { isPaused, isMuted, isLoop } = this.props


        return (
            <Wrapper
                isSelected={isSelected}
            >
                < Column>
                    <Button isActive={isPaused} children={'P'} />
                    <Button children={'R'} />
                </Column>

                <Animation rotation={this.state.rotation} width={160} height={100} />
                < Column>
                    <Button isActive={isMuted} children={'M'} />
                    <Button isActive={isLoop} children={'L'} />
                </Column>
            </Wrapper>
        )
    }
}
const Button = styled.button`

height: 100%;

${(props) => (props.isActive && `
background-color: yellow;  `
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

    padding: 0.5rem;

    background-color: cyan;
    ${(props) => (props.isSelected && `
    background-color: red;  `
    )};
`


export default Disk  