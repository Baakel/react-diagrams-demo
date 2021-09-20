import {
  LinkModel,
  PortModel,
  PortModelAlignment,
  PortModelGenerics,
  PortModelOptions
} from '@projectstorm/react-diagrams-core';
import {AbstractModelFactory, DeserializeEvent} from "@projectstorm/react-canvas-core";
import {DefaultLinkModel} from "@projectstorm/react-diagrams";

export interface CustomPortModelOptions extends PortModelOptions {
  label?: string;
  in?: boolean;
}

export interface CustomPortModelGenerics extends PortModelGenerics {
  OPTIONS: CustomPortModelOptions
}

export interface CameraPortModelOptions extends PortModelOptions {
  label?: string;
  player?: boolean;
}

export interface CameraPortModelGenerics extends PortModelGenerics {
  OPTIONS: CameraPortModelOptions
}

export interface PosePortModelOptions extends PortModelOptions {
  label?: string;
  skeleton?: boolean;
}

export interface PosePortModelGenerics extends PortModelGenerics {
  OPTIONS: PosePortModelOptions
}

export class CameraPortModel extends PortModel<CameraPortModelGenerics> {
  constructor(isPlayer: boolean, name?: string, label?: string);
  constructor(options: CameraPortModelOptions);
  constructor(options: CameraPortModelOptions | boolean, name?: string, label?: string) {
    if (!!name) {
      options = {
        player: !!options,
        name: name,
        label: label
      };
    }
    options = options as CameraPortModelOptions;
    super({
      label: options.label || options.name,
      alignment: options.player ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
      type: 'camera',
      ...options
    });
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.options.player = event.data.player;
    this.options.label = event.data.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      player: this.options.player,
      label: this.options.label
    };
  }

  link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T {
    let link = this.createLinkModel(factory);
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link as T;
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    let link = super.createLinkModel();
    if (!link && factory) {
      return factory.generateModel({});
    }
    return link || new DefaultLinkModel();
  }

  canLinkToPort(port: PortModel): boolean {
    if (port instanceof CameraPortModel) {
      return this.options.player !== port.getOptions().player;
    }
    return false;
  }
}

export class PosePortModel extends PortModel<PosePortModelGenerics> {
  constructor(isSkeleton: boolean, name?: string, label?: string);
  constructor(options: PosePortModelOptions);
  constructor(options: PosePortModelOptions | boolean, name?: string, label?: string) {
    if (!!name) {
      options = {
        skeleton: !!options,
        name: name,
        label: label
      };
    }
    options = options as PosePortModelOptions;
    super({
      label: options.label || options.name,
      alignment: options.skeleton ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
      type: 'pose',
      ...options
    });
  }

  link<T extends LinkModel>(port: PortModel, factory?: AbstractModelFactory<T>): T {
    let link = this.createLinkModel(factory);
    link.setSourcePort(this);
    link.setTargetPort(port);
    return link as T;
  }

  createLinkModel(factory?: AbstractModelFactory<LinkModel>): LinkModel {
    let link = super.createLinkModel();
    if (!link && factory) {
      return factory.generateModel({});
    }
    return link || new DefaultLinkModel();
  }

  canLinkToPort(port: PortModel): boolean {
    if (port instanceof PosePortModel) {
      return this.options.skeleton !== port.getOptions().skeleton;
    }
    return false;
  }
}

export class CustomPortModel extends PortModel<CustomPortModelGenerics> {
  constructor(options: CustomPortModelOptions);
  constructor(options: CustomPortModelOptions | boolean, name?: string, label?: string) {
    if (!!name) {
      options = {
        in: !!options,
        name: name,
        label: label
      };
    }
    options = options as CustomPortModelOptions
    super({
      label: options.label || options.name,
      alignment: options.in ? PortModelAlignment.LEFT : PortModelAlignment.RIGHT,
      type: 'default',
      ...options
    });
  }

  canLinkToPort(port: PortModel): boolean {
    if (port instanceof CustomPortModel) {
      return this.options.in !== port.getOptions().in;
    }
    return true
  }
}