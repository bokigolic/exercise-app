import { useState } from "react";
import { motion } from "framer-motion";
import { Mars, Venus, Dumbbell, AlertCircle } from "lucide-react";

function Bmi() {
  const [gender, setGender] = useState("M");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [activity, setActivity] = useState("1.55");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hips, setHips] = useState("");
  const [bfMethod, setBfMethod] = useState("usNavy"); // usNavy or ymca

  const [results, setResults] = useState(null);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    if (!height || !weight || !age) return;
    setLoading(true);
    setResults(null);
    setWarning("");

    setTimeout(() => {
      let h = parseFloat(height);
      let w = parseFloat(weight);

      // Convert units
      if (heightUnit === "ft") {
        const feet = Math.floor(h);
        const inches = (h - feet) * 10;
        h = feet * 30.48 + inches * 2.54;
      }
      if (weightUnit === "lbs") {
        w = w * 0.453592;
      }

      const a = parseInt(age);

      // BMI
      const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
      let bmiCat = "";
      if (bmi < 18.5) bmiCat = "Underweight";
      else if (bmi < 25) bmiCat = "Normal";
      else if (bmi < 30) bmiCat = "Overweight";
      else bmiCat = "Obese";

      // BMR
      let bmr = 10 * w + 6.25 * h - 5 * a + (gender === "M" ? 5 : -161);

      // TDEE
      const tdee = bmr * parseFloat(activity);

      // IBW (Devine)
      let ibw = gender === "M" ? 50 + 0.9 * (h - 152) : 45.5 + 0.9 * (h - 152);

      // BSA (Mosteller)
      const bsa = Math.sqrt((h * w) / 3600);

      // Body Fat %
      let bf = null;
      if (bfMethod === "usNavy") {
        if (waist && neck && (gender === "M" || hips)) {
          if (gender === "M" && waist > neck) {
            bf =
              495 /
                (1.0324 -
                  0.19077 * Math.log10(waist - neck) +
                  0.15456 * Math.log10(h)) -
              450;
          } else if (gender === "F" && waist + parseFloat(hips) > neck) {
            bf =
              495 /
                (1.29579 -
                  0.35004 *
                    Math.log10(
                      parseFloat(waist) + parseFloat(hips) - parseFloat(neck)
                    ) +
                  0.221 * Math.log10(h)) -
              450;
          }
        }
      } else if (bfMethod === "ymca" && waist) {
        if (gender === "M") {
          bf = ((waist * 1.634 - 0.1804 * w - 98.42) / w) * 100;
        } else {
          bf = ((waist * 1.634 - 0.1804 * w - 76.76) / w) * 100;
        }
      }

      // Lean Body Mass
      const lbm = bf ? w * (1 - bf / 100) : null;

      // Warnings
      if (bf && (bf < 3 || bf > 60)) {
        setWarning(
          "⚠️ Body Fat % seems unrealistic. Please check your inputs."
        );
      }

      setResults({
        bmi,
        bmiCat,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        ibw: Math.round(ibw),
        bsa: bsa.toFixed(2),
        bf: bf ? bf.toFixed(1) : null,
        lbm: lbm ? lbm.toFixed(1) : null,
      });
      setLoading(false);
    }, 1500);
  };

  const cardsInfo = {
    bmi: {
      title: "BMI (Body Mass Index)",
      desc: "Ratio of weight to height. Indicates underweight, normal, overweight, or obesity.",
    },
    bmr: {
      title: "BMR (Basal Metabolic Rate)",
      desc: "Calories burned daily at rest – keeps your body alive (breathing, organs).",
    },
    tdee: {
      title: "TDEE (Total Daily Energy Expenditure)",
      desc: "Estimated daily calorie needs based on BMR and activity level.",
    },
    ibw: {
      title: "IBW (Ideal Body Weight)",
      desc: "Estimated 'healthy weight' range based on height and gender.",
    },
    bsa: {
      title: "BSA (Body Surface Area)",
      desc: "Total body surface area in m². Used in medicine and sports science.",
    },
    bf: {
      title: "Body Fat %",
      desc: "Percentage of your body weight that is fat tissue. Lower for athletes, higher for sedentary.",
    },
    lbm: {
      title: "LBM (Lean Body Mass)",
      desc: "Weight minus fat mass. Includes muscles, bones, water, organs.",
    },
  };

  const getScaleWidth = (val) => {
    const v = Math.min(40, Math.max(10, val));
    return `${((v - 10) / 30) * 100}%`;
  };

  const getColor = (val) => {
    if (val < 18.5) return "bg-yellow-400";
    if (val < 25) return "bg-green-500";
    if (val < 30) return "bg-orange-500";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <section className="text-center py-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Fitness Calculator
        </h1>
        <p className="mt-2 opacity-90">
          Enter your details to calculate BMI, BMR, TDEE, Body Fat % and more
        </p>
      </section>

      {/* Input row */}
      <div className="max-w-6xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 px-4">
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        >
          <option value="M">♂ Male</option>
          <option value="F">♀ Female</option>
        </select>
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        />
        <div className="flex">
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="flex-1 p-3 rounded-l-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
          />
          <select
            value={heightUnit}
            onChange={(e) => setHeightUnit(e.target.value)}
            className="p-3 rounded-r-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
          >
            <option value="cm">cm</option>
            <option value="ft">ft</option>
          </select>
        </div>
        <div className="flex">
          <input
            type="number"
            placeholder="Weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="flex-1 p-3 rounded-l-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            className="p-3 rounded-r-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        >
          <option value="1.2">Sedentary</option>
          <option value="1.375">Lightly active</option>
          <option value="1.55">Moderate</option>
          <option value="1.725">Active</option>
          <option value="1.9">Very active</option>
        </select>
        <input
          type="number"
          placeholder="Waist (cm)"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        />
        <input
          type="number"
          placeholder="Neck (cm)"
          value={neck}
          onChange={(e) => setNeck(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        />
        {gender === "F" && (
          <input
            type="number"
            placeholder="Hips (cm)"
            value={hips}
            onChange={(e) => setHips(e.target.value)}
            className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
          />
        )}
        <select
          value={bfMethod}
          onChange={(e) => setBfMethod(e.target.value)}
          className="p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow"
        >
          <option value="usNavy">US Navy Method</option>
          <option value="ymca">YMCA Method</option>
        </select>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={calculate}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg hover:scale-105 transition font-semibold"
        >
          Calculate
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-col items-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            <Dumbbell className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <p className="mt-2 font-medium">Crunching numbers...</p>
        </div>
      )}

      {/* Warning */}
      {warning && (
        <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl flex gap-3 items-start">
          <AlertCircle className="w-6 h-6 mt-1" />
          <p>{warning}</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(results).map(([key, val], i) =>
            val ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-2xl p-6 hover:scale-105 transition"
              >
                <h3 className="text-xl font-bold mb-2">
                  {cardsInfo[key]?.title || key.toUpperCase()}
                </h3>
                <p className="text-3xl font-extrabold mb-2">{val}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {cardsInfo[key]?.desc}
                </p>

                {key === "bmi" && (
                  <>
                    <p className="font-medium">{results.bmiCat}</p>
                    <div className="mt-3 w-full h-4 bg-gradient-to-r from-yellow-400 via-green-500 to-red-600 rounded-full relative">
                      <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: getScaleWidth(val) }}
                        transition={{ duration: 0.8 }}
                        className={`absolute top-0 h-4 w-2 rounded-full ${getColor(
                          val
                        )}`}
                      />
                    </div>
                  </>
                )}
              </motion.div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default Bmi;
