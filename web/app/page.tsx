'use client';

import { useEffect, useState, useMemo } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { getTextsByScreenSize } from './config/textContent';
import { useTextLayout } from './hooks/useTextLayout';
import TextElement from './components/TextElement';
import {  checkAddress } from '@/contracts';
import { useNetworkVariable } from '@/config';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
          showEvents: true,
        },
      }),
  });
  const currentAccount = useCurrentAccount();
  // const admin = useNetworkVariable('adminId');
  const whitelistPackageId = useNetworkVariable('whitelistPackageId');
  const whitelistSharedObjectId = useNetworkVariable('whitelistSharedObjectId');
  const [result, setResult] = useState<{key: string, value: boolean}[]>([]);

  // const handleAddAddress = async () => {
  //   const addresses = [""];
  //   const tx = await addAddress(admin, whitelistPackageId, whitelistSharedObjectId, "WEB3", addresses);
  //   signAndExecuteTransaction({
  //     transaction: tx,
  //   }, {
  //     onError: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }

  const handleCheckAddress = async () => {
    if (currentAccount?.address && isValidSuiAddress(currentAccount.address)) {
      const tx = await checkAddress(whitelistPackageId, whitelistSharedObjectId, currentAccount.address);
      signAndExecuteTransaction({
        transaction: tx,
      }, {
        onSuccess: (res) => {
          const event = res.events?.[0].parsedJson as unknown as { result: { contents: {key: string, value: boolean}[] } };
          console.log(event);
          if (event) {
            setResult(event.result.contents);
          }
        },
      },);
    }
  }

  useEffect(() => {
    setResult([]);
  }, [currentAccount]);



  useEffect(() => {
    const updateSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const texts = useMemo(() => {
    if (screenSize.width === 0 || screenSize.height === 0) return [];
    return getTextsByScreenSize(screenSize.width, screenSize.height);
  }, [screenSize.width, screenSize.height]);

  const layoutElements = useTextLayout(texts, screenSize.width, screenSize.height);

  if (!layoutElements.length) return null;

  return (
    currentAccount?.address ? (
      <main className="min-h-screen w-full relative overflow-hidden">
        <header className="flex justify-between items-center rounded-full overflow-hidden w-full z-20 p-4">
          <p className="text-4xl sm:text-9xl font-permanent text-bright_red">Next Art</p>
          <ConnectButton />
        </header>

        {/* <Button className='bg-gradient-to-r from-bright_red to-safety_yellow' onClick={handleAddAddress}>Add Address</Button> */}
        <Button size='lg' className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-bright_red to-safety_yellow z-10' disabled={result.length > 0} onClick={handleCheckAddress}>Check If Whitelisted</Button>
        {result.length > 0 && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md px-4'>
          <div className='bg-white/10 backdrop-blur-md rounded-lg p-6 space-y-3 border border-white/20 shadow-xl'>
            <h3 className='text-xl font-semibold text-center mb-4 text-bright_red'>Whitelist Status</h3>
            {result.map(({key, value}) => (
              <div key={key} className='flex justify-between items-center p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors'>
                <span className='font-permanent font-medium truncate max-w-[200px]'>{key}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {value ? 'Whitelisted' : 'Not Whitelisted'}
                </span>
              </div>
            ))}
          </div>
        </div>}
        {layoutElements.map((element, index) => (
          <TextElement key={`${element.text}-${index}`} element={element} />
        ))}
      </main>
    ) : (
      <main className="min-h-screen w-full relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center rounded-full overflow-hidden w-full space-y-4 z-10">
          <p className="text-6xl sm:text-9xl font-permanent text-bright_red">Next Art</p>
          <ConnectButton />
        </div>

        {layoutElements.map((element, index) => (
          <TextElement key={`${element.text}-${index}`} element={element} />
        ))}
      </main>
    )
  );
}
