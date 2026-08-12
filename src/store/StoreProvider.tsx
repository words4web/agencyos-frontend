'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};
