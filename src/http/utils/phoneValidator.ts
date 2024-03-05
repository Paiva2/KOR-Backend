export default function phoneValidator(phone: string) {
  const regex = /^\(\d{2}\) \d \d{4}-\d{4}$/;

  return regex.test(phone);
}
