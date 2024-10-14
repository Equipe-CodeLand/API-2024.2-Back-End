export default function TimestampFormatado(){
    // Obter a data e hora atuais
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = dataAtual.getFullYear();
    const horas = String(dataAtual.getHours()).padStart(2, '0');
    const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundos = String(dataAtual.getSeconds()).padStart(2, '0');
    
    const timestampFormatado = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;

    return timestampFormatado;
}