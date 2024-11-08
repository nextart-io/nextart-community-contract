import { fromHex, isValidSuiAddress, toHex } from "@mysten/sui/utils";
import { suiClient } from "@/config";
import { SuiObjectResponse } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";



export const getUserProfile = async (address: string): Promise<CategorizedObjects> => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Sui address");
  }

  let hasNextPage = true;
  let nextCursor: string | null = null;
  let allObjects: SuiObjectResponse[] = [];

  while (hasNextPage) {
    const response = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
      },
      cursor: nextCursor,
    });

    allObjects = allObjects.concat(response.data);
    hasNextPage = response.hasNextPage;
    nextCursor = response.nextCursor ?? null;
  }

  return categorizeSuiObjects(allObjects);
};

const Address = bcs.bytes(32).transform({
	// To change the input type, you need to provide a type definition for the input
	input: (val: string) => fromHex(val),
	output: (val) => toHex(val),
});
 

/*public fun add_address(_admin: &Admin, whitelist: &mut Whitelist, collection: String, addresses: vector<address>, _ctx: &mut TxContext) {
        let list = &mut whitelist.list;
        vec_map::insert(list,collection,addresses);
    }*/

export const addAddress = async (admin: string, whitelistPackageId: string, whitelistSharedObjectId: string, collection: string, addresses: string[]) => {
  const tx = new Transaction();
  tx.moveCall({
    package: whitelistPackageId,
    module: "whitelist",
    function: "add_address",
    arguments: [
      tx.object(admin),
      tx.object(whitelistSharedObjectId),
      tx.pure(bcs.string().serialize(collection).toBytes()),
      tx.pure(bcs.vector(Address).serialize(addresses).toBytes())
    ]
  })
  return tx;
}
/* public fun check_address(whitelist: &Whitelist, check: address): VecMap<String,bool> */
export const checkAddress = async (whitelistPackageId: string, whitelistSharedObjectId: string, check: string) => {
  const tx = new Transaction();
  tx.moveCall({
    package: whitelistPackageId,
    module: "whitelist",
    function: "check_address",
    arguments: [tx.object(whitelistSharedObjectId), tx.pure(Address.serialize(check).toBytes())]
  })
  return tx;
}
