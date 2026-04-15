import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useBootstrapAuth } from '../src/hooks/useBootstrapAuth';
import { prependCommentToCache, updateCommentsCount, updatePostCaches } from '../src/query/cache-updaters';
import { socketService } from '../src/realtime/socket';
import { theme } from '../src/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      retry: 1,
    },
  },
});

function RealtimeBridge() {
  const currentQueryClient = useQueryClient();

  useEffect(() => {
    return socketService.addListener((event) => {
      if (event.type === 'ping') {
        return;
      }

      if (event.type === 'like_updated') {
        updatePostCaches(currentQueryClient, event.postId, (post) => ({
          ...post,
          likesCount: event.likesCount,
        }));
        return;
      }

      prependCommentToCache(currentQueryClient, event.postId, event.comment);
      updateCommentsCount(currentQueryClient, event.postId, 1);
    });
  }, [currentQueryClient]);

  return null;
}

function BootstrapState() {
  const { isReady, error } = useBootstrapAuth();

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>Не удалось подготовить приложение</Text>
        <Text style={styles.stateText}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={theme.semantic.primary} size="large" />
        <Text style={styles.stateText}>Инициализируем безопасную мобильную сессию...</Text>
      </View>
    );
  }

  return (
    <>
      <RealtimeBridge />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.semantic.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="feed/index" />
        <Stack.Screen name="post/[id]" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BootstrapState />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.semantic.background,
  },
  stateTitle: {
    color: theme.semantic.text,
    fontWeight: '800',
    fontSize: theme.typography.title,
    marginTop: theme.spacing.md,
  },
  stateText: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.body,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
