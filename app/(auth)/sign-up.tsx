import GoogleSignInButton from "@/components/GoogleSignInButton";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
  const { signUp, errors: clerkErrors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [localError, setLocalError] = React.useState("");

  const loading = fetchStatus === "fetching";

  // ─── Step 1: Create sign-up ──────────────────────────────────
  const handleSignUp = async () => {
    if (!emailAddress.trim() || !password.trim()) return;
    setLocalError("");

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
        firstName: firstName.trim() || undefined,
      });

      if (error) {
        setLocalError(error.longMessage || error.message);
        return;
      }

      // After creating, send email verification code
      if (!error) await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      setLocalError(err?.message || "Something went wrong. Please try again.");
    }
  };

  // ─── Step 2: Verify email ────────────────────────────────────
  const handleVerify = async () => {
    if (!code.trim()) return;
    setLocalError("");

    try {
      await signUp.verifications.verifyEmailCode({ code: code.trim() });

      if (signUp.status === "complete") {
        await signUp.finalize({
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
        setLocalError(
          "Verification succeeded but account setup is incomplete.",
        );
        console.error("Sign-up not complete:", signUp.status);
      }
    } catch (err: any) {
      setLocalError(err?.message || "Verification failed. Please try again.");
    }
  };

  // Already signed in or complete -> render nothing
  if (signUp.status === "complete" || isSignedIn) return null;

  // ─── Verification View ─────────────────────────────────────────
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    (signUp.missingFields?.length ?? 0) === 0
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
              <Text className="auth-title">Check your email</Text>
              <Text className="auth-subtitle">
                We sent a 6-digit code to {emailAddress}. Enter it below to
                verify your account.
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

                {/* Verify Button */}
                <Pressable
                  onPress={handleVerify}
                  disabled={loading || !code.trim()}
                  className={`auth-button ${loading || !code.trim() ? "auth-button-disabled" : ""}`}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <Text className="auth-button-text">
                      Verify & create account
                    </Text>
                  )}
                </Pressable>

                {/* Resend Code */}
                <Pressable
                  onPress={() => signUp.verifications.sendEmailCode()}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">
                    Resend code
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ─── Main Sign-Up View ──────────────────────────────────────────
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
            <Text className="auth-title">Create your account</Text>
            <Text className="auth-subtitle">
              Start tracking your subscriptions and take control of recurring
              expenses.
            </Text>
          </View>

          {/* Form Card */}
          <View className="auth-card">
            <View className="auth-form">
              {/* Google Sign Up */}
              <GoogleSignInButton label="Sign up with Google" />

              {/* Divider */}
              <View className="auth-divider-row">
                <View className="auth-divider-line" />
                <Text className="auth-divider-text">or</Text>
                <View className="auth-divider-line" />
              </View>

              {/* First Name Field */}
              <View className="auth-field">
                <Text className="auth-label">First name</Text>
                <TextInput
                  className="auth-input"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Your first name"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  textContentType="givenName"
                />
              </View>

              {/* Email Field */}
              <View className="auth-field">
                <Text className="auth-label">Email address</Text>
                <TextInput
                  className={`auth-input ${clerkErrors?.fields?.emailAddress ? "auth-input-error" : ""}`}
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                {clerkErrors?.fields?.emailAddress && (
                  <Text className="auth-error">
                    {clerkErrors.fields.emailAddress.message}
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
                    placeholder="Create a password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    textContentType="newPassword"
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
                <Text className="auth-helper">
                  Must be at least 8 characters
                </Text>
              </View>

              {localError ? (
                <Text className="auth-error">{localError}</Text>
              ) : null}

              {/* Sign Up Button */}
              <Pressable
                onPress={handleSignUp}
                disabled={loading || !canSubmit}
                className={`auth-button ${loading || !canSubmit ? "auth-button-disabled" : ""}`}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#081126" />
                ) : (
                  <Text className="auth-button-text">Create account</Text>
                )}
              </Pressable>
            </View>
          </View>

          {/* Footer Link */}
          <View className="auth-link-row">
            <Text className="auth-link-copy">Already have an account?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable hitSlop={8}>
                <Text className="auth-link">Sign in</Text>
              </Pressable>
            </Link>
          </View>

          {/* Required for Clerk bot protection */}
          <View nativeID="clerk-captcha" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
