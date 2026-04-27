import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { theme } from '@/constants/theme';
import { useSubscriptionStore } from '@/lib/useSubscriptionStore';
import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils';
import dayjs from 'dayjs';
import {
  InsightsHeader,
  WeeklyChart,
  ExpensesCard,
  HistoryCard,
} from '@/components/InsightsComponents';

const SafeAreaView = styled(RNSafeAreaView);

const Insights = () => {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);

  // Calculate actual chart data from subscriptions based on renewal date day of the week
  const chartData = [
    { label: 'Mon', value: 0 },
    { label: 'Tue', value: 0 },
    { label: 'Wed', value: 0 },
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ];

  let totalExpenses = 0;

  subscriptions.forEach((sub) => {
    if (sub.status === 'cancelled' || sub.status === 'paused') {
      return;
    }

    let normalizedPrice = sub.price;
    if (sub.billing === 'Yearly') {
      normalizedPrice = sub.price / 12;
    }

    totalExpenses += normalizedPrice;

    // Determine the relevant date to plot (renewalDate or startDate)
    const dateToUse = sub.renewalDate || sub.startDate;
    if (dateToUse) {
      const day = dayjs(dateToUse).day(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
      const index = day === 0 ? 6 : day - 1; // Map to 0-6 where 0 is Mon, 6 is Sun
      chartData[index].value += normalizedPrice;
    }
  });

  const computedMonth = dayjs().format('MMMM YYYY');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerClassName="px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <InsightsHeader />

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-primary">Upcoming</Text>
          <View className="px-4 py-1.5 rounded-[20px] border border-border bg-transparent">
            <Text className="text-sm text-primary font-medium">View all</Text>
          </View>
        </View>
        
        <WeeklyChart data={chartData} />
        
        <ExpensesCard 
          amount={`-${formatCurrency(totalExpenses, 'USD')}`}
          date={computedMonth}
        />

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-primary">History</Text>
          <View className="px-4 py-1.5 rounded-[20px] border border-border bg-transparent">
            <Text className="text-sm text-primary font-medium">View all</Text>
          </View>
        </View>

        {subscriptions.map((sub) => (
          <HistoryCard
            key={sub.id}
            name={sub.name}
            date={formatSubscriptionDateTime(sub.startDate)}
            price={formatCurrency(sub.price, sub.currency)}
            color={sub.color || theme.colors.card}
            icon={sub.icon}
          />
        ))}

        {/* Spacer for bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;
