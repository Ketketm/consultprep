'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface SkillData {
  pillar: string;
  proficiency: number;
  fullMark: number;
}

interface SkillRadarProps {
  data: SkillData[];
  className?: string;
}

export function SkillRadar({ data, className }: SkillRadarProps) {
  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="pillar"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Proficiency"
            dataKey="proficiency"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white px-3 py-2 rounded-lg shadow-lg border text-sm">
                    <p className="font-medium text-gray-900">{data.pillar}</p>
                    <p className="text-primary-600">{data.proficiency}% proficiency</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Simple progress bars alternative for smaller screens
interface SkillBarsProps {
  data: Array<{
    pillar: string;
    proficiency: number;
    color: string;
  }>;
  className?: string;
}

export function SkillBars({ data, className }: SkillBarsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {data.map((skill) => (
        <div key={skill.pillar} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">{skill.pillar}</span>
            <span className="text-gray-500">{skill.proficiency}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${skill.proficiency}%`,
                backgroundColor: skill.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
