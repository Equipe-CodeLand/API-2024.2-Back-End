import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { storage } from '../config';

const bucketName = 'bucket-de-migracoes';
const backupBaseDir = path.join(__dirname, '../backup/firestore_export');

// Função para fazer backup de todas as coleções do Firestore
async function backupFirestore() {
  const db = admin.firestore();
  const collections = await db.listCollections();
  const backupData: { [key: string]: any[] } = {};

  for (const collection of collections) {
    const collectionName = collection.id;
    const snapshot = await collection.get();
    backupData[collectionName] = [];

    snapshot.forEach(doc => {
      backupData[collectionName].push({ id: doc.id, ...doc.data() });
    });
  }

  const currentDate = moment().format('YYYY-MM-DD');

  // Criar o diretório de backup se não existir
  const backupDir = path.join(__dirname, '../backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Criar um arquivo temporário para o backup com a data no nome
  const backupFileName = `firestore_backup_${currentDate}.json`;
  const backupFilePath = path.join(backupDir, backupFileName);
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

  console.log(`Arquivo de backup criado em: ${backupFilePath}`);

  // Fazer upload do arquivo para o Google Cloud Storage
  try {
    await uploadFile(backupFilePath, `backups/${backupFileName}`);
    console.log(`Arquivo de backup carregado com sucesso para o Google Cloud Storage.`);
  } catch (error) {
    console.error(`Erro ao fazer upload do arquivo de backup para o Google Cloud Storage:`, error);
  }

  // Remover o arquivo temporário após o upload
  fs.unlinkSync(backupFilePath);
  console.log(`Arquivo de backup local removido.`);
}

// Função para fazer upload de um arquivo para o Google Cloud Storage
async function uploadFile(filePath: string, destination: string) {
  const bucket = storage.bucket('bucket-de-migracoes');

  try {
    await bucket.upload(filePath, {
      destination,
    });
    console.log(`${filePath} uploaded to ${destination}`);
  } catch (error) {
    console.error(`Erro ao fazer upload do arquivo: ${filePath} para o destino: ${destination}`, error);
    throw error;
  }
}

// Função para listar backups no Google Cloud Storage
async function listBackups() {
  try {
    const [files] = await storage.bucket('bucket-de-migracoes').getFiles({ prefix: 'backups/' });
    return files.map(file => file.name);
  } catch (error) {
    console.error("Erro ao listar backups:", error);
    throw error;
  }
}

// Função para fazer o download de um backup do Google Cloud Storage
async function downloadBackup(backupFileName: string) {
  const backupDir = path.join(__dirname, '../backup/firestore_export');

  // Criar a estrutura de diretórios necessária
  const allNamespacesDir = path.join(backupDir, 'all_namespaces', 'all_documents');
  const firebaseMetadataFilePath = path.join(backupDir, 'firebase-export-metadata.json');
  const firestoreMetadataFilePath = path.join(backupDir, 'firestore_export.overall_export_metadata');
  const allDocumentsMetadataFilePath = path.join(backupDir, 'all_namespaces', 'all_documents.export_metadata');

  // Criar os diretórios se não existirem
  if (!fs.existsSync(allNamespacesDir)) {
    fs.mkdirSync(allNamespacesDir, { recursive: true });
  }
  if (!fs.existsSync(path.dirname(firebaseMetadataFilePath))) {
    fs.mkdirSync(path.dirname(firebaseMetadataFilePath), { recursive: true });
  }
  if (!fs.existsSync(path.dirname(firestoreMetadataFilePath))) {
    fs.mkdirSync(path.dirname(firestoreMetadataFilePath), { recursive: true });
  }
  if (!fs.existsSync(path.dirname(allDocumentsMetadataFilePath))) {
    fs.mkdirSync(path.dirname(allDocumentsMetadataFilePath), { recursive: true });
  }

  // Caminho onde o arquivo será salvo localmente
  const backupFilePath = path.join(backupDir, 'all_namespaces', 'all_documents',backupFileName);

  try {
    // Baixar o arquivo do Google Cloud Storage
    const file = storage.bucket(bucketName).file(`backups/${backupFileName}`);
    await file.download({ destination: backupFilePath });

    console.log(`Backup ${backupFileName} baixado com sucesso para ${backupFilePath}`);

    // Criar os metadados necessários para a estrutura
    const firebaseMetadataContent = {
      version: "13.24.1",
      firestore: {
        version: "1.19.8",
        path: "firestore_export",
        metadata_file: "firestore_export/firestore_export.overall_export_metadata"
      }
    };
    fs.writeFileSync(firebaseMetadataFilePath, JSON.stringify(firebaseMetadataContent, null, 2));

    const firestoreMetadataContent = {
      metadata: {
        version: "1.13.1",
        timestamp: new Date().toISOString(),
        export_format_version: "1",
        file_counts: {
          all_namespaces: 1
        }
      }
    };
    fs.writeFileSync(firestoreMetadataFilePath, JSON.stringify(firestoreMetadataContent, null, 2));

    const allDocumentsMetadataContent = {
      file_metadata: {
        all_documents: {
          count: 1,
          files: [
            `all_documents/${backupFileName}`
          ]
        }
      }
    };
    fs.writeFileSync(allDocumentsMetadataFilePath, JSON.stringify(allDocumentsMetadataContent, null, 2));

    return backupFilePath;  // Retornar o caminho local do arquivo
  } catch (error) {
    console.error(`Erro ao baixar o backup ${backupFileName}:`, error);
    throw error;
  }
}

// Função para restaurar o backup do Firestore
async function restoreFirestore(backupFileName: string) {
  if (process.env.FIREBASE_LOCAL !== 'true') {
    throw new Error("A restauração do backup só pode ser realizada na instância local do Firestore.");
  }

  const db = admin.firestore();

  // Construir o caminho completo do arquivo de backup
  const backupFilePath = path.join(backupBaseDir, 'all_namespaces', 'all_documents', backupFileName);

  try {
    // Verificar se o arquivo de backup existe
    if (!fs.existsSync(backupFilePath)) {
      throw new Error(`Arquivo de backup não encontrado: ${backupFilePath}`);
    }

    // Ler o arquivo de backup
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

    console.log(`Backup file loaded from ${backupFilePath}`);

    // Iterar sobre as coleções e restaurar os dados
    for (const collectionName in backupData) {
      if (backupData.hasOwnProperty(collectionName)) {
        const collection = backupData[collectionName];

        for (const document of collection) {
          const { id, ...data } = document;

          try {
            // Inserir ou substituir documentos no Firestore
            await db.collection(collectionName).doc(id).set(data);
            console.log(`Restaurado: ${collectionName} - ${id}`);
          } catch (error) {
            console.error(`Erro ao restaurar documento ${collectionName} - ${id}:`, error);
          }
        }
      }
    }

    console.log('Restauro concluído!');

    // Limpar o diretório após a restauração ser concluída
    fs.rmdirSync(backupBaseDir, { recursive: true });
    console.log(`Diretório ${backupBaseDir} limpo após restauração.`);
    
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
  }
}

export { backupFirestore, listBackups, downloadBackup, restoreFirestore };
