import React, { Fragment } from 'react'


export const VolumeRange = (props) => {
    return <Fragment>🔊<input type="range" min="0" max="2" step="0.01" {...props} /> </Fragment>
}
