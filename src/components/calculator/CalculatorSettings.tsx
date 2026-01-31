'use client';

import { useState } from 'react';
import { Save, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCalculatorStore, OperationType } from '@/lib/store/calculator-store';
import { cn } from '@/lib/utils';

const DURATION_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
];

const OPERATION_OPTIONS: { value: OperationType; label: string; symbol: string }[] = [
  { value: 'addition', label: 'Addition', symbol: '+' },
  { value: 'subtraction', label: 'Subtraction', symbol: '-' },
  { value: 'multiplication', label: 'Multiplication', symbol: '×' },
  { value: 'division', label: 'Division', symbol: '÷' },
];

export function CalculatorSettings() {
  const { settings, updateSettings, resetStats, sessions } = useCalculatorStore();

  const [localSettings, setLocalSettings] = useState(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleOperationToggle = (operation: OperationType) => {
    const current = localSettings.operations;
    if (current.includes(operation)) {
      // Don't allow removing all operations
      if (current.length === 1) return;
      setLocalSettings({
        ...localSettings,
        operations: current.filter((op) => op !== operation),
      });
    } else {
      setLocalSettings({
        ...localSettings,
        operations: [...current, operation],
      });
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetStats();
    setShowResetConfirm(false);
  };

  // Check if current settings match classic mode
  const isClassicMode =
    localSettings.duration === 120 &&
    localSettings.operations.length === 4 &&
    localSettings.operations.includes('addition') &&
    localSettings.operations.includes('subtraction') &&
    localSettings.operations.includes('multiplication') &&
    localSettings.operations.includes('division');

  return (
    <div className="space-y-6">
      {/* Classic Mode Notice */}
      <Card className={cn(
        "border-2",
        isClassicMode ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
      )}>
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className={cn(
              "w-5 h-5 mt-0.5",
              isClassicMode ? "text-green-600" : "text-yellow-600"
            )} />
            <div>
              <p className={cn(
                "font-medium",
                isClassicMode ? "text-green-800" : "text-yellow-800"
              )}>
                {isClassicMode ? "Classic Mode" : "Custom Mode"}
              </p>
              <p className={cn(
                "text-sm mt-1",
                isClassicMode ? "text-green-700" : "text-yellow-700"
              )}>
                {isClassicMode
                  ? "Your stats are being recorded. Classic mode: 2 min, all 4 operations."
                  : "Custom settings active. Only Classic Mode sessions (2 min, all 4 operations) are recorded in your stats."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Duration */}
      <Card>
        <CardHeader>
          <CardTitle>Game Duration</CardTitle>
          <CardDescription>How long each game session lasts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setLocalSettings({ ...localSettings, duration: option.value })}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  localSettings.duration === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Operations</CardTitle>
          <CardDescription>Select which operations to include</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {OPERATION_OPTIONS.map((option) => {
              const isSelected = localSettings.operations.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOperationToggle(option.value)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold',
                      isSelected ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    )}>
                      {option.symbol}
                    </span>
                    <span className={cn(
                      'font-medium',
                      isSelected ? 'text-primary-700' : 'text-gray-700'
                    )}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Number Ranges */}
      <Card>
        <CardHeader>
          <CardTitle>Number Ranges</CardTitle>
          <CardDescription>Adjust the difficulty for each operation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {localSettings.operations.includes('addition') && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Addition</span>
              <span className="text-sm text-gray-500">
                ({localSettings.additionRange[0]}-{localSettings.additionRange[1]}) + ({localSettings.additionRange[0]}-{localSettings.additionRange[1]})
              </span>
            </div>
          )}
          {localSettings.operations.includes('subtraction') && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Subtraction</span>
              <span className="text-sm text-gray-500">
                Addition in reverse
              </span>
            </div>
          )}
          {localSettings.operations.includes('multiplication') && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Multiplication</span>
              <span className="text-sm text-gray-500">
                ({localSettings.multiplicationRange[0]}-{localSettings.multiplicationRange[1]}) × (2-100)
              </span>
            </div>
          )}
          {localSettings.operations.includes('division') && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Division</span>
              <span className="text-sm text-gray-500">
                Multiplication in reverse
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <Button onClick={handleSave} className="w-full gap-2" size="lg">
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Settings'}
      </Button>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>These actions cannot be undone</CardDescription>
        </CardHeader>
        <CardContent>
          {!showResetConfirm ? (
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowResetConfirm(true)}
              disabled={sessions.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Stats ({sessions.length} sessions)
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600">
                Are you sure? This will delete all your game history and reset your personal best.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  onClick={handleReset}
                >
                  Yes, Reset All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
