import StoreSettingsForm from "./store-settings-form";

const StoreSettingsView = () => {
  return (
    <section className="space-y-10">
      <header className="space-y-1">
        <h1 className="text-xl font-medium">Store Details Settings</h1>
        <p className="text-sm font-medium text-slate-400">
          Click on the switch to enable editing mode
        </p>
      </header>
      <StoreSettingsForm />
    </section>
  );
};
export default StoreSettingsView;
