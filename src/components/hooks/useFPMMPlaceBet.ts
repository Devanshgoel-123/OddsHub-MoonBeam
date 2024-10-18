import { enqueueSnackbar } from "notistack";
import { contractAddress } from "../helpers/constants";
import { abi } from "../../abi/FPMMMarket.json";
import { useEffect, useState, useMemo } from "react";
import { useAccount, useWriteContract, useWaitForTransaction } from "wagmi";
import useGetMinShares from "./useGetMinShares";
import axios from "axios";
import { getBalance as fetchBalance } from "@wagmi/core";

const useFPMMPlaceBet = (marketId: number, betAmount: string, choice: number) => {
  const { address } = useAccount(); // Get user's Ethereum address
  const [balance, setBalance] = useState("");
  const [decimals, setDecimals] = useState(18); // ETH typically has 18 decimals
  const [updatedShares, setUpdatedShares] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Fetch minimum shares required using custom hook
  const { minAmount } = useGetMinShares(marketId, betAmount, choice, decimals);

  // Memoized contract write arguments
  const args = useMemo(() => {
    if (
      !address ||
      !(parseFloat(betAmount) > 0) ||
      !marketId ||
      decimals === 0 ||
      !(parseFloat(minAmount) > 0)
    ) {
      return [];
    }
    return [
      marketId,
      BigInt(parseFloat(betAmount) * 10 ** decimals), // Convert bet amount to wei
      choice,
      BigInt(minAmount), // Minimum amount to buy
    ];
  }, [address, betAmount, marketId, decimals, minAmount]);

  // Write the contract call
  const { writeAsync, data, isError: writeError } = useWriteContract({
    abi,
    address: contractAddress,
    functionName: "buy",
    args,
    enabled: args.length > 0, // Enable only when args are valid
  });

  // Monitor transaction status
  const { isPending, isSuccess, data: txData } = useWaitForTransaction({
    hash: data?.hash,
  });

  // Fetch ETH balance from user's wallet
  const getBalance = async () => {
    if (!address) return;
    const balanceWei = await fetchBalance({ address });
    const balanceEther = Number(balanceWei.value) / 10 ** decimals;
    setBalance(balanceEther.toString());
  };

  useEffect(() => {
    getBalance();
  }, [address]);

  // Update the shares for the market once the transaction is successful
  const updateShares = async () => {
    if (!marketId || !betAmount || !minAmount || updatedShares) return;
    await axios
      .post(`${process.env.SERVER_URL}/update-market`, {
        marketId,
        outcomeIndex: choice,
        amount: (parseFloat(betAmount) * 10 ** 18).toString(), // Convert ETH to wei
        isBuy: true,
        sharesUpdated: parseInt(minAmount),
      })
      .then(() => {
        console.log("Shares updated successfully");
      })
      .catch((error) => {
        console.error("Error updating market:", error);
      });
    setUpdatedShares(true);
  };

  // Transaction handling
  useEffect(() => {
    if (isPending) {
      handleToast(
        "Transaction Pending",
        "Your transaction is being processed, please wait for a few seconds.",
        "info",
        txData?.hash
      );
      setPending(true);
    }

    if (isError || writeError) {
      handleToast(
        "Oh shoot!",
        "Something unexpected happened, check everything from your side while we check what happened on our end and try again.",
        "error"
      );
      setIsError(true);
    }

    if (isSuccess) {
      handleToast(
        "Prediction Placed Successfully!",
        "Watch out for the results in 'My bets' section. PS - Good luck with your prediction.",
        "success",
        txData?.hash
      );
      updateShares();
      getBalance(); // Refresh the balance after placing the bet
      setSuccess(true);
    }
  }, [isPending, isSuccess, isError, writeError]);

  // Helper function to handle snackbars
  const handleToast = (message: string, subHeading: string, type: string, hash?: string) => {
    enqueueSnackbar(message, {
      variant: "custom",
      subHeading,
      hash,
      type,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
  };

  return { balance, minAmount, writeAsync, decimals, pending, success, isError };
};

export default useFPMMPlaceBet;
