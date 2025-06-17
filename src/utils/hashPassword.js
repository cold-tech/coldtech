import bcrypt from 'bcryptjs';

// Função para gerar hash de senha
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Função para verificar senha
export const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Exemplo de uso para gerar hash para uma senha
export const generateHashExample = async () => {
  const password = 'admin123';
  const hashedPassword = await hashPassword(password);
  console.log('Hash gerado para senha:', hashedPassword);
  return hashedPassword;
};

// Para gerar um hash no console, descomente e execute esta linha
// generateHashExample().then(hash => console.log('Hash para inserir no banco:', hash));