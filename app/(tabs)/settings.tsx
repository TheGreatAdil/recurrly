import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const displayName =
    user?.firstName ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "User";

  const email = user?.emailAddresses?.[0]?.emailAddress || "";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <Text className="text-2xl font-sans-bold text-primary mb-6">
        Settings
      </Text>

      {/* Profile Card */}
      <View className="rounded-2xl border border-border bg-card p-5 mb-6">
        <View className="flex-row items-center gap-4">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="size-14 rounded-full"
            />
          ) : (
            <View className="size-14 items-center justify-center rounded-full bg-accent">
              <Text className="text-xl font-sans-extrabold text-background">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-sans-bold text-primary">
              {displayName}
            </Text>
            {email ? (
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {email}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Account section */}
      <Text className="text-sm font-sans-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Account
      </Text>

      <View className="rounded-2xl border border-border bg-card overflow-hidden mb-6">
        <View className="flex-row items-center justify-between p-4 border-b border-border">
          <Text className="text-base font-sans-medium text-primary">
            Email
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {email}
          </Text>
        </View>

        <View className="flex-row items-center justify-between p-4">
          <Text className="text-base font-sans-medium text-primary">
            Member since
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </Text>
        </View>
      </View>

      {/* Sign Out */}
      <Pressable
        onPress={handleSignOut}
        className="items-center rounded-2xl bg-primary py-4"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-base font-sans-bold text-background">
          Sign out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
