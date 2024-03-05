export default function cnpjValidator(cnpj: string) {
  const regex =
    /^(?:(?:(?:\d{2}\.){2}\d{3}\/\d{4}-\d{2})|(?:(?:\d{2}\/){2}\d{4}-\d{2})|\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;

  return regex.test(cnpj);
}
