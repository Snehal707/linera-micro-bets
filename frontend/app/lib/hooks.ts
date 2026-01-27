'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllBets,
  getBetById,
  getUserBets,
  createBet,
  placeBet,
  closeBet,
  resolveBet,
  checkServiceHealth,
  getConfig,
  MicroBet,
  UserBet,
} from './linera-client';

// Helper to check if we can connect to Linera (not on remote deployment)
function canConnectToLinera(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  // Only allow Linera connections on localhost
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

// ============ QUERY HOOKS ============

// Hook to fetch all bets
export function useAllBets() {
  const config = getConfig();
  const canConnect = canConnectToLinera();
  return useQuery<MicroBet[], Error>({
    queryKey: ['bets'],
    queryFn: getAllBets,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 1,
    enabled: config.isConfigured && canConnect, // Only fetch if on localhost
  });
}

// Hook to fetch a specific bet
export function useBet(betId: string) {
  const config = getConfig();
  const canConnect = canConnectToLinera();
  return useQuery<MicroBet | null, Error>({
    queryKey: ['bet', betId],
    queryFn: () => getBetById(betId),
    enabled: !!betId && config.isConfigured && canConnect,
    refetchInterval: 3000,
    retry: 1,
  });
}

// Hook to fetch user bets - always disabled since we use localStorage
export function useUserBets() {
  return useQuery<UserBet[], Error>({
    queryKey: ['userBets'],
    queryFn: getUserBets,
    enabled: false, // We don't use this - localStorage is primary source
  });
}

// Hook to check service health
export function useServiceHealth() {
  return useQuery<boolean, Error>({
    queryKey: ['serviceHealth'],
    queryFn: checkServiceHealth,
    refetchInterval: 30000, // Check every 30 seconds
    retry: 0, // Don't retry - fail fast
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}

// ============ MUTATION HOOKS ============

// Hook to create a new bet
export function useCreateBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ question, durationSeconds }: { question: string; durationSeconds: number }) =>
      createBet(question, durationSeconds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
    },
  });
}

// Hook to place a bet
export function usePlaceBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ betId, side, amount }: { betId: string; side: boolean; amount: string }) =>
      placeBet(betId, side, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betId] });
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
    },
  });
}

// Hook to close a bet
export function useCloseBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (betId: string) => closeBet(betId),
    onSuccess: (_, betId) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['bet', betId] });
    },
  });
}

// Hook to resolve a bet
export function useResolveBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ betId, outcome }: { betId: string; outcome: boolean }) =>
      resolveBet(betId, outcome),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] });
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betId] });
    },
  });
}
