import styled from 'styled-components'


const BaseButton = styled.button`
    cursor: pointer;
`

export const TypicalButton = styled(BaseButton)`
    color: ${({ theme }) => theme.buttonText};
    background-color: ${({ isActive, theme }) => isActive ? theme.buttonActive : theme.button};
    border-radius: 5px;
`

const EmojiButton = styled(BaseButton)`
    border: none;
    background: none;
    ::before {
        content: "${props => props.isActive ? props.emojiActive : props.emojiInactive}";
    }
    font-size: 1rem;

    &:hover {
        font-style: italic;
    }
`

export const DeleteButton = (props) => {
    return <EmojiButton {...props} emojiActive={'❌'} isActive />
}

export const PauseButton = (props) => {
    return <EmojiButton {...props} emojiActive={'▶️'} emojiInactive={'⏸️'} />
}

export const MuteButton = (props) => {
    return <EmojiButton {...props} emojiActive={'🔇'} emojiInactive={'🔊'} />
}

export const RestartButton = (props) => {
    return <EmojiButton {...props} emojiActive={'💥'} emojiInactive={'🔄'} />
}

export const LoopButton = (props) => {
    return <EmojiButton {...props} emojiActive={'🔁'} isActive />
}

export const AddButton = (props) => {
    return <EmojiButton {...props} emojiActive={'+'} isActive style={{ color: "lime", fontWeight: "bold", fontSize: "x-large" }} />
}

export const LightsButton = (props) => {
    return <EmojiButton {...props} emojiActive={'🌞'} emojiInactive={'🌙'} />
}

export const SaveButton = (props) => {
    return <EmojiButton {...props} emojiActive={'💾'} isActive />
}

