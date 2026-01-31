'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { QuizQuestion as QuizType, ChartData, DrillOption } from '@/lib/types';

interface QuizProps {
  quiz: QuizType;
  onAnswer: (params: {
    selectedOptionId: string;
    wasCorrect: boolean;
    responseTimeMs: number;
  }) => void;
  onSkip: () => void;
}

function renderChart(chartData: ChartData) {
  if (!chartData) return null;

  switch (chartData.type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {chartData.headers?.map((header, i) => (
                  <th key={i} className="px-4 py-2 text-left font-medium text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.rows?.map((row, i) => (
                <tr key={i} className="border-b last:border-0">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-gray-600">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'bar_grouped':
      const groupedData = chartData.categories?.map((cat, i) => {
        const obj: Record<string, string | number> = { name: cat };
        chartData.series?.forEach((s) => {
          obj[s.name] = s.data[i];
        });
        return obj;
      });

      const colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {chartData.series?.map((s, i) => (
              <Bar key={s.name} dataKey={s.name} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

export function Quiz({ quiz, onAnswer, onSkip }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSubmit = () => {
    if (selectedOption && !showResult) {
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    const correctOption = quiz.options.find((o) => o.isCorrect);
    const wasCorrect = selectedOption === correctOption?.id;
    const responseTimeMs = Date.now() - startTime;

    onAnswer({
      selectedOptionId: selectedOption || '',
      wasCorrect,
      responseTimeMs,
    });
  };

  const correctOption = quiz.options.find((o) => o.isCorrect);
  const isCorrect = selectedOption === correctOption?.id;

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
            Industry Insights
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {quiz.questionType.replace('_', ' ')}
          </span>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Chart or Image */}
        {quiz.chartData && (
          <div className="p-4 bg-gray-50 rounded-xl border">{renderChart(quiz.chartData)}</div>
        )}
        {quiz.chartImageUrl && !quiz.chartData && (
          <img
            src={quiz.chartImageUrl}
            alt="Chart"
            className="w-full rounded-lg border"
          />
        )}

        {/* Question */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{quiz.questionText}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {quiz.options.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !showResult && setSelectedOption(option.id)}
              disabled={showResult}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                'hover:border-primary-300 hover:bg-primary-50',
                selectedOption === option.id && !showResult && 'border-primary-500 bg-primary-50',
                showResult && option.isCorrect && 'border-success-500 bg-success-50',
                showResult &&
                  selectedOption === option.id &&
                  !option.isCorrect &&
                  'border-danger-500 bg-danger-50',
                showResult && selectedOption !== option.id && !option.isCorrect && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium',
                    selectedOption === option.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option.text}</span>
                {showResult && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0" />
                )}
                {showResult && selectedOption === option.id && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-danger-500 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'p-4 rounded-xl',
                isCorrect ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success-600" />
                    <span className="font-semibold text-success-700">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-danger-600" />
                    <span className="font-semibold text-danger-700">Not quite</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{quiz.explanation}</p>
              {quiz.dataSource && (
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Source: {quiz.dataSource}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" onClick={onSkip} disabled={showResult}>
            Skip (-5 XP)
          </Button>
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={!selectedOption} size="lg">
              Confirm Answer
            </Button>
          ) : (
            <Button onClick={handleContinue} size="lg" variant={isCorrect ? 'success' : 'default'}>
              Continue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
