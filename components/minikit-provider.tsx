'use client';

import { ReactNode, useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export default function MiniKitProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    const init = async () => {
        const r = MiniKit.install('app_59c12ce689127aa7e62a6a223522755a');
    };

    init();
  }, []);

  return <>{children}</>;
}
