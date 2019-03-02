import React, { Component } from 'react';
import styled from 'styled-components'
import { scale } from '../../../utils/functions';

class Animation extends Component {

    img = new Image('./public/sprites/disk.png')

    componentDidMount() {
        this.paintWave();
    }
    componentDidUpdate() {
        this.paintBar();
    }

    paintBar(){

        const progress = this.props.progress
        // console.log(this.props.progress)
        let canvas = document.getElementById(`${this.props.idSrc}f`)
        let ctx = canvas.getContext("2d");

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);


        ctx.fillStyle = 'red';

        const xsize = 1

        // const salto = Math.floor(channel0.length / amount)

        const x = scale(progress,0,100,0,WIDTH)

        ctx.fillRect(x,0,xsize,HEIGHT)

        // const value1 = Math.abs(channel0[i * salto]) * HEIGHT / 2
        // const value2 = Math.abs(channel1[i * salto]) * HEIGHT / 2

        // ctx.fillRect(i * xsize, HEIGHT / 2, xsize, - (value1 + minSize))
        // ctx.fillRect(i * xsize, HEIGHT / 2, xsize, + (value2 + minSize))
    }


    

    paintWave() {

        const buffer = this.props.buffer
        let canvas = document.getElementById(`${this.props.idSrc}b`)
        let ctx = canvas.getContext("2d");
        const channel0 = buffer.getChannelData(0)
        const channel1 = buffer.getChannelData(1)
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);


        const xsize = 1
        const amount = WIDTH / xsize
        const salto = Math.floor(channel0.length / amount)

        // ctx.fillStyle = 'black';
        // ctx.fillRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = 'black';
        for (var i = 0; i < channel0.length - salto; i++) {
            const value1 = Math.abs(channel0[i * salto]) * HEIGHT / 2
            const value2 = Math.abs(channel1[i * salto]) * HEIGHT / 2

            ctx.fillRect(i * xsize, HEIGHT / 2, xsize, - (value1 ))
            ctx.fillRect(i * xsize, HEIGHT / 2, xsize, + (value2 ))
        }


    }

    render() {
        const { width, height, idSrc } = this.props;
        return (
            <CanvasWrapper    width={width}
            height={height}>

                <CanvasBack
                id={idSrc + 'b'}
                width={width}
                height={height}
                />
                 <CanvasFront
                id={idSrc + 'f'}
                    width={width}
                    height={height}
                 />
            </CanvasWrapper>
        );
    }
}

const CanvasWrapper = styled.div`
    position: relative;
    ${props=> 'width: ' + props.width + 'px;height: ' + props.height + 'px;'}
`
const CanvasBack = styled.canvas`
    position: absolute; 
    left: 0; 
    top: 0; 
    z-index: 0;  
`
const CanvasFront = styled.canvas`
    position: absolute; 
    left: 0; 
    top: 0; 
    z-index: 1;  
`


export default Animation