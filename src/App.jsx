import { useState } from "react";

function Bmi() {
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm"); // cm | ft
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg"); // kg | lbs
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    let heightCm = 0;
    let weightKg = 0;

    // konverzija visine
    if (heightUnit === "cm") {
      heightCm = parseFloat(height);
    } else if (heightUnit === "ft") {
      // korisnik može uneti 5.9 za ~5'9''
      const parts = height.split(".");
      const feet = parseInt(parts[0]) || 0;
      const inches = parseInt(parts[1]) || 0;
      heightCm = feet * 30.48 + inches * 2.54;
    }

    // konverzija težine
    if (weightUnit === "kg") {
      weightKg = parseFloat(weight);
    } else if (weightUnit === "lbs") {
      weightKg = parseFloat(weight) * 0.453592;
    }

    const h = heightCm / 100; // cm → m
    const bmiValue = (weightKg / (h * h)).toFixed(1);
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
        {/* Height */}
        <div>
          <label className="block mb-1">Height:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={
                heightUnit === "cm" ? "e.g. 180" : "e.g. 5.9 (ft.in)"
              }
              className="flex-1 p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
            />
            <select
              value={heightUnit}
              onChange={(e) => setHeightUnit(e.target.value)}
              className="p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
            >
              <option value="cm">cm</option>
              <option value="ft">ft/in</option>
            </select>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block mb-1">Weight:</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={weightUnit === "kg" ? "e.g. 75" : "e.g. 165"}
              className="flex-1 p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>
        </div>

        {/* Calculate button */}
        <button
          onClick={calculateBMI}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Calculate
        </button>

        {/* Results */}
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
