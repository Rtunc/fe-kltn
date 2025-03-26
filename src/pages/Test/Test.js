import { useState } from "react";

function Card({ title, children }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Test() {
  const [models, setModels] = useState([
    { name: "Model A", lastTrained: "2025-03-25" },
    { name: "Model B", lastTrained: "2025-03-20" }
  ]);

  const handleTrainModel = (modelName) => {
    alert(`Training new version of ${modelName} with latest data...`);
    // Call backend API to trigger training
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model, index) => (
          <Card key={index} title={model.name}>
            <p>Last trained: {model.lastTrained}</p>
            <button onClick={() => handleTrainModel(model.name)} className="mt-2">
              Train New Model
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}