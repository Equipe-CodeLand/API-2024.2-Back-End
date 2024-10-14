// função para poder acessar os enums dentro das interfaces
export default function isValorEnum<T extends object>(enumObj: T, valor: string): boolean {
    return Object.values(enumObj).includes(valor as unknown as T[keyof T]);
}