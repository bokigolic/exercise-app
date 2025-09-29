import { useState } from "react";

function Bmi() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    const h = height / 100; // cm → m
    const bmiValue = (weight / (h * h)).toFixed(1);
    setBmi(bmiValue);

    let cat = "";
    if (bmiValue < 18.5) cat = "Underweight";
    else if (bmiValue < 25) cat = "Normal weight";
    else if (bmiValue < 30) cat = "Overweight";
    else cat = "Obese";

    setCategory(cat);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">BMI Calculator</h1>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-80 space-y-4">
        <div>
          <label className="block mb-1">Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block mb-1">Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          />
        </div>
        <button
          onClick={calculateBMI}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Calculate
        </button>

        {bmi && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold">BMI: {bmi}</p>
            <p className="text-lg">{category}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bmi;
