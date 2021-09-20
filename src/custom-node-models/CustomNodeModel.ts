import {NodeModel, DefaultPortModel} from "@projectstorm/react-diagrams";
import {BaseModelOptions, DeserializeEvent} from '@projectstorm/react-canvas-core'
import {CameraPortModel, PosePortModel} from "./CustomPortModel";

export interface CustomNodeModelOptions extends BaseModelOptions {
  name?: string;
  color?: string;
}

export class CustomNodeModel extends NodeModel {
  name: string;
  color: string;
  protected portsIn: DefaultPortModel[];
  protected portsOut: DefaultPortModel[];
  protected camPorts: CameraPortModel[];
  protected cloudPorts: CameraPortModel[];
  protected playPorts: CameraPortModel[];
  protected skeletonPorts: PosePortModel[];
  protected jointPorts: PosePortModel[];

  constructor(options: CustomNodeModelOptions = {}) {
    super({
      ...options,
      type: 'custom-node'
    });

    this.color = options.color || 'rgb(245,0,0)'
    this.name = options.name || 'Custom Node'
    this.portsIn = [];
    this.portsOut = [];
    this.camPorts = [];
    this.playPorts = [];
    this.cloudPorts = [];
    this.skeletonPorts = [];
    this.jointPorts = [];


    this.addPort(
      new CameraPortModel({
        player: true,
        name: 'player'
      })
    )

    this.addPort(
      new CameraPortModel({
        player: false,
        name: 'stream'
      })
    )

    this.addPort(
      new CameraPortModel({
        player: false,
        name: 'cloud'
      })
    )

    this.addPort(
      new PosePortModel({
        skeleton: false,
        name: 'joint'
      })
    )

    this.addPort(
      new PosePortModel({
        skeleton: true,
        name: 'skeleton'
      })
    )

    // this.addPort(
    //   new DefaultPortModel({
    //     in: true,
    //     name: 'in'
    //   })
    // )
    // this.addPort(
    //   new DefaultPortModel({
    //     in: false,
    //     name: 'out'
    //   })
    // )
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
