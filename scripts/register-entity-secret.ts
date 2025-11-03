import { generateEntitySecret, registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

async function registerNewEntitySecret() {
  try {
    console.log("Step 1: Generating new entity secret...\n");
    generateEntitySecret();

    console.log("\n⚠️  COPY THE ENTITY SECRET SHOWN ABOVE");
    console.log("Then paste it when prompted...\n");

    // Wait for user input
    process.stdin.resume();
    const entitySecret = await new Promise<string>((resolve) => {
      console.log("Paste entity secret here:");
      process.stdin.once('data', (data) => {
        resolve(data.toString().trim());
        process.stdin.pause();
      });
    });

    console.log("\n===========================================");
    console.log("Using entity secret:", entitySecret);
    console.log("===========================================\n");

    const apiKey = process.env.VITE_CIRCLE_API_KEY;

    if (!apiKey) {
      console.error("Error: CIRCLE_API_KEY environment variable not set");
      console.log("Please set it with: export CIRCLE_API_KEY=your_api_key");
      process.exit(1);
    }

    console.log("Step 2: Registering entity secret with Circle...");
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
