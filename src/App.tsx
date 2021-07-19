import React from 'react';

import createEngine, {
    DefaultLinkModel,
    DefaultNodeModel,
    DiagramModel
} from "@projectstorm/react-diagrams";

import { CanvasWidget } from '@projectstorm/react-canvas-core'

function App() {
    // Creating the React-Diagrams Engine
    const engine = createEngine();

    // Adding nodes with ports
    const node1 = new DefaultNodeModel({
        name: "Node 1",
        color: "rgb(255,255,0)",
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort("Out");

    const node2 = new DefaultNodeModel({
        name: "Node 2",
        color: "rgb(0,255,255)",
    });
    node2.setPosition(200, 200)
    let portIn2 = node2.addInPort("In")
    let port2 = node2.addOutPort("Out");

    // Initiating a diagram. You could skip this part if you are deserializing a pre-existing model
    const model = new DiagramModel();
    model.addAll(node1, node2);
    engine.setModel(model);

    // Helper function for serializing current model.
    const serializeModel = () => {
        let modelString = JSON.stringify(model.serialize())
        console.log(modelString)
    }

    // Helper function for deserializing a model based on the initial model, modifying only the position and name of the first node
    const deserModel = () => {
        // Needed because node ID's change on every refresh
        const fakeModelStr = JSON.stringify(model.serialize())
        let fakeModel = JSON.parse(fakeModelStr)
        let newFakeModel = new DiagramModel();
        // This part could be skipped if importing a pre-existing model from a file
        const nodes = model.getNodes()
        const node1ID = nodes[0].getID()

        // Modifying the fakemodel position and name but this is not necessary when importing
        fakeModel.layers[1].models[node1ID].x = 500
        fakeModel.layers[1].models[node1ID].y = 500
        fakeModel.layers[1].models[node1ID].name = "New Node 1"

        // Actual import of new model
        newFakeModel.deserializeModel(fakeModel, engine)
        engine.setModel(newFakeModel)
    }

  return (
    <div className="App">
      <div className="sidebar">
        <h1>Options</h1>
        <button onClick={deserModel}>Deserialize Fake Model</button>
        <button onClick={serializeModel}>Serialize</button>
      </div>
      <CanvasWidget engine={engine} className="content" />
    </div>
  );
}

export default App;
