// subject to change

export const PB_FREE_MODE = 'free_mode';
export const PB_UNLIMITED_MODE = 'unlimited_mode';

export const PB_UNLIMITED = 199;
export const PB_LIKE_PACKS = [0, 100, 200, 300, 500];
export const PB_TURBO = 100;

export type Pricebook = {
  current_mode: typeof PB_FREE_MODE | typeof PB_UNLIMITED_MODE;
  like_pack: (typeof PB_LIKE_PACKS)[number];
  transaction_fee: number;
  turbo: number;
};

export const pb_sum = (pb: Pricebook): number => {
  let price = pb.current_mode === PB_FREE_MODE ? 0 : PB_UNLIMITED;
  price += pb.like_pack;
  price += pb.transaction_fee;
  price += pb.turbo;

  return price;
};

export const pb_sync = (pb: Pricebook): Pricebook => {
  if (pb.current_mode === 'free_mode') {
    pb.like_pack = 0;
    pb.transaction_fee = 0;
    pb.turbo = 0;
  }

  if (pb.like_pack || pb.turbo) {
    pb.transaction_fee = 30;
  } else {
    pb.transaction_fee = 0;
  }

  if (pb.like_pack) {
    pb.transaction_fee += pb.like_pack * 0.029;
  }

  if (pb.turbo) {
    pb.transaction_fee += PB_TURBO * 0.029;
  }

  return pb;
};
