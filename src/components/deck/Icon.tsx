import * as L from "lucide-react";
/** Maps the emoji used in content.json to Lucide line icons — one visual language across the deck. */
const MAP: Record<string, L.LucideIcon> = {
  "🧱": L.BrickWall, "🖥️": L.Monitor, "🎨": L.Palette, "🎯": L.Target, "⚙️": L.Settings, "⚖️": L.Scale, "🔁": L.Repeat, "♿": L.Accessibility, "🌍": L.Globe, "📱": L.Smartphone,
  "✅": L.CheckCircle2, "🗄️": L.Database, "🔐": L.Lock, "🔄": L.RefreshCw, "🌐": L.Globe2, "🛡️": L.Shield, "⚠️": L.AlertTriangle, "⚛️": L.Atom, "📤": L.Upload, "📊": L.BarChart3,
  "🔍": L.Search, "🧩": L.Puzzle, "🔒": L.LockKeyhole, "🧾": L.Receipt, "🚫": L.Ban, "🏝️": L.TreePalm, "🔎": L.ScanSearch, "📺": L.Tv, "📏": L.Ruler, "⏳": L.Hourglass,
  "🏢": L.Building2, "☁️": L.Cloud, "💡": L.Lightbulb, "🤝": L.Handshake, "🛒": L.ShoppingCart, "📲": L.TabletSmartphone, "🧠": L.Brain, "🚨": L.Siren, "📥": L.Download, "🎭": L.Drama,
  "👨‍⚕️": L.Stethoscope, "🧭": L.Compass, "👁️": L.Eye, "🧅": L.Layers, "📋": L.ClipboardList, "🧯": L.FireExtinguisher, "🧹": L.Brush, "♻️": L.Recycle, "📝": L.FileText, "⌨️": L.Keyboard,
  "📡": L.RadioTower, "🔌": L.Plug, "⚡": L.Zap, "🕰️": L.Clock, "🔬": L.Microscope, "🚗": L.Car, "🚘": L.CarFront, "🕶️": L.Glasses, "💳": L.CreditCard, "🚕": L.CarTaxiFront,
  "🏫": L.School, "💬": L.MessageCircle, "🏠": L.Home, "🎓": L.GraduationCap, "🕸️": L.Network, "📧": L.Mail, "🛍️": L.ShoppingBag, "📸": L.Camera, "✍️": L.PenLine, "🤖": L.Bot,
  "🧬": L.Dna, "✨": L.Sparkles, "🏭": L.Factory, "⬛": L.Square, "📉": L.TrendingDown, "📹": L.Video, "🔑": L.KeyRound, "📜": L.ScrollText, "👆": L.Pointer, "🏰": L.Castle,
  "🚇": L.TrainFront, "💻": L.Laptop, "🧮": L.Calculator, "🛠️": L.Wrench, "📚": L.Library, "💥": L.Bomb, "🎲": L.Dices, "🥇": L.Medal, "🏗️": L.Construction, "🖼️": L.Image,
  "📦": L.Package, "🙋": L.Hand, "📨": L.MailOpen, "▲": L.Triangle, "🏷️": L.Tag, "👤": L.User, "🔆": L.Sun, "🧲": L.Magnet, "🧑": L.UserRound, "📐": L.DraftingCompass,
  "🔢": L.Hash, "📈": L.TrendingUp, "🧑‍🔬": L.FlaskConical, "↩️": L.Undo2, "🧪": L.TestTubeDiagonal, "🔨": L.Hammer, "👥": L.Users, "⏱": L.Timer, "🔗": L.Link2, "📞": L.Phone,
};
export default function Icon({ e, size = 30, strokeWidth = 2 }: { e?: string; size?: number; strokeWidth?: number }) {
  if (!e) return null;
  const C = MAP[e] ?? MAP[e.replace(/\uFE0F/g, "")];
  return C ? <C size={size} strokeWidth={strokeWidth} /> : <span>{e}</span>;
}
