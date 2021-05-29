import styled from 'styled-components'


const BaseButton = styled.button`
    cursor: pointer;
`

export const TypicalButton = styled(BaseButton)`
    color: ${({ theme }) => theme.buttonText};
    background-color: ${({ isActive, theme }) => isActive ? theme.buttonActive : theme.button};
`

export const DeleteButton = styled(BaseButton)`
    color: ${({ theme }) => theme.buttonText};
    border: none;
    background: none;
    ::before {
        content: "❌";
    }
    
    &:hover {
        font-style: italic;
    }
`

export const LightsButton = styled(BaseButton)`
    color: ${({ theme }) => theme.buttonText};
    border: none;
    background: none;
    ::before {
        content: "${(props) => props.isDark ? '🌞' : '🌙'}";
    }
    font-size: 1.5rem;

    &:hover {
        font-style: italic;
    }
`
