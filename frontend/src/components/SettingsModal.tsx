import { useState, useEffect } from 'react';
import { X, Key, AlertCircle, CheckCircle2, Shield, Zap, DollarSign, Gift } from 'lucide-react';
import type { AppSettings, AIProvider } from '../types/settings';
import { PROVIDERS } from '../types/settings';
import { storage } from '../utils/storage';

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
  const [settings, setSettings] = useState<AppSettings>({
    provider: 'openrouter',
    apiKey: '',
    modelId: '',
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [searchModel, setSearchModel] = useState('');

  useEffect(() => {
    if (open && currentSettings) {
      setSettings(currentSettings);
    } else {
      setSearchModel('');
    }
  }, [open, currentSettings]);

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
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    if (!settings.modelId) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    setSaveStatus('saving');
    storage.saveSettings(settings);
    onSave(settings);
    setSaveStatus('success');
    setTimeout(() => {
      setSaveStatus('idle');
      onClose();
    }, 1000);
  };

  const handleProviderChange = (provider: AIProvider) => {
    const newProvider = PROVIDERS[provider];
    setSettings({
      ...settings,
      provider,
      modelId: newProvider.models[0]?.id || '',
    });
    setSearchModel('');
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-blue-100 text-sm mt-1">Configure your AI provider and API key</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors text-white/90 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap size={18} className="text-blue-600" />
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PROVIDERS) as AIProvider[]).map((provider) => (
                <button
                  key={provider}
                  onClick={() => handleProviderChange(provider)}
                  className={`p-4 rounded-xl border-2 transition-colors text-left ${
                    settings.provider === provider
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-gray-900 mb-1">
                    {PROVIDERS[provider].name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {PROVIDERS[provider].models.length} models available
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Key size={18} className="text-blue-600" />
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings({ ...settings, apiKey: e.target.value })
                }
                placeholder={`Enter your ${PROVIDERS[settings.provider].name} API key`}
                className="w-full px-5 py-3 pr-14 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
              >
                <Key size={20} />
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800">
                Your API key is encrypted and stored locally. It's never sent to our servers.
              </p>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Model Selection
            </label>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                value={searchModel}
                onChange={(e) => setSearchModel(e.target.value)}
                placeholder="Search models..."
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
              />
            </div>

            {/* Model List */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No models found matching "{searchModel}"</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSettings({ ...settings, modelId: model.id })}
                      className={`w-full text-left p-4 transition-colors ${
                        settings.modelId === model.id
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {model.name}
                            </span>
                            {model.pricing === 'free' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                                <Gift size={12} />
                                Free
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                <DollarSign size={12} />
                                Paid
                              </span>
                            )}
                          </div>
                          {model.description && (
                            <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                          )}
                        </div>
                        {settings.modelId === model.id && (
                          <div className="flex-shrink-0">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Save Status */}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">Please fill in all required fields</span>
            </div>
          )}

          {saveStatus === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">Settings saved successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
