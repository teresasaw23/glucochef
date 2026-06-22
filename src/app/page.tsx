import GlucoseCard from "@/components/GlucoseCard";
import InsulinCalculator from "@/components/InsulinCalculator";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">GlucoChef</h1>
        <p className="text-sm text-gray-500 mt-1">
          O teu assistente de refeições
        </p>
      </div>

      <GlucoseCard />

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/eat-now"
          className="bg-blue-600 text-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-sm font-medium">O que comer agora?</span>
        </Link>

        <Link
          href="/planner"
          className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Plano Semanal</span>
        </Link>

        <Link
          href="/shopping"
          className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Lista de Compras</span>
        </Link>

        <Link
          href="/calculator"
          className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Calculadora</span>
        </Link>
      </div>

      <InsulinCalculator />
    </div>
  );
}
