import InsulinCalculator from "@/components/InsulinCalculator";

export default function CalculatorPage() {
  return (
    <div className="px-4 pt-6 space-y-4">
      <h1 className="text-xl font-bold">Calculadora de Insulina</h1>
      <p className="text-sm text-gray-500">
        Calcula a dose de Fiasp com base nos hidratos e na tua glicemia.
      </p>
      <InsulinCalculator />
    </div>
  );
}
