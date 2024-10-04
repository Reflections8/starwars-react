export function formatNumberWithCommas(number?: number) {
  if (number) {
    if (number == 0) return "0";
    const strNumber = number.toString();
    const parts = strNumber.split(".");
    let integerPart = parts[0];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (parts.length === 2) {
      return integerPart + "." + parts[1];
    } else {
      return integerPart;
    }
  } else return "0";
}

export function formatWalletString(walletId: string) {
  if (walletId.length <= 18) {
    return walletId;
  }

  const firstPart = walletId.slice(0, 7);
  const lastPart = walletId.slice(-11);

  return `${firstPart}...${lastPart}`;
}

export function formatBalance(balance: number | undefined): string {
  if (!balance) return "0";
  if (balance < 1) {
    return parseFloat(balance.toFixed(4)).toString();
  } else if (balance < 10) {
    return parseFloat(balance.toFixed(2)).toString();
  } else if (balance < 10000) {
    return parseFloat(balance.toFixed(1)).toString();
  } else {
    return (balance / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
}
