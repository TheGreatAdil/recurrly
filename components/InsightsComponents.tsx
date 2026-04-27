import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { icons } from '@/constants/icons';
import { theme } from '@/constants/theme';

export const InsightsHeader = () => {
  return (
    <View className="flex-row justify-between items-center mb-8">
      <Pressable className="w-11 h-11 rounded-[22px] border border-border justify-center items-center">
        <Image source={icons.back} className="w-5 h-5 resize-contain" style={{ tintColor: theme.colors.primary }} />
      </Pressable>
      <Text className="text-lg font-bold text-primary">Monthly Insights</Text>
      <Pressable className="w-11 h-11 rounded-[22px] border border-border justify-center items-center">
        <Image source={icons.menu} className="w-5 h-5 resize-contain" style={{ tintColor: theme.colors.primary }} />
      </Pressable>
    </View>
  );
};

export const WeeklyChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxVal = Math.max(...data.map(d => d.value), 45);
  const yAxisLabels = [maxVal, maxVal * 0.8, maxVal * 0.6, maxVal * 0.4, maxVal * 0.2, 0].map(v => Math.round(v));

  return (
    <View className="bg-card rounded-3xl px-4 pt-10 pb-4 mb-4">
      <View className="h-[200px] relative">
        {/* Grid lines */}
        {yAxisLabels.map((val, idx) => {
          const bottomPos = (val / maxVal) * 160; // 160 is the height of bars area
          return (
            <View key={`grid-${idx}`} className="absolute left-0 right-0 flex-row items-center" style={{ bottom: bottomPos + 24 }}>
              <Text className="w-6 text-xs text-primary/60 mr-2">{val}</Text>
              <View className="flex-1 h-px border-t border-dashed border-border rounded-sm" />
            </View>
          );
        })}
        
        {/* Bars */}
        <View className="flex-row justify-between items-end absolute top-0 bottom-0 left-8 right-0">
          {data.map((item, index) => {
            const maxDataValue = Math.max(...data.map(d => d.value));
            const maxIndex = data.findIndex(d => d.value === maxDataValue);
            const isHighlighted = maxDataValue > 0 ? index === maxIndex : index === 3;
            const heightPct = (item.value / maxVal) * 100;
            return (
              <View key={item.label} className="items-center h-full justify-end w-8">
                <View className="items-center justify-end h-[160px] w-full mb-2">
                  {isHighlighted && (
                    <View className="mb-2 bg-white px-2 py-1 rounded-lg min-w-[44px] items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
                      <Text className="text-accent font-bold text-xs">${Math.round(item.value)}</Text>
                      <View className="absolute -bottom-1 left-1/2 -ml-1 w-2 h-2 bg-white" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                  )}
                  <View className={`w-2.5 rounded-full ${isHighlighted ? 'bg-accent' : 'bg-primary'}`} style={{ height: `${heightPct}%` }} />
                </View>
                <Text className="text-xs text-primary/80">{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export const ExpensesCard = ({ amount, date, percentage }: { amount: string, date: string, percentage: string }) => {
  return (
    <View className="flex-row justify-between items-center p-5 rounded-3xl border border-border mb-8 bg-transparent">
      <View>
        <Text className="text-lg font-bold text-primary">Expenses</Text>
        <Text className="text-sm text-primary/60 mt-1">{date}</Text>
      </View>
      <View className="items-end">
        <Text className="text-lg font-bold text-primary">{amount}</Text>
        <Text className="text-sm text-primary/60 mt-1">{percentage}</Text>
      </View>
    </View>
  );
};

export const HistoryCard = ({ name, date, price, color, icon }: any) => {
  return (
    <View className="flex-row justify-between items-center p-4 rounded-2xl mb-3" style={{ backgroundColor: color }}>
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-xl bg-white/40 justify-center items-center mr-4">
          <Image source={icon} className="w-6 h-6 resize-contain" style={{ tintColor: theme.colors.primary }} />
        </View>
        <View>
          <Text className="text-base font-bold text-primary">{name}</Text>
          <Text className="text-sm text-primary/60 mt-1">{date}</Text>
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-bold text-primary">{price}</Text>
        <Text className="text-xs text-primary/60 mt-1">per month</Text>
      </View>
    </View>
  );
};
