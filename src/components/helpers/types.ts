
export interface FPMMMarket {
  deadline: string;
  is_active: boolean;
  is_settled: boolean;
  num_outcomes: number;
}

export interface FPMMMarketInfo {
  active: boolean;
  created_at: string;
  deadline: string;
  description: string;
  icon: string;
  market_id: number;
  category: string;
  outcomes: FPMMOutcome[];
  question: string;
  settled: boolean;
  fight_image?: string;
}

export interface Outcome {
  name: string;
  bought_shares: string;
}

export interface FPMMOutcome {
  name: string;
  numSharesInPool: number;
  winner: boolean;
}

export interface UserPosition {
  amount: number;
  has_claimed: boolean;
}
export interface UserBet {
  outcome: Outcome;
  position: UserPosition;
}

export interface ContractData{
  numOutcomes:number,
  deadline:number,
  isActive:boolean,
  isSettled:boolean
}
export interface ContractReadResult {
  data: ContractData | undefined;
  error: Error | null;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  status: string;
}
