import React, {useState} from 'react';
import * as _ from "lodash";
import createEngine, {
  DefaultLinkModel,
  DefaultNodeModel,
  DiagramModel
} from "@projectstorm/react-diagrams";
import { CanvasWidget, Action, ActionEvent, InputType, BaseEvent } from '@projectstorm/react-canvas-core'
import {CustomNodeFactory} from './custom-node-models/CustomNodeFactory'
import {CustomNodeModel} from "./custom-node-models/CustomNodeModel";


function App() {
    // Creating the React-Diagrams Engine
    const engine = createEngine();

    engine.getNodeFactories().registerFactory(new CustomNodeFactory())

    // Creating empty model for state storing
    let savedModel: string;

    // Adding nodes with ports
    const node1 = new DefaultNodeModel({
        name: "Node 1",
        color: "rgb(0,255,50)",
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort("Out");

    const node2 = new DefaultNodeModel({
        name: "Node 2",
        color: "rgb(0,255,255)",
    });
    node2.setPosition(200, 200)
    let portIn2 = node2.addInPort("In")
    // let port2 = node2.addOutPort("Out");

    const node3 = new CustomNodeModel({
      color: "rgb(250,240,0)",
      name: "Custom Node 1"
    })
    node3.setPosition(300,300)

    let link1 = port1.link(portIn2)

    // Initiating a diagram. You could skip this part if you are deserializing a pre-existing model
    let model = new DiagramModel();
    model.addAll(node1, node2, node3, link1)

    engine.setModel(model);
    // engine.getActionEventBus().registerAction(new ConfigNodeAction());

    // Helper function for serializing current model.
    const serializeModel = () => {
        let modelString = JSON.stringify(model.serialize())
        console.log(modelString)
        savedModel = modelString
    }

    // Helper function for deserializing a model based on the initial model, modifying only the position and name of the first node
    const deserModel = () => {
        // Needed because node ID's change on every refresh
        let fakeModel = JSON.parse(savedModel)

        // Commenting this part out since we are actually skipping it now.
        // // This part could be skipped if importing a pre-existing model from a file
        // const nodes = model.getNodes()
        // const node1ID = nodes[0].getID()

        // // Modifying the fakemodel position and name but this is not necessary when importing
        // fakeModel.layers[1].models[node1ID].x = 500
        // fakeModel.layers[1].models[node1ID].y = 500
        // fakeModel.layers[1].models[node1ID].name = "New Node 1"

        // Actual import of new model
        model.deserializeModel(fakeModel, engine)
        engine.setModel(model)
    }

  return (
    <div className="App">
      <div className="sidebar">
        <h1>Options</h1>
        <button onClick={deserModel} className="button">Restore Model</button>
        <button onClick={serializeModel} className="button">Save Model</button>
        {/* Draggable node. The dataTransfer.setData allows us to listen to the event on the canvas and see what is being dragged */}
        <div
          className="in-node"
          draggable={true}
          onDragStart={event => {
            // Notice the name tray-diagram-node as you need to use the exact same in the "wrapper" div
            event.dataTransfer.setData("tray-diagram-node", JSON.stringify({type: "in"}))
          }}>
          In Node
        </div>
        <div
          className="out-node"
          draggable={true}
          onDragStart={event => {
            event.dataTransfer.setData("tray-diagram-node", JSON.stringify({type: "out"}))
          }}>
          Out Node
        </div>
        <div
          className="double-node"
          draggable={true}
          onDragStart={event => {
            event.dataTransfer.setData("tray-diagram-node", JSON.stringify({type: "double"}))
          }}>
          Double Node
        </div>
        <div
          className="custom-node-sidebar"
          draggable={true}
          onDragStart={event => {
            event.dataTransfer.setData("tray-diagram-node", JSON.stringify({type: "custom"}))
          }}>
          Custom Node
        </div>
      </div>
      {/* We need to use a wrapper since the canvas widget doesn't allow for onDrag/onDrop events on itself. */}
      <div
        className="wrapper"
        onDrop={event => {
          // Get the onDrag data from above, notice the tray-diagram-node format.
          let data = JSON.parse(event.dataTransfer.getData("tray-diagram-node"));
          let nodesCount = _.keys(engine.getModel().getNodes()).length

          // You can add other node types with multiple ports if you want to.
          let node: DefaultNodeModel | CustomNodeModel;
          if (data.type === "in") {
            node = new DefaultNodeModel(`Node${nodesCount+1}`, "rgb(0,255,255)");
            node.addInPort("In");
          } else if (data.type === "out") {
            node = new DefaultNodeModel(`Node${nodesCount + 1}`, "rgb(0,255,50)");
            node.addOutPort("Out");
          } else if (data.type === "custom") {
            node = new CustomNodeModel({name:`CustomNode${nodesCount + 1}`, color: "rgb(0,150,255)"});
          } else {
            node = new DefaultNodeModel(`Node${nodesCount+1}`, "rgb(255,0,255)");
            node.addOutPort("Out")
            node.addInPort("In")
          }

          // After adding the node to the model notice the engine.setModel call to update state, without it the model wont update in the DOM
          let position = engine.getRelativeMousePoint(event);
          node.setPosition(position);
          model.addNode(node);
          engine.setModel(model)
        }}
        onDragOver={event => {
          // The preventDefault function is needed for the drop to work. Otherwise it tries to import the div from clipboard.
          event.preventDefault();
        }}
        // onDoubleClick={event => {
        //   console.log("Event is")
        //   console.log(event)
        // }}
      >
        <CanvasWidget
          engine={engine}
          className="content" />
      </div>
    </div>
  );
}

export default App;