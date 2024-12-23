import { ulid } from "ulid";

export type Product = {
  id: string;
  name: string;
  desc: string;
  hargaPokok: number;
  keuntungan: number;
  hargaJual: number;
  stock: number;
};

export const initialProducts: Product[] = [
  {
    id: ulid(),
    name: "Espresso",
    desc: "Strong and bold",
    hargaPokok: 1.5,
    keuntungan: 1.0,
    hargaJual: 2.5,
    stock: 50,
  },
  {
    id: ulid(),
    name: "Cappuccino",
    desc: "Creamy with a perfect balance",
    hargaPokok: 2.0,
    keuntungan: 1.5,
    hargaJual: 3.5,
    stock: 40,
  },
  {
    id: ulid(),
    name: "Latte",
    desc: "Smooth and milky",
    hargaPokok: 2.25,
    keuntungan: 1.5,
    hargaJual: 3.75,
    stock: 45,
  },
  {
    id: ulid(),
    name: "Americano",
    desc: "Classic and simple",
    hargaPokok: 1.75,
    keuntungan: 1.25,
    hargaJual: 3.0,
    stock: 55,
  },
  {
    id: ulid(),
    name: "Mocha",
    desc: "Chocolate-coffee indulgence",
    hargaPokok: 2.5,
    keuntungan: 1.5,
    hargaJual: 4.0,
    stock: 35,
  },
  {
    id: ulid(),
    name: "Macchiato",
    desc: "Espresso with a touch of milk",
    hargaPokok: 2.0,
    keuntungan: 1.25,
    hargaJual: 3.25,
    stock: 30,
  },
  {
    id: ulid(),
    name: "Flat White",
    desc: "Strong yet creamy",
    hargaPokok: 2.25,
    keuntungan: 1.5,
    hargaJual: 3.75,
    stock: 40,
  },
  {
    id: ulid(),
    name: "Affogato",
    desc: "Ice cream meets espresso",
    hargaPokok: 3.0,
    keuntungan: 1.5,
    hargaJual: 4.5,
    stock: 25,
  },
  {
    id: ulid(),
    name: "Cold Brew",
    desc: "Smooth and refreshing",
    hargaPokok: 2.25,
    keuntungan: 1.5,
    hargaJual: 3.75,
    stock: 50,
  },
  {
    id: ulid(),
    name: "Iced Latte",
    desc: "Chilled coffee perfection",
    hargaPokok: 2.5,
    keuntungan: 1.5,
    hargaJual: 4.0,
    stock: 45,
  },
];
