import { registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

async function registerNewEntitySecret() {
  try {
    const entitySecret = process.env.CIRCLE_ENTITY_SECRET;
    const apiKey = process.env.VITE_CIRCLE_API_KEY;

    if (!entitySecret || entitySecret === 'not-configured') {
      console.error("❌ CIRCLE_ENTITY_SECRET not configured in .env");
      process.exit(1);
    }

    if (!apiKey) {
      console.error("❌ VITE_CIRCLE_API_KEY not configured in .env");
      process.exit(1);
    }

    console.log("🔄 Registering entity secret with Circle...\n");
    console.log("Entity Secret:", entitySecret.substring(0, 10) + "...");
    console.log("API Key:", apiKey.substring(0, 20) + "...\n");

    const response = await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
    });

    if (response.data?.recoveryFile) {
      const recoveryFilePath = "./recovery_file.dat";
      fs.writeFileSync(recoveryFilePath, response.data.recoveryFile);
      console.log(`\n✅ Recovery file saved to: ${recoveryFilePath}`);
      console.log("⚠️  IMPORTANT: Store this file securely. Required for account recovery.\n");
    }

    console.log("✅ Entity secret registration complete!");
    console.log("\nNext: Add this to your .env file:");
    console.log(`CIRCLE_ENTITY_SECRET=${entitySecret}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

registerNewEntitySecret();
