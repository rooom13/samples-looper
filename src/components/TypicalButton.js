import styled from 'styled-components'

const TypicalButton = styled.button`
    color: ${({ theme }) => theme.buttonText};
    background-color: ${({ isActive, theme }) => isActive ? theme.buttonActive : theme.button};
`

export default TypicalButton