const setting = {
  ownerName: "Koala Store",
  ownerNumber: ["628123456789"], // Ganti dengan nomor owner
  botName: "KoalaStore Bot",
  
  // WhatsApp Settings
  sessionName: "koala-session",
  
  // Store Settings
  storeName: "🐨 KOALA STORE",
  storeDescription: "Digital Solutions & Services",
  
  // Admin/Owner Commands
  adminCommands: ["addlist", "dellist", "updatelist", "setproses", "setdone"],
  ownerCommands: ["addproduk", "delproduk", "addsewa", "delsewa", "broadcast"],
  
  // Default Messages
  noCommand: "❌ Command tidak ditemukan!",
  onlyGroup: "❌ Command ini hanya bisa digunakan di grup!",
  onlyPrivate: "❌ Command ini hanya bisa digunakan di chat pribadi!",
  onlyAdmin: "❌ Command ini hanya untuk admin!",
  onlyOwner: "❌ Command ini hanya untuk owner!",
  
  // Bot Status
  public: true, // true = bot bisa digunakan semua orang, false = hanya owner
  
  // Media Settings
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.pdf']
};

export default setting; 