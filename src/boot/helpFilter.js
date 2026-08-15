import { date } from 'quasar'

const filters = {
  price(input) {
    if (isNaN(input)) {
      return "-";
    }
    return "$" + input.toFixed(2);
  },
  /**
   * Converte para string de USA ou BR moeda
   * @param {number|string} value 
   * @param {Boolean} br
   * @returns String
   */
  currentValue(value, br) {
    if (br) {
      return `R$ ${value}`;
    }
    return `$ ${value}`;
  },
  currentValueBR(value) {

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);

  },
  dateFormatBr(value) {
    let dateCurrent = new Date(value + " 00:00:00")
    return date.formatDate(dateCurrent, "DD/MM/YYYY")
  },
  /**
   * Formata valores numericos
   * @param {number|float} value numero para ser convertido para formato ex.:2.999,00
   * @returns valor convertido para 2 casas decimais e pontuação de milhar
   */
  formatPartternCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },
  /**
   * converte para dolar (data last update 30/04/2025) $exchange
   * @param {String|Number} value valor que sera convertido para o cambio
   * @param {Number|null} exchange valor do câmbio para ser dividido no calculo
   */
  convertCoin(value, exchange = 5.50) {
    // Verifica se o valor é uma string e remove os pontos que representam os milhares
    if (typeof value === 'string') {
      value = value.replace(/\./g, '');
    }
    // Substitui a vírgula decimal por um ponto
    let valorFinal = value.replace(',', '.');


    let converExchange = valorFinal / exchange

    return this.formatPartternCurrency(converExchange)
  },
  /**
   * conta principal verify
   * @param {String|Boolean} value 
   * @return "conta princapal" | ""
   */
  mainAccount(value) {
    let stringAccount = ''
    if (value) {
      stringAccount = 'Conta principal'
    }
    return stringAccount
  },
  /**
  * Rertona porcentagem
  */
  percenteCalc(value, numberBase) {
    let por = (value / numberBase) * 100;
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(por);
  }

};
export default filters;
