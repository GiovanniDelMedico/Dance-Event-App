// src/onboarding/steps/StepCategories.tsx
export default function StepCategories() {
  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold text-zinc-900 mb-2">
        Scegli la categoria
      </h2>
      <p className="text-zinc-600 mb-4">
        Usa le categorie per trovare gli eventi più adatti a te.
      </p>

      <ul className="text-sm text-zinc-700 space-y-1 text-left inline-block">
        <li>• Battle – competizioni</li>
        <li>• Jam – improvvisazione</li>
        <li>• Workshop – formazione</li>
        <li>• Social – conoscere persone</li>
        <li>• Outdoor – attività all’aperto</li>
      </ul>
    </div>
  );
}
