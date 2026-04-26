import { useSignInWithGoogle } from "@clerk/expo/google";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";

interface GoogleSignInButtonProps {
  label?: string;
}

export default function GoogleSignInButton({
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err: any) {
      // User cancelled – not an error
      if (
        err?.code === "SIGN_IN_CANCELLED" ||
        err?.code === "-5" ||
        err?.message?.includes("cancelled")
      ) {
        return;
      }
      Alert.alert(
        "Something went wrong",
        err?.message || "Could not sign in with Google. Please try again.",
      );
      console.error("Google sign-in error:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      className="flex-row items-center justify-center gap-3 rounded-2xl border border-border bg-background py-4"
      style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#081126" />
      ) : (
        <>
          <Image
            source={{
              uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
            }}
            className="size-5"
            resizeMode="contain"
          />
          <Text className="text-base font-sans-semibold text-primary">
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
