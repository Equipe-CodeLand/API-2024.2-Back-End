-- Tabela de Usuários
CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL,
  perfil ENUM('Admin', 'Leitor') DEFAULT 'Leitor',
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Estações Meteorológicas
CREATE TABLE Estacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  uid VARCHAR(255),
  cep VARCHAR(255),
  numero INT,
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  rua VARCHAR(255),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Parâmetros
CREATE TABLE Parametro (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estacaoId INT,
  unidade VARCHAR(20) NOT NULL,
  fator FLOAT NOT NULL,
  offset FLOAT NOT NULL,
  valorMinimo FLOAT NOT NULL,
  valorMaximo FLOAT NOT NULL,
  descricao VARCHAR(255),
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estacaoId) REFERENCES Estacao(id)
);

-- Tabela de Alertas
CREATE TABLE Alerta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estacaoId INT,
  parametroId INT,
  mensagemAlerta VARCHAR(255) NOT NULL,
  tipoAlerta ENUM('perigo', 'atencao') NOT NULL,
  dataHora DATETIME NOT NULL,
  condicao ENUM('<', '>', '==', '>=', '<=') NOT NULL,
  valor FLOAT NOT NULL,
  criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estacaoId) REFERENCES Estacao(id),
  FOREIGN KEY (parametroId) REFERENCES Parametro(id)
);

-- Tabela de Notificações
CREATE TABLE Notificacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alertaId INT NOT NULL,
  parametroId INT NOT NULL,
  mensagemAlerta VARCHAR(255) NOT NULL,
  dataNotificacao DATETIME NOT NULL,
  FOREIGN KEY (alertaId) REFERENCES Alerta(id),
  FOREIGN KEY (parametroId) REFERENCES Parametro(id)
);
