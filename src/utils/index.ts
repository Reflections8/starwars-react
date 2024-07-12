export function formatNumberWithCommas(number?: number) {
  if (number) {
    const strNumber = number.toString();
    const parts = strNumber.split(".");
    let integerPart = parts[0];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length === 2) {
      return integerPart + "." + parts[1];
    } else {
      return integerPart;
    }
  }
}

export function formatWalletString(walletId: string) {
  if (walletId.length <= 18) {
    return walletId;
  }

  const firstPart = walletId.slice(0, 7);
  const lastPart = walletId.slice(-11);

  return `${firstPart}...${lastPart}`;
}
