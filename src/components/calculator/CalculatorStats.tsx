'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Trophy, TrendingUp, Target, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalculatorStore } from '@/lib/store/calculator-store';

export function CalculatorStats() {
  const { sessions, personalBest, getAverageScore } = useCalculatorStore();

  const chartData = useMemo(() => {
    return sessions.slice(-20).map((session, index) => ({
      name: format(parseISO(session.date), 'MMM d'),
      score: session.score,
      accuracy: session.accuracy,
      index: index + 1,
    }));
  }, [sessions]);

  const averageScore = getAverageScore();
  const totalSessions = sessions.length;
  const averageAccuracy = useMemo(() => {
    if (sessions.length === 0) return 0;
    return Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length);
  }, [sessions]);

  const recentTrend = useMemo(() => {
    if (sessions.length < 5) return null;
    const recent5 = sessions.slice(-5);
    const previous5 = sessions.slice(-10, -5);
    if (previous5.length === 0) return null;

    const recentAvg = recent5.reduce((sum, s) => sum + s.score, 0) / recent5.length;
    const previousAvg = previous5.reduce((sum, s) => sum + s.score, 0) / previous5.length;
    const diff = recentAvg - previousAvg;
    return {
      direction: diff >= 0 ? 'up' : 'down',
      percentage: Math.abs(Math.round((diff / previousAvg) * 100)),
    };
  }, [sessions]);

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No stats yet</h3>
          <p className="text-gray-500">
            Complete your first game to start tracking your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{personalBest}</p>
                <p className="text-xs text-gray-500">Personal Best</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageAccuracy}%</p>
                <p className="text-xs text-gray-500">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
                <p className="text-xs text-gray-500">Games Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              Performance Over Time
            </CardTitle>
            {recentTrend && (
              <span className={`text-sm font-medium ${recentTrend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {recentTrend.direction === 'up' ? '↑' : '↓'} {recentTrend.percentage}% last 5 games
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'score' ? 'Score' : 'Accuracy %'
                  ]}
                />
                <ReferenceLine
                  y={personalBest}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  label={{ value: 'Best', position: 'right', fill: '#f59e0b', fontSize: 12 }}
                />
                <ReferenceLine
                  y={averageScore}
                  stroke="#3b82f6"
                  strokeDasharray="3 3"
                  label={{ value: 'Avg', position: 'right', fill: '#3b82f6', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8b5cf6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sessions.slice(-5).reverse().map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    Score: {session.score}
                    {session.score === personalBest && (
                      <span className="ml-2 text-xs text-yellow-600">Best!</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(session.date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{session.accuracy}% accuracy</p>
                  <p className="text-xs text-gray-400">{session.questionsAttempted} attempted</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
