const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'HerbertCraft.aternos.me', // CHANGE IP
  port: 31487,             // CHANGE PORT
  username: 'HerbertCraft'     // CHANGE THE USERNAME
});

// 1. SAFE LOGIN LOGIC
bot.on('spawn', () => {
  // THE FIX: Completely disable physics to stop 'true/false' boolean packets
  bot.physicsEnabled = false; 
  console.log('Physics disabled to prevent Boolean packet errors...');

  if (!bot.hasSpawned) {
    bot.hasSpawned = true;
    console.log('Bot spawned! Waiting for Purpur coordinate sync...');
    
    // Send AuthMe commands
    // REMOVE THEM IF YOU DONT USE LOGIN

    setTimeout(() => {
      startAntiAFK();
    }, 15000); // 15s delay to fix 'wasnt online' and 'x=true' errors
  }
});

// 2. SAFE ANTI-AFK (No glitchy packets)
async function startAntiAFK() {
  setInterval(async () => {
    if (!bot.entity?.position) return;

    try {
      // Randomized looking
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI;
      await bot.look(yaw, pitch, false);

      // Physics jump
      bot.setControlState('jump', true);
      await bot.waitForTicks(2);
      bot.setControlState('jump', false);

      bot.swingArm('right');
    } catch (e) {
      // Ignore errors if bot is dead/unspawned
    }
  }, 15000); // 15s interval to bypass most server anti-afk checks
}


bot.on('error', (err) => console.log('Error:', err));
bot.on('kicked', (reason) => console.log('Kicked for:', reason));
bot.on('end', () => {
  console.log('Bot disconnected. GitHub will restart this in 10s.');
  setTimeout(() => process.exit(1), 10000); 
});
