export interface IProducts {
    _id: string,
    name: string,
    price: number,
    image: string,
    description?: string,
    categories: string[];
    comments?: string[];
}