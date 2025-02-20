document.addEventListener('DOMContentLoaded', () => {
  const swapButton = document.querySelector('.swap-btn');

  if (swapButton) {
    swapButton.addEventListener('click', () => {
      const fromCurrencySelect = document.getElementById('from-currency');
      const toCurrencySelect = document.getElementById('to-currency');

      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;

      fromCurrencySelect.value = toCurrency;
      toCurrencySelect.value = fromCurrency;
    })
  }

});