import { Product } from "@/config/products";
import { siteConfig } from "@/config/site";

export function generateWhatsappLink(items: Product[]) {
  let text = siteConfig.whatsappMessage + "\n\n";
  let total = 0;

  items.forEach((item) => {
    total += Number(item.price);
    text += `• ${item.name} - R$ ${item.price}\n`;
  });

  text += `\n🧾 *Total do pedido:* R$ ${total.toFixed(2)}`;
  text += `\n\n💳 Pode me enviar a *chave PIX* para pagamento?`;

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`;
}
