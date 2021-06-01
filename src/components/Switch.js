import { React } from 'react'
import styled from 'styled-components'
import { VolumeRange } from './VolumeRange'


export const Switch = (props) => {
    const { leftDisk, rightDisk } = props
    return <Wrapper>
        <Row>
            <div>
                <div style={{ fontSize: "4rem" }}>🇱</div>
                <DiskSummary
                    diskName={leftDisk.diskName}
                    diskIndex={leftDisk.diskIndex}
                    turntableName={leftDisk.turntableName}
                    turntableIndex={leftDisk.turntableIndex}
                />
            </div>
            <div>
                <h3>Switch</h3>
                <Row>
                    <Column>
                        <span style={{ width: "3.5rem", textAlign: "right" }}>{(leftDisk.volume * 100).toFixed()} %</span>
                    </Column>
                    <Column>
                        <VolumeRange value={rightDisk.volume} onChange={props.handleSwitchVolumeChange} />
                    </Column>
                    <Column>
                        <span style={{ width: "3.5rem", textAlign: "right" }}>{(rightDisk.volume * 100).toFixed()} %</span>
                    </Column>
                </Row>
            </div>
            <div>
                <div style={{ fontSize: "4rem" }}>🇷</div>
                <DiskSummary
                    diskName={rightDisk.diskName}
                    diskIndex={rightDisk.diskIndex}
                    turntableName={rightDisk.turntableName}
                    turntableIndex={rightDisk.turntableIndex}
                />
            </div>
        </Row>
    </Wrapper>
}


const DiskSummary = (props) => <Column>

    <div>turntable: {props.turntableName} [{props.turntableIndex}]</div>
    <div>📀 {props.diskName} [{props.diskIndex}]</div>
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
    padding: 1rem;
    background-color: ${({ theme }) => theme.backgroundSwitch};
    text-align: center;
    box-shadow: 0px 0px 6px 1px ${({ theme }) => theme.shadow};
`