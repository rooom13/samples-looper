import React from 'react'
import styled from 'styled-components'
import { SaveButton } from './Buttons'

const ProjectJSONEdit = (props) => {

  const { isInputValid, projectStr, handleProjectChange, onApplyClicked } = props
  return <Wrapper>
    <div style={{ position: "relative" }}>
      <h3>Edit project as JSON</h3>
      <div style={{ position: "relative", width: "800px", height: "400px", }}>
        <StyledTextarea
          value={projectStr}
          onChange={handleProjectChange} />
        <SaveButton
          title="apply and save changes"
          style={{ position: "absolute", top: "0.25rem", right: "0.25rem", fontSize: "1.25rem" }}
          disabled={!isInputValid}
          onClick={onApplyClicked} />
      </div>
    </div>
  </Wrapper>
}

const Wrapper = styled.div`
  box-shadow: 0px 0px 6px 1px ${({ theme }) => theme.shadow};
  border-radius: 5px;
  position: absolute;
  z-index: 1;
  background-color: ${({ theme }) => theme.body}
`

const StyledTextarea = styled.textarea`
  position: absolute;
  border-radius: 5px;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  background-color: black;
  color: white;
`
export default ProjectJSONEdit