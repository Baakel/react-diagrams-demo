import React from "react";
import * as _ from 'lodash';
import styled from "@emotion/styled";
import {DefaultPortLabel, DiagramEngine, PortModel, PortModelGenerics, PortWidget} from "@projectstorm/react-diagrams";
import {CustomNodeModel} from "./CustomNodeModel";
import Modal from "../widgets/Modal";

export const CNode = styled.div<{background: string; selected:boolean}>`
  background-color: ${(p) => p.background};
  border-radius: 5px;
  font-family: sans-serif;
  color: white;
  border: solid 2px black;
  overflow: visible;
  font-size: 11px;
  border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};
`

export const CTitle = styled.div`
  background: rgba(0,0,0,0.3);
  display: flex;
  white-space: nowrap;
  justify-items: center;
`

export const CTitleName = styled.div`
  flex-grow: 1;
  padding: 5px 5px;
`

export const CPorts = styled.div`
  display: flex;
  background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2));
`

export const CPortsContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
  &:first-of-type {
    margin-right: 10px;
  }
  
  &:only-child {
    margin-right: 0;
  }
`

export interface CustomNodeWidgetProps {
  node: CustomNodeModel;
  engine: DiagramEngine;
}

export interface CustomNodeWidgetState {
  showModal: boolean;
  modifiedName: string;
}

export function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>, target: any) {
  // console.log(event.target)
  // console.log(target.node)
  // target.node.color = "rgb(0,150,255)"
  // target.engine.repaintCanvas()
  target.setState({showModal: true})
}

export function handleSubmit(target: any) {
  target.props.node.name = target.state.modifiedName
}

export class CustomNodeWidget extends React.Component<CustomNodeWidgetProps, CustomNodeWidgetState> {

  constructor(props: CustomNodeWidgetProps) {
    super(props);
    this.state = {
      showModal: false,
      modifiedName: this.props.node.name
    };
  }

  handleChange = (e: any) => {
    this.setState({modifiedName: e.target.value})
  }

  generatePorts = (port: any) => {
    return <DefaultPortLabel port={port} engine={this.props.engine} key={port.getID()} />;
  }

  render() {
    // @ts-ignore
    const inPort: PortModel<PortModelGenerics> = this.props.node.getPort('in')
    // @ts-ignore
    const outPort: PortModel<PortModelGenerics> = this.props.node.getPort('out')

    // return (
    //   <div className="custom-node" onDoubleClick={(event) => {
    //     console.log(this)
    //     console.log(event)
    //     this.props.node.color = "rgb(0,150,255)"
    //   }}>
    //     <PortWidget port={inPort} engine={this.props.engine}>
    //       <div className="circle-port" />
    //     </PortWidget>
    //     <PortWidget port={outPort} engine={this.props.engine}>
    //       <div className="circle-port" />
    //     </PortWidget>
    //     <div className="custom-node-color" style={{backgroundColor: this.props.node.color}} />
    //   </div>
    // );
    return (
      <CNode
        background={this.props.node.color}
        selected={this.props.node.isSelected()}
        data-default-node-name={this.props.node.name}
        onDoubleClick={(event) => {handleDoubleClick(event, this)}}
      >
        <CTitle>
          <CTitleName>{this.props.node.name}</CTitleName>
        </CTitle>
        <CPorts>
          <CPortsContainer>{_.map(this.props.node.getPorts(), this.generatePorts)}</CPortsContainer>
          {/*<CPortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</CPortsContainer>*/}
        </CPorts>
        <Modal
          title={"Configuration for " + this.props.node.name}
          onClose={() => this.setState({showModal: false})}
          show={this.state.showModal}>
          <h5>Change Name</h5>
          <input type="text" value={this.state.modifiedName} onChange={this.handleChange}/>
          <button className="button" onClick={() => {handleSubmit(this)}}>Save changes</button>
        </Modal>
      </CNode>
    )
  }
}