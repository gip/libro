'use client';

import { ReactNode, useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    const init = async () => {
        const r = MiniKit.install(process.env.NEXT_PUBLIC_WLD_CLIENT_ID);
    };

    init();
  }, []);

  return <>{children}</>;
}
