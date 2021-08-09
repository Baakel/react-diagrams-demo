import {NodeModel, DefaultPortModel} from "@projectstorm/react-diagrams";
import {BaseModelOptions, DeserializeEvent} from '@projectstorm/react-canvas-core'

export interface CustomNodeModelOptions extends BaseModelOptions {
  name?: string;
  color?: string;
}

export class CustomNodeModel extends NodeModel {
  name: string;
  color: string;
  protected portsIn: DefaultPortModel[];
  protected portsOut: DefaultPortModel[];

  constructor(options: CustomNodeModelOptions = {}) {
    super({
      ...options,
      type: 'custom-node'
    });

    this.color = options.color || 'rgb(245,0,0)'
    this.name = options.name || 'Custom Node'
    this.portsIn = [];
    this.portsOut = [];

    this.addPort(
      new DefaultPortModel({
        in: true,
        name: 'in'
      })
    )
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: 'out'
      })
    )
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.color
    };
  }

  deserialize(event: DeserializeEvent<this>): void {
    super.deserialize(event);
    this.color = event.data.color;
  }
}
