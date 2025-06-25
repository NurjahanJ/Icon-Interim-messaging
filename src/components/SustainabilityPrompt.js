import React, { useState } from 'react';

const SustainabilityPrompt = ({ onRespond }) => {
  const [showTips, setShowTips] = useState(false);

  const handleResponse = (response) => {
    if (response) {
      setShowTips(true);
    }
    onRespond(response);
  };

  return (
    <div className="max-w-xl mx-auto bg-green-100 border border-green-400 text-green-900 px-4 py-4 rounded-xl shadow mb-6">
      <p className="mb-3">
        🌱 <strong>Did you know?</strong> This prompt emits ~4g of CO₂ and uses about 10mL of water.
        Would you like to learn how to prompt more efficiently?
      </p>
      {!showTips && (
        <div className="flex space-x-3 mb-4">
          <button
            onClick={() => handleResponse(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Yes
          </button>
          <button
            onClick={() => handleResponse(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            No
          </button>
        </div>
      )}
      {showTips && (
        <div className="text-sm">
          <p className="font-semibold mb-2">✅ Prompt Efficiency Checklist</p>
          <table className="w-full text-left border-collapse border border-green-300">
            <thead className="bg-green-200">
              <tr>
                <th className="border border-green-300 px-2 py-1">Tip</th>
                <th className="border border-green-300 px-2 py-1">What to Do</th>
                <th className="border border-green-300 px-2 py-1">Why it Helps</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">Be concise</td>
                <td className="border px-2 py-1">Use clear, focused prompts</td>
                <td className="border px-2 py-1">Reduces compute time</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Batch questions</td>
                <td className="border px-2 py-1">Ask related things in one prompt</td>
                <td className="border px-2 py-1">Cuts down prompt count</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Add constraints</td>
                <td className="border px-2 py-1">Set limits (length, format, topic)</td>
                <td className="border px-2 py-1">Avoids overgeneration</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Refine, don’t restart</td>
                <td className="border px-2 py-1">Edit instead of regenerating from scratch</td>
                <td className="border px-2 py-1">Reduces token usage</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Use GPT-3.5 for simple tasks</td>
                <td className="border px-2 py-1">Choose the right model</td>
                <td className="border px-2 py-1">Lowers resource usage</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">Use alternatives</td>
                <td className="border px-2 py-1">Try simple tools when possible</td>
                <td className="border px-2 py-1">Saves server energy</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SustainabilityPrompt;
