import React from 'react'
import {DiagramEngine} from "@projectstorm/react-diagrams";
import {CustomNodeModel} from "./CustomNodeModel";
import {AbstractReactFactory} from '@projectstorm/react-canvas-core'
import {CustomNodeWidget} from "./CustomNodeWidget";

export class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {
  constructor() {
    super('custom-node');
  }

  generateModel(event: any): CustomNodeModel {
    return new CustomNodeModel();
  }

  generateReactWidget(event: any): JSX.Element {
    return <CustomNodeWidget engine={this.engine as DiagramEngine} node={event.model} />
  }
}