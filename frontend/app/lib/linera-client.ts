// Linera GraphQL Client for StormCast
// Connects to Linera service running locally

const LINERA_SERVICE_URL = process.env.NEXT_PUBLIC_LINERA_SERVICE_URL || 'http://localhost:8080';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '1b53596ca4b3f838ee0228ed1409643b94109fba950d3846f29d2369fa9f253e';
const APP_ID = process.env.NEXT_PUBLIC_MICRO_BET_APP_ID || '';

export interface MicroBet {
  id: string;
  question: string;
  yesPool: string;
  noPool: string;
  status: 'Open' | 'Closed' | 'Resolved';
  creator: string;
  resolution: boolean | null;
  createdAt: string;
  expiresAt: string;
}

export interface UserBet {
  betId: string;
  owner: string;
  side: boolean;
  amount: string;
  timestamp: string;
}

// Get the GraphQL endpoint for the application
function getAppEndpoint(): string {
  return `${LINERA_SERVICE_URL}/chains/${CHAIN_ID}/applications/${APP_ID}`;
}

// Execute a GraphQL query
async function graphqlQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = getAppEndpoint();
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL error');
  }

  return result.data;
}

// Execute a GraphQL mutation
async function graphqlMutation<T>(mutation: string, variables?: Record<string, unknown>): Promise<T> {
  return graphqlQuery<T>(mutation, variables);
}

// ============ QUERIES ============

// Get all bets/markets
export async function getAllBets(): Promise<MicroBet[]> {
  const query = `
    query {
      bets {
        entries {
          value {
            id
            question
            yesPool
            noPool
            status
            creator
            resolution
            createdAt
            expiresAt
          }
        }
      }
    }
  `;

  interface QueryResult {
    bets: {
      entries: Array<{
        value: MicroBet;
      }>;
    };
  }

  const data = await graphqlQuery<QueryResult>(query);
  return data.bets.entries.map(entry => entry.value);
}

// Get a specific bet by ID
export async function getBetById(betId: string): Promise<MicroBet | null> {
  const query = `
    query GetBet($betId: String!) {
      bets {
        entry(key: $betId) {
          value {
            id
            question
            yesPool
            noPool
            status
            creator
            resolution
            createdAt
            expiresAt
          }
        }
      }
    }
  `;

  interface QueryResult {
    bets: {
      entry: {
        value: MicroBet | null;
      } | null;
    };
  }

  const data = await graphqlQuery<QueryResult>(query, { betId });
  return data.bets.entry?.value || null;
}

// Get user bets
export async function getUserBets(): Promise<UserBet[]> {
  const query = `
    query {
      userBets {
        entries {
          value {
            betId
            owner
            side
            amount
            timestamp
          }
        }
      }
    }
  `;

  interface QueryResult {
    userBets: {
      entries: Array<{
        value: UserBet;
      }>;
    };
  }

  const data = await graphqlQuery<QueryResult>(query);
  return data.userBets.entries.map(entry => entry.value);
}

// ============ MUTATIONS ============

// Create a new bet/market
export async function createBet(question: string, durationSeconds: number): Promise<void> {
  const mutation = `
    mutation CreateBet($question: String!, $durationSeconds: Int!) {
      createBet(question: $question, durationSeconds: $durationSeconds)
    }
  `;

  await graphqlMutation(mutation, { question, durationSeconds });
}

// Place a bet on a market
export async function placeBet(betId: string, side: boolean, amount: string): Promise<void> {
  const mutation = `
    mutation PlaceBet($betId: String!, $side: Boolean!, $amount: String!) {
      placeBet(betId: $betId, side: $side, amount: $amount)
    }
  `;

  await graphqlMutation(mutation, { betId, side, amount });
}

// Close a bet (stop accepting new bets)
export async function closeBet(betId: string): Promise<void> {
  const mutation = `
    mutation CloseBet($betId: String!) {
      closeBet(betId: $betId)
    }
  `;

  await graphqlMutation(mutation, { betId });
}

// Resolve a bet with outcome
export async function resolveBet(betId: string, outcome: boolean): Promise<void> {
  const mutation = `
    mutation ResolveBet($betId: String!, $outcome: Boolean!) {
      resolveBet(betId: $betId, outcome: $outcome)
    }
  `;

  await graphqlMutation(mutation, { betId, outcome });
}

// ============ HELPERS ============

// Check if the Linera service is available (with timeout)
export async function checkServiceHealth(): Promise<boolean> {
  // Don't even try if we're clearly on a remote deployment (not localhost)
  if (typeof window !== 'undefined' && 
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1') &&
      LINERA_SERVICE_URL.includes('localhost')) {
    return false;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch(`${LINERA_SERVICE_URL}/`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Format Amount from Linera (attos) to human readable
export function formatAmount(attos: string | number | undefined | null): number {
  if (!attos) return 0;
  
  // Handle different input types
  const strValue = String(attos).trim();
  
  // Remove any trailing dots or non-numeric characters except digits
  const cleanValue = strValue.replace(/[^0-9]/g, '') || '0';
  
  try {
    const value = BigInt(cleanValue);
    // Linera uses 18 decimals like ETH
    return Number(value) / 1e18;
  } catch {
    // If BigInt conversion fails, try parsing as float
    const parsed = parseFloat(strValue);
    return isNaN(parsed) ? 0 : parsed;
  }
}

// Parse human readable amount to attos
export function parseAmount(amount: number): string {
  const attos = BigInt(Math.floor(amount * 1e18));
  return attos.toString();
}

// Get configuration status
export function getConfig() {
  return {
    serviceUrl: LINERA_SERVICE_URL,
    chainId: CHAIN_ID,
    appId: APP_ID,
    isConfigured: !!APP_ID && APP_ID.length > 0,
  };
}
