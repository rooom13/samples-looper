import React, { Component } from 'react';

// import styled from 'styled-components'

import Rack from './components/Rack'


class App extends Component {

  state = {}




  componentDidMount() {

    let search = window.location.search;
    let params = new URLSearchParams(search);
    let foo = params.get('folder');

    const loops175URL = '/api/loops/inFolders/' + (foo || 175) 
    // const loops0URL = '/api/loops/inFolders/0'

    console.log(loops175URL)
    fetch(loops175URL)
      .then(response => response.json())
      .then(data => {
        this.setState(
          {
            categories: data.folders,
            categorisCount: data.folders.lenght,
            loops175: data.folders,
            hasData: true,

          })

      })
  }


  render() {
    const { hasData, categories } = this.state


    if (!hasData) return <div>Loading</div>

    return (
      <Rack turntables={categories} />
    )
  }
}



export default App;
