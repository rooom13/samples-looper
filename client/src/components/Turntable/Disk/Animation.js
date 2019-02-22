import React, { Component } from 'react';

class Animation extends Component {
    constructor(props) {
        super(props);
        this.paint = this.paint.bind(this);
    }

    componentDidUpdate() {
        this.paint();
    }

    paint() {
        const { width, height, rotation } = this.props;
        const context = this.refs.canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.save();
        context.translate(width/2, height/2);
        context.rotate(rotation, 0, 0);
        context.fillStyle = 'black';
        context.fillRect(0, 0, height/4, height/4);
        context.restore();
    }

    render() {
        const { width, height } = this.props;
        return (
            <canvas
            style={{border: "1px solid black"}}
                ref="canvas"
                width={width}
                height={height}
            />
        );
    }
}


export default Animation