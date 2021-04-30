import { usePool } from "@vocdoni/react-hooks";
import { CensusErc20Api } from "dvote-js";
import { providers } from "ethers";
import useSWR from "swr";
import { useWallet } from "use-wallet";
import { TokenInfo } from "../../types";

export const getProof = async (wallet, token, poolPromise) => {
  try {
    const pool = await poolPromise;
    const holderAddr = wallet.account;
    const balanceSlot = CensusErc20Api.getHolderBalanceSlot(holderAddr, 0);
    const processEthCreationBlock = await pool.provider.getBlockNumber();
    const { proof } = await CensusErc20Api.generateProof(
      token.address,
      [balanceSlot],
      processEthCreationBlock - 1,
      pool.provider as providers.JsonRpcProvider
    );

    return { proof, pool };
  } catch (error) {
    console.log("Error on getProof in useCensusProof: ", error.message);
    throw new Error(error.message);
  }
};
export const useCensusProof = (token: Partial<TokenInfo>) => {
  const { poolPromise } = usePool();
  const wallet = useWallet();

  const { data } = useSWR([wallet, token, poolPromise], getProof, {
    isPaused: () => !token || !wallet,
    refreshInterval: 20000,
  });

  return data;
};
