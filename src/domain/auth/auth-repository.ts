import type { AuthSession, Credentials, RegisterData } from './auth';

// Puerto de autenticacion. La capa data lo implementa (HttpAuthRepository);
// la presentacion lo recibe por el repositories-context, nunca importa data.
export interface AuthRepository {
  register(data: RegisterData): Promise<AuthSession>;
  login(credentials: Credentials): Promise<AuthSession>;
}
