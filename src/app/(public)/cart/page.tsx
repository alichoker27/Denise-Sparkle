import CartClient from "./CartClient";

export default function CartPage() {
  const configuredNumber = process.env.WHATSAPP_NUMBER?.replace(/\D/g, "");

  if (!configuredNumber || !/^[1-9]\d{6,14}$/.test(configuredNumber)) {
    throw new Error(
      "WHATSAPP_NUMBER must contain a valid international number with country code.",
    );
  }

  return <CartClient whatsappNumber={configuredNumber} />;
}