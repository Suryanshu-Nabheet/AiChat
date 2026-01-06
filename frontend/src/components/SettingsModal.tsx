import { useState } from "react";
import {
  X,
  Key,
  AlertCircle,
  CheckCircle2,
  Shield,
  Zap,
  Sparkles,
} from "lucide-react";
import type { AppSettings, AIProvider } from "../types/settings";
import { PROVIDERS } from "../types/settings";
import { storage } from "../utils/storage";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (settings: AppSettings) => void;
  currentSettings: AppSettings | null;
}

export function SettingsModal({
  open,
  onClose,
  onSave,
  currentSettings,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(
    currentSettings || {
      provider: "openrouter",
      apiKey: "",
      modelId: "",
    }
  );
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [searchModel, setSearchModel] = useState("");

  const currentProvider = PROVIDERS[settings.provider];
  const availableModels = currentProvider?.models || [];

  const filteredModels = searchModel
    ? availableModels.filter(
        (model) =>
          model.name.toLowerCase().includes(searchModel.toLowerCase()) ||
          model.description?.toLowerCase().includes(searchModel.toLowerCase())
      )
    : availableModels;

  const handleSave = () => {
    if (!settings.apiKey.trim()) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
      return;
    }

    if (!settings.modelId) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
      return;
    }

    setSaveStatus("saving");
    storage.saveSettings(settings);
    onSave(settings);
    setSaveStatus("success");
    setTimeout(() => {
      setSaveStatus("idle");
      onClose();
    }, 1000);
  };

  const handleProviderChange = (provider: AIProvider) => {
    const newProvider = PROVIDERS[provider];
    setSettings({
      ...settings,
      provider,
      modelId: newProvider.models[0]?.id || "",
    });
    setSearchModel("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Settings
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Configure your AI experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/50">
          {/* Provider Selection */}
          <section>
            <label className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Zap size={18} />
              </span>
              AI Provider
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(PROVIDERS) as AIProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group ${
                    settings.provider === provider
                      ? "border-blue-500 bg-white ring-4 ring-blue-500/10 shadow-sm"
                      : "border-transparent bg-white hover:bg-gray-50 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1 relative z-10">
                    {PROVIDERS[provider].name}
                  </div>
                  <div className="text-xs text-gray-500 relative z-10">
                    {PROVIDERS[provider].models.length} models
                  </div>
                  {settings.provider === provider && (
                    <div className="absolute top-0 right-0 p-2 text-blue-500">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* API Key */}
          <section>
            <label className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Key size={18} />
              </span>
              API Key
            </label>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/50">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={settings.apiKey}
                  onChange={(e) =>
                    setSettings({ ...settings, apiKey: e.target.value })
                  }
                  placeholder={`Enter your ${
                    PROVIDERS[settings.provider].name
                  } API key`}
                  autoComplete="off"
                  className="w-full px-5 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-mono text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Key size={20} />
                </button>
              </form>
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                <Shield size={14} className="text-green-500" />
                <span>
                  Keys are stored locally and encrypted. Never shared.
                </span>
              </div>
            </div>
          </section>

          {/* Model Selection */}
          <section>
            <label className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                <Sparkles size={18} />
              </span>
              Model Selection
            </label>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  value={searchModel}
                  onChange={(e) => setSearchModel(e.target.value)}
                  placeholder="Search available models..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-colors"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {filteredModels.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <p>No models found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {filteredModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() =>
                          setSettings({ ...settings, modelId: model.id })
                        }
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-all flex items-center gap-4 group ${
                          settings.modelId === model.id ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            settings.modelId === model.id
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 group-hover:border-blue-400"
                          }`}
                        >
                          {settings.modelId === model.id && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium text-sm ${
                                settings.modelId === model.id
                                  ? "text-blue-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {model.name}
                            </span>
                            {model.pricing === "free" && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase tracking-wide">
                                Free
                              </span>
                            )}
                          </div>
                          {model.description && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {model.description}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex items-center gap-4">
          <div className="flex-1">
            {saveStatus === "error" && (
              <span className="text-red-600 text-sm font-medium flex items-center gap-2 animate-fade-in">
                <AlertCircle size={16} /> Fill all fields
              </span>
            )}
            {saveStatus === "success" && (
              <span className="text-green-600 text-sm font-medium flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={16} /> Saved!
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
