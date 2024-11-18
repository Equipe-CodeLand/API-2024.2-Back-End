import { Router } from 'express';
import { listBackups, downloadBackup, restoreFirestore } from '../controllers/backupController';
import path from 'path';
import fs from 'fs';

const backupRouter = Router();

// Rota para listar backups
backupRouter.get('/listar-backups', async (req, res) => {
  try {
    const backups = await listBackups();
    res.status(200).json(backups);
  } catch (error) {
    console.error("Erro ao listar backups:", error);
    res.status(500).json({ erro: "Falha ao listar backups" });
  }
});

// Rota para fazer o download de um backup específico
backupRouter.post('/baixar-backups', async (req, res) => {
  const { backupFileName } = req.body;

  if (!backupFileName) {
    return res.status(400).json({ erro: 'O nome do arquivo de backup é obrigatório.' });
  }

  try {
    const backupFilePath = await downloadBackup(backupFileName);

    res.status(200).download(backupFilePath, backupFileName, (err) => {
      if (err) {
        console.error('Erro ao enviar o arquivo:', err);
        res.status(500).json({ erro: 'Erro ao enviar o arquivo de backup' });
      }
    });
  } catch (error) {
    console.error("Erro ao baixar o backup:", error);
    res.status(500).json({ erro: 'Erro ao baixar o backup' });
  }
});

backupRouter.post('/restore-backups', async (req, res) => {
  const { backupFileName } = req.body;

  if (!backupFileName) {
    return res.status(400).json({ message: 'Nome do arquivo de backup é necessário' });
  }

  try {
    // Verificar se o arquivo de backup existe antes de tentar restaurar
    const backupFilePath = path.join(__dirname, '../backup/firestore_export/all_namespaces', 'all_documents', backupFileName);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ message: `Arquivo de backup não encontrado: ${backupFileName}` });
    }

    // Restaurar o backup no Firestore
    await restoreFirestore(backupFileName);

    // Retornar uma resposta de sucesso
    res.json({ message: `Backup restaurado com sucesso a partir do arquivo ${backupFileName}!` });
  } catch (error: unknown) {
    console.error('Erro ao restaurar backup:', error);

    // Verificar se o erro é uma instância de Error
    if (error instanceof Error) {
      // Se for um erro, acessa a propriedade message
      return res.status(500).json({ message: 'Erro ao restaurar backup', error: error.message });
    } else {
      // Caso o erro não seja do tipo Error, retornar uma mensagem genérica
      return res.status(500).json({ message: 'Erro desconhecido ao restaurar backup' });
    }
  }
});

export default backupRouter;