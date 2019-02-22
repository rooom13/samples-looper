import React, { Component } from 'react';

class Animation extends Component {
    constructor(props) {
        super(props);
        this.paint = this.paint.bind(this);
    }

    img = new Image('./public/sprites/disk.png')

    componentDidUpdate() {
        this.paint();
    }

    paint() {
        const { width, height } = this.props;
        const ctx = this.refs.canvas.getContext("2d");
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(width/2, width/2, width/2, 0, 2 * Math.PI);
        ctx.stroke();

        // context.save();
        // context.translate(width/2, height/2);
        // context.rotate(rotation, 0, 0);
        // context.fillStyle = 'black';
        // context.fillRect(0, 0, height/2, height/2);
        // context.restore();
    }

    render() {
        const { width, height } = this.props;
        return (
            <canvas
                style={{ border: "1px solid black" }}
                ref="canvas"
                width={width}
                height={height}
            />
        );
    }
}


export default Animation