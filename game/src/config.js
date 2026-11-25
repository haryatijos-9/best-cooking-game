// Burger Blitz — recipes, toppings and the kitchen layout.
// Every zone rect here is shared by the renderer and the input handler,
// so a click always lands where the drawing says it does.

export const VIEW = { w: 1280, h: 720 };
export const SHIFT_SECONDS = 150;
export const MAX_ORDERS = 3;
export const ORDER_PATIENCE = 42;
export const ORDER_SPAWN_EVERY = 11;
export const PATTY_COOK_TIME = 4;
export const PATTY_BURN_TIME = 9;
export const WRONG_SERVE_PENALTY = 25;
export const EXPIRED_PENALTY = 15;

export const TOPPINGS = {
  patty:  { label: 'Patty',  color: '#7a4a21', dark: '#5d3413', kind: 'patty' },
  cheese: { label: 'Cheese', color: '#f7c948', dark: '#d9a41f', kind: 'slice' },
  lettuce:{ label: 'Lettuce',color: '#58b368', dark: '#3d8f4d', kind: 'leaf' },
  tomato: { label: 'Tomato', color: '#e4572e', dark: '#b73a1a', kind: 'round' },
  onion:  { label: 'Onion',  color: '#f2ead8', dark: '#cfc3a8', kind: 'rings' },
  bacon:  { label: 'Bacon',  color: '#c0392b', dark: '#8e2318', kind: 'strip' },
  topbun: { label: 'Top bun', color: '#e8b04b', dark: '#b57e24', kind: 'bun' },
};

export const RECIPES = [
  { id: 'classic',  name: 'Classic',        price: 8,  layers: ['patty'] },
  { id: 'cheese',   name: 'Cheeseburger',   price: 10, layers: ['patty', 'cheese'] },
  { id: 'double',   name: 'Double Trouble', price: 14, layers: ['patty', 'patty', 'cheese'] },
  { id: 'blt',      name: 'BLT Burger',     price: 13, layers: ['patty', 'bacon', 'lettuce', 'tomato'] },
  { id: 'veggie',   name: 'Garden Veggie',  price: 11, layers: ['lettuce', 'tomato', 'onion', 'cheese'] },
  { id: 'deluxe',   name: 'Deluxe Stack',   price: 18, layers: ['patty', 'cheese', 'bacon', 'lettuce', 'tomato', 'onion'] },
];

export const CUSTOMERS = ['Maya', 'Dimas', 'Sinta', 'Budi', 'Rani', 'Agus', 'Lia', 'Fajar', 'Nina', 'Eko'];

// Kitchen zones (x, y, w, h) in the 1280x720 canvas.
export const ZONES = {
  orders: { x: 16, y: 84, w: 284, h: 118, gap: 12 },
  grill:  { x: 336, y: 108, w: 76, h: 76, gap: 16, labelY: 84 },
  bins:   { x: 336, y: 330, w: 74, h: 74, gap: 12, labelY: 306 },
  plate:  { x: 724, y: 108, w: 296, h: 224 },
  serve:  { x: 1052, y: 120, w: 212, h: 84 },
  trash:  { x: 1052, y: 220, w: 212, h: 52 },
  start:  { x: 490, y: 430, w: 300, h: 72 },
  restart:{ x: 490, y: 470, w: 300, h: 72 },
};

export const BIN_ORDER = ['cheese', 'lettuce', 'tomato', 'onion', 'bacon', 'topbun'];
