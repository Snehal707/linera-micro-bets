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

// ============ QUERY HOOKS ============

// Hook to fetch all bets
export function useAllBets() {
  const config = getConfig();
  return useQuery<MicroBet[], Error>({
    queryKey: ['bets'],
    queryFn: getAllBets,
    refetchInterval: 5000, // Refetch every 5 seconds
    retry: 3,
    enabled: config.isConfigured, // Only fetch if app is configured
  });
}

// Hook to fetch a specific bet
export function useBet(betId: string) {
  const config = getConfig();
  return useQuery<MicroBet | null, Error>({
    queryKey: ['bet', betId],
    queryFn: () => getBetById(betId),
    enabled: !!betId && config.isConfigured,
    refetchInterval: 3000,
  });
}

// Hook to fetch user bets
export function useUserBets() {
  const config = getConfig();
  return useQuery<UserBet[], Error>({
    queryKey: ['userBets'],
    queryFn: getUserBets,
    refetchInterval: 5000,
    enabled: config.isConfigured,
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
