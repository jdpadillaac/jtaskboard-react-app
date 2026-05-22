import type { ReactNode } from 'react';
import { repositories } from './composition-root';
import { RepositoriesContext } from './repositories-context';

interface RepositoriesProviderProps {
  children: ReactNode;
}

export function RepositoriesProvider({ children }: RepositoriesProviderProps) {
  return (
    <RepositoriesContext.Provider value={repositories}>
      {children}
    </RepositoriesContext.Provider>
  );
}