import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth, useSignIn } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const { signIn, errors: clerkErrors, fetchStatus } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [localError, setLocalError] = React.useState("");

  const loading = fetchStatus === "fetching";

  // ─── Handle email/password submission ──────────────────────
  const handleSignIn = async () => {
    if (!emailAddress.trim() || !password.trim()) return;
    setLocalError("");

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setLocalError(error.longMessage || error.message);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            router.replace(url as Href);
          },
        });
      } else if (signIn.status === "needs_second_factor") {
        // MFA — handled by the verification UI below
      } else if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor: any) => factor.strategy === "email_code",
        );
        if (emailCodeFactor) {
          await signIn.mfa.sendEmailCode();
        }
      } else {
        setLocalError("Something went wrong. Please try again.");
        console.error("Unhandled sign-in status:", signIn.status);
      }
    } catch (err: any) {
      setLocalError(err?.message || "Something went wrong. Please try again.");
    }
  };

  // ─── Handle MFA verification ──────────────────────────────
  const handleVerify = async () => {
    if (!code.trim()) return;
    setLocalError("");

    try {
      await signIn.mfa.verifyEmailCode({ code: code.trim() });

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              console.log("Session task:", session.currentTask);
              return;
            }
            const url = decorateUrl("/");
            router.replace(url as Href);
          },
        });
      } else {
        setLocalError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setLocalError(err?.message || "Verification failed. Please try again.");
    }
  };

  // Already signed in — render nothing (layout guard handles redirect)
  if (isSignedIn) return null;

  // ─── MFA Verification View ────────────────────────────────
  if (
    signIn.status === "needs_client_trust" ||
    signIn.status === "needs_second_factor"
  ) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerClassName="auth-content"
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand */}
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurrly</Text>
                </View>
              </View>
              <Text className="auth-title">Verify your identity</Text>
              <Text className="auth-subtitle">
                We sent a verification code to your email. Enter it below to
                continue.
              </Text>
            </View>

            {/* Verification Card */}
            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    className={`auth-input ${clerkErrors?.fields?.code ? "auth-input-error" : ""}`}
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    keyboardType="number-pad"
                    autoFocus
                    maxLength={6}
                  />
                  {clerkErrors?.fields?.code && (
                    <Text className="auth-error">
                      {clerkErrors.fields.code.message}
                    </Text>
                  )}
                </View>

                {localError ? (
                  <Text className="auth-error">{localError}</Text>
                ) : null}

                <Pressable
                  onPress={handleVerify}
                  disabled={loading || !code.trim()}
                  className={`auth-button ${loading || !code.trim() ? "auth-button-disabled" : ""}`}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Verify</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => signIn.mfa.sendEmailCode()}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">
                    Resend code
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    signIn.reset();
                    setCode("");
                    setLocalError("");
                  }}
                  className="items-center py-2"
                >
                  <Text className="text-sm font-sans-medium text-muted-foreground">
                    ← Start over
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── Main Sign-In View ─────────────────────────────────────
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0;

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Block */}
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurrly</Text>
              </View>
            </View>
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to manage your subscriptions and stay on top of your
              spending.
            </Text>
          </View>

          {/* Form Card */}
          <View className="auth-card">
            <View className="auth-form">
              {/* Google Sign In */}
              <GoogleSignInButton label="Continue with Google" />

              {/* Divider */}
              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">or</Text>
                <View className="auth-divider-line" />
              </View>

              {/* Email Field */}
              <View className="auth-field">
                <Text className="auth-label">Email address</Text>
                <TextInput
                  className={`auth-input ${clerkErrors?.fields?.identifier ? "auth-input-error" : ""}`}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                {clerkErrors?.fields?.identifier && (
                  <Text className="auth-error">
                    {clerkErrors.fields.identifier.message}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <View className="relative">
                  <TextInput
                    className={`auth-input pr-14 ${clerkErrors?.fields?.password ? "auth-input-error" : ""}`}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-4"
                    hitSlop={8}
                  >
                    <Text className="text-sm font-sans-semibold text-accent">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
                {clerkErrors?.fields?.password && (
                  <Text className="auth-error">
                    {clerkErrors.fields.password.message}
                  </Text>
                )}
              </View>

              {localError ? (
                <Text className="auth-error">{localError}</Text>
              ) : null}

              {/* Sign In Button */}
              <Pressable
                onPress={handleSignIn}
                disabled={loading || !canSubmit}
                className={`auth-button ${loading || !canSubmit ? "auth-button-disabled" : ""}`}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#081126" />
                ) : (
                  <Text className="auth-button-text">Sign in</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Footer Link */}
          <View className="auth-link-row">
            <Text className="auth-link-copy">Don't have an account?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable hitSlop={8}>
                <Text className="auth-link">Create one</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
