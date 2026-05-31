import { SetupInstitutionsForm } from "./setup-institutions-form";

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Setup</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Type product names (e.g. NAB iSaver, Low Rate Card) or pick institutions. Import
          gap checks use what you add here.
        </p>
      </div>
      <SetupInstitutionsForm />
    </div>
  );
}
