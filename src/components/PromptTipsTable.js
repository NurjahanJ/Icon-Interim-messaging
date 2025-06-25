import React from 'react';

const PromptTipsTable = () => (
  <div className="bg-green-50 border border-green-200 text-sm text-gray-800 p-4 rounded-xl shadow mt-4 max-w-3xl mx-auto">
    <h3 className="font-semibold mb-2 text-green-800">✅ Prompt Efficiency Checklist</h3>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="p-2 border-b font-medium">Tip</th>
          <th className="p-2 border-b font-medium">What to Do</th>
          <th className="p-2 border-b font-medium">Why It Helps</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2 border-b">Be concise</td>
          <td className="p-2 border-b">Use clear, focused prompts</td>
          <td className="p-2 border-b">Reduces compute time</td>
        </tr>
        <tr>
          <td className="p-2 border-b">Batch questions</td>
          <td className="p-2 border-b">Ask related things in one prompt</td>
          <td className="p-2 border-b">Cuts down prompt count</td>
        </tr>
        <tr>
          <td className="p-2 border-b">Add constraints</td>
          <td className="p-2 border-b">Set limits (length, format, topic)</td>
          <td className="p-2 border-b">Avoids overgeneration</td>
        </tr>
        <tr>
          <td className="p-2 border-b">Refine, don’t restart</td>
          <td className="p-2 border-b">Edit outputs instead of regenerating</td>
          <td className="p-2 border-b">Reduces token usage</td>
        </tr>
        <tr>
          <td className="p-2 border-b">Choose the right model</td>
          <td className="p-2 border-b">Use GPT-3.5 for simple tasks</td>
          <td className="p-2 border-b">Lower resource usage</td>
        </tr>
        <tr>
          <td className="p-2">Use alternatives</td>
          <td className="p-2">Look up simple facts elsewhere</td>
          <td className="p-2">Saves server energy</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PromptTipsTable;
