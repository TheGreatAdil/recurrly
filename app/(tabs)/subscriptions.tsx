import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import { useSubscriptionStore } from "@/lib/useSubscriptionStore";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Image, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptionStore();
  const [search, setSearch] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q),
    );
  }, [search, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="subs-screen-title">Subscriptions</Text>

      <View className="subs-search-bar">
        <Image
          source={icons.search}
          className="subs-search-icon"
          tintColor="rgba(0,0,0,0.4)"
        />
        <TextInput
          className="subs-search-input"
          placeholder="Search subscriptions…"
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      <Text className="subs-count">
        {filtered.length} {filtered.length === 1 ? "subscription" : "subscriptions"}
      </Text>

      <FlatList
        className="flex-1"
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="subs-empty">
            <Text className="subs-empty-text">
              {`No subscriptions match "${search}"`}
            </Text>
          </View>
        }
        contentContainerClassName="pb-20"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
