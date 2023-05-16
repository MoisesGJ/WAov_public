const qrcode = require("qrcode-terminal");
const mi_numero = '521XXXXXXXXXX@c.us';

const {
  Client,
  LocalAuth
} = require("whatsapp-web.js");



const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("CARGANDO", percent, message);
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTENTICADO");
});

client.on("auth_failure", (msg) => {
  console.error("ERROR EN LA AUTENTICACION", msg);
});

client.on("ready", () => {
  console.clear();
  console.log("CONECTADO CON EXITO\n\n");
  client.sendMessage(mi_numero, "CONECTADO");
});

client.on("message", async (msg) => {  

  if (msg._data.isViewOnce) {
    const media = await msg.downloadMedia();   
    let ext  = '';

    if ( msg.body != "" ) {
        ext = "\n\n*Texto extraído:* " + msg.body;
    }

    client.sendMessage(mi_numero, media, {
      caption:
        "Para ver solo una vez de *" +
        msg._data.notifyName + "*" + ext        
    });
  } else if (msg.body === '!ping') {
    client.sendMessage(msg.from, 'pong');
  }

});

client.on('message_revoke_everyone', async (after, before) => {
    if (before) {
      client.sendMessage(mi_numero, 'Eliminado de *' + after._data.notifyName + '*: ' + before.body);
    }
});

client.on('disconnected', (reason) => {
    console.log('Cliente deslogueado', reason);
});
