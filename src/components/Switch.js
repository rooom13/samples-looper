import { React } from 'react'
import styled from 'styled-components'
import { VolumeRange } from './VolumeRange'


export const Switch = (props) => {
    const { leftDisk, rightDisk } = props
    console.log(leftDisk, rightDisk)
    return <Wrapper>
        <h3>Switch</h3>
        <Row>
            <DiskSummary 
                diskName={leftDisk.name}
                diskIndex={leftDisk.disk}
                turntableIndex={leftDisk.turntable}
            />
            <Column>
                <span style={{ width: "3.5rem", textAlign: "right" }}>{(leftDisk.volume * 100).toFixed()} %</span>
            </Column>
            <Column>
                <VolumeRange value={rightDisk.volume} onChange={props.handleSwitchVolumeChange} />
            </Column>
            <Column>
                <span style={{ width: "3.5rem", textAlign: "right" }}>{(rightDisk.volume * 100).toFixed()} %</span>
            </Column>
            <DiskSummary 
                diskName={rightDisk.name}
                diskIndex={rightDisk.disk}
                turntableIndex={rightDisk.turntable}
            />
        </Row>
    </Wrapper>
}


const DiskSummary = (props) => <Column>
        <div>📀 {props.diskName} [{props.diskIndex}]</div>
        <div>turntable: {props.turntableIndex}</div>
</Column>

const Column = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Wrapper = styled.div`
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.color};
    padding: 1rem;
    background-color: ${({ theme }) => theme.backgroundSwitch};
    text-align: center;
    box-shadow: ${({ theme }) => theme.shadow} 2px 2px 6px;
`