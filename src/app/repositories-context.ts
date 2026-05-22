import { createContext } from 'react';
import { repositories, type Repositories } from './composition-root';

export const RepositoriesContext = createContext<Repositories>(repositories);